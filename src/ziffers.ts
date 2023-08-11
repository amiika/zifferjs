import { parse as parseZiffers } from './parser/ziffersParser.ts';
import { parse as parseScala } from './parser/scalaParser.ts';
import {DEFAULT_OPTIONS, OPERATORS, isScale} from './defaults.ts';
import { noteFromPc, midiToFreq, scaleLength } from './scale.ts';
import {LRUCache} from 'lru-cache';
import seedrandom from 'seedrandom';

const zcache = new LRUCache({max: 1000, ttl: 1000 * 60 * 5});

interface Options {
    nodeOptions?: NodeOptions;
    transform?: Function
    defaultDurs?: {[key: string]: number}
}

interface NodeOptions {
    key?: string;
    scale?: string|number[];
    duration?: number;
    index?: number;
    port?: string;
    channel?: number;
    velocity?: number;
    seed?: string;
    degrees?: boolean;
    redo?: number;
}

interface Node extends NodeOptions {
    // Common
    type: string;
    text: string;
    location: Location;
    // Pitch
    pitch?: number;
    freq?: number;
    note?: number;
    octave?: number;
    bend?: number;
    // Chord
    pitches?: Node[];
    // List operation
    left?: Node[];
    right?: Node[];
    operation?: string;
    // Repeat
    times?: number;
    item?: Node;
    // Random node
    min?: number;
    max?: number;
    // Cycle
    cycle: Cycle;
}

export class Cycle {
    items: Node[];
    index: number;
    constructor(items: Node[]) {
        this.items = items;
        this.index = 0;
        console.log("Creating cycle", this.index);
     }
    next() {
        console.log("Getting cycle", this.index);
        let value = this.items[this.index%this.items.length];
        console.log(value);
        // While value is a cycle
        while(value instanceof Cycle) {
            value = value.next();
        }
        this.index = this.index+1;
        return value;
    }
}

interface Location {
    end: Position;
    start: Position;
}

interface Position {
    offset: number;
    line: number;
    column: number;
}

export class Ziffers {
    values: Node[];
    evaluated: Node[];
    options: Options;
    index: number;
    random: Function;
    rerun: number;

    constructor(input: string, options: NodeOptions = {}) {
        this.index = 0;
        // Merge options with default options. TODO: Ignore some common options like degrees?
        options = {...DEFAULT_OPTIONS, ...options};

        // Parse scala format if scale is not a scale name
        if(options.scale && typeof options.scale === 'string' && !isScale(options.scale)) {
            options.scale = parseScala(options.scale);
        }

        if(options.seed) {
            this.random = seedrandom(options.seed);
        } else {
            this.random = Math.random;
        }

        console.log("OPTIONS", options)
        
        if(options.redo !== undefined) {
            this.rerun = options.redo;
        } else {
            this.rerun = 1;
        }

        this.options = {nodeOptions: options};

        try {
           this.values = parseZiffers(input, this.options);
           this.evaluated = this.evaluateNodes(this.values);
        } catch (ex: any) {
            console.log(ex);
            // Handle parsing error
            // [...]
            this.values = [];
            this.evaluated = [];
        }
    }

    evaluate() {
        this.evaluated = this.evaluateNodes(this.values);
    }

    pitches(): (number|undefined)[] {
        return this.evaluated.map((item: Node) => {
            return item.pitch;
        })
    }

    notes(): (number|undefined)[] {
        return this.evaluated.map((item: Node) => {
            return item.note;
        });
    }

    next() {
        const value = this.evaluated[this.index%this.evaluated.length];
        this.index++;
         if(this.rerun > 0 && this.index >= this.evaluated.length*this.rerun) {
            console.log(this.rerun);
            this.index = 0;
            this.evaluate();
        }
        return value;
    }

    evaluateNodes(nodes: Node[]): Node[] {
        return nodes.map((node: Node) => {
            node = {...node} as Node;
            if(node.type === 'pitch') {
                return node;
            } else if(node.type === 'repeat') {
                const times = node.times;
                // Duplicate values given times
                const repeated = [...Array(times)].map(() => node.item).flat(Infinity) as Node[];
                return this.evaluateNodes(repeated);
            } else if(node.type == 'cycle') {
                const nextItem = node.cycle.next();
                return this.evaluateNodes([nextItem]);
            } else if(node.type === 'list_operation') {
                const left = node.left!;
                const right = node.right!;
                // Parse operator from string to javascript operator
                const operator = OPERATORS[node.operation as string];
                // Create pairs of elements
                const pairs: [Node, Node][] = right.flatMap((r: Node) => {
                    return left.map((l: Node) => {
                        return [{...r} as Node, {...l} as Node] as [Node,Node]
                    })
                });
                // Do pairwise operations
                const result: Node[] = pairs.map((p: [Node, Node]) => {
                    p[0].pitch = operator(p[0].pitch, p[1].pitch);
                    return updateNode(p[0]);
                });
                return result;
            } else if(node.type === 'random_pitch') {
                if(!node.min) node.min = 0;
                if(!node.max) node.max = scaleLength(node.scale!);
                node.pitch = Math.floor(this.random() * (node.max - node.min + 1)) + node.min;
                return updateNode(node);
            }
            return undefined;
        }).flat(Infinity).filter((node) => node !== undefined) as Node[];
    }

}

const generateCacheKey = (...args: any[]) => {
    return args.map(arg => JSON.stringify(arg)).join(',');
  }

const cachedCall = (a: string, b: NodeOptions): Ziffers => {
    const cacheKey = generateCacheKey(a, b);
    if (zcache.has(cacheKey)) {
        const cached = zcache.get(cacheKey) as Ziffers;
        return cached;
    } else {
        const result = new Ziffers(a, b);
        zcache.set(cacheKey, result);
        return result;
    }
}

const updateNode = (node: Node, options?: NodeOptions) => {
    if(options) {
        // Merge options to node, overwrite values from node
        node = {...node, ...options} as Node;
    }
    node.note = noteFromPc(node.key!, node.pitch!, node.scale!, node.octave)[0];
    node.freq = midiToFreq(node.note);
    node.type = "pitch";
    return node;
}

// Function to transform the AST node on parse time
export const transform = (node: Node) => {
    if(node.type === 'pitch') {
        const [note, bend] = noteFromPc(node.key!, node.pitch!, node.scale!, node.octave!);
        node.note = note;
        node.freq = midiToFreq(note);
        if(bend) node.bend = bend;
    }
}

export const pattern = (input: string, options: object = {}) => {
    return new Ziffers(input, options);
}

export const cache = (input: string, options: NodeOptions = {}) => {
    return cachedCall(input, options);
}

export const next = (input: string, options: NodeOptions = {}) => {
    const fromCache = cachedCall(input, options);
    return fromCache.next();
}

export const get = (input: string, options: NodeOptions = {}): Node => {   
    if(options.index) {
        let index = options.index;
        delete options.index;
        let fromCache = cachedCall(input, options);
        index = index%fromCache.evaluated.length;
        fromCache.index = index+1;
        return fromCache.evaluated[index];
    }
    const fromCache = cachedCall(input, options);
    return fromCache.next();
}

export const note = (input: string, options: NodeOptions = {}): number => {
    return get(input, options).note!;
}

export const pitch = (input: string, options: NodeOptions = {}): number => {
    return get(input, options).pitch!;
}

export const freq = (input: string, options: NodeOptions = {}): number => {
    return get(input, options).freq!;
}

export const clear = (input: string, options: NodeOptions = {}): void => {
    const cacheKey = generateCacheKey(input, options);
    zcache.delete(cacheKey);
}
