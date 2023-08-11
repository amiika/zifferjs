import { parse as parseZiffers } from './parser/ziffersParser.ts';
import { parse as parseScala } from './parser/scalaParser.ts';
import {DEFAULT_OPTIONS, OPERATORS, isScale} from './defaults.ts';
import { noteFromPc, midiToFreq } from './scale.ts';
import {LRUCache} from 'lru-cache';

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
}

interface Node {
    type: string;
    text: string;
    location: Location;
    duration?: number;
    pitch?: number;
    pitches?: Node[];
    freq?: number;
    key?: string;
    scale?: string;
    note?: number;
    octave?: number;
    bend?: number;
    item?: Node;
    left?: Node[];
    right?: Node[];
    operation?: string;
    times?: number;
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

    constructor(input: string, options: NodeOptions = {}) {
        this.index = 0;
        // Merge options with default options
        options = {...DEFAULT_OPTIONS, ...options};

        // Parse scala format if scale is not a scale name
        if(options.scale && typeof options.scale === 'string' && !isScale(options.scale)) {
            options.scale = parseScala(options.scale);
        }

        this.options = {nodeOptions: options};

        try {
           this.values = parseZiffers(input, this.options);
           this.evaluated = evaluateNodes(this.values);
        } catch (ex: any) {
            console.log(ex);
            // Handle parsing error
            // [...]
            this.values = [];
            this.evaluated = [];
        }
    }

    evaluate() {
        this.evaluated = evaluateNodes(this.values);
    }

    pitches() {
        return this.evaluated.map((item: Node) => {
            return item.pitch;
        });
    }

    notes() {
        return this.evaluated.map((item: Node) => {
            return item.note;
        });
    }

    next() {
        const value = this.evaluated[this.index%this.evaluated.length];
        this.index++;
        return value;
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

const evaluateNodes = (nodes: Node[]): Node[] => {
    return nodes.map((node: Node) => {
        if(node.type === 'pitch') {
            return node;
        } else if(node.type === 'repeat') {
            const times = node.times;
            // Duplicate values given times
            const repeated = [...Array(times)].map(() => node.item).flat(Infinity) as Node[];
            return evaluateNodes(repeated);
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
        }
        return undefined;
    }).flat(Infinity).filter((node) => node !== undefined) as Node[];
}

const updateNode = (node: Node, options?: NodeOptions) => {
    if(options) {
        // Merge options to node, overwrite values from node
        node = {...node, ...options} as Node;
    }
     node.note = noteFromPc(node.key!, node.pitch!, node.scale!)[0];
    node.freq = midiToFreq(node.note);
    return node;
}

// Function to transform the AST node on parse time
export const transform = (node: Node) => {
    if(node.type === 'pitch') {
        const [note, bend] = noteFromPc(node.key!, node.pitch!, node.scale!);
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
