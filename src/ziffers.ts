import { parse } from './parser/parser.ts';
import {DEFAULT_DURS, DEFAULT_OPTIONS} from './defaults.ts';
import { noteFromPc, midiToFreq } from './scale.ts';

interface Options {
    nodeOptions?: NodeOptions;
    transform?: Function
    defaultDurs?: {[key: string]: number}
}

interface NodeOptions {
    key?: string;
    scale?: string;
    duration?: number;
}

interface Node {
    type: string;
    value: string;
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
}

interface RepeatNode extends Node {
    value: Node;
    times: number;
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
    values: (Node|RepeatNode)[];
    evaluated: Node[];
    options: Options;

    constructor(input: string, options: NodeOptions = {}) {
        console.log("Parsing:", input);
        // Merge options with default options
        options = {...DEFAULT_OPTIONS, ...options};
        this.options = {nodeOptions: options, transform: transform, defaultDurs: DEFAULT_DURS};

        // TODO: Parse scala workshop format

        try {
           this.values = parse(input, this.options);
           // TODO: Evaluate
           this.evaluate();
        } catch (ex: any) {
            console.log(ex);
            // Handle parsing error
            // [...]
            this.values = [];
            this.evaluated = [];
        }
    }

    evaluate() {
        // Evaluate
        this.evaluated = evaluateNodes(this.values);
    }

    pitches() {
        return this.evaluated.map((item: Node) => {
            return values.pitch;
        });
    }

}

const evaluateNodes = (nodes: Node[]) => {
    return nodes.map((node) => {
        if(node.type === 'repeat') {
            const times = node.times;
            // Duplicate values given times
            const repeated = [...Array(times)].map(() => node.value).flat(Infinity);
            return evaluateNodes(repeated);
        }
        return node;
    }).flat(Infinity);
}

// Function to transform the AST node on parse time
const transform = (node: Node) => {
    if(node.type === 'pitch') {
        const [note, bend] = noteFromPc(node.key!, node.pitch!, node.scale!);
        node.note = note;
        node.freq = midiToFreq(note);
        if(bend) node.bend = bend;
    }
} 

export const zparse = (input: string, options: NodeOptions ) => {
    return new Ziffers(input, options);
}