import { noteFromPc, midiToFreq, scaleLength } from './scale.ts';
import { OPERATORS, getScale } from './defaults.ts';
import seedrandom from 'seedrandom';

export interface Options {
    nodeOptions?: NodeOptions;
    transform?: Function
    defaultDurs?: {[key: string]: number}
}

export interface NodeOptions {
    key?: string;
    scale?: string|number[];
    parsedScale?: number[]|undefined;
    scaleName?: string;
    duration?: number;
    index?: number;
    port?: string;
    channel?: number;
    velocity?: number;
    seed?: string;
    degrees?: boolean;
    redo?: number;
}

export interface Node extends NodeOptions {
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

export class Base {
    text!: string;
    location!: Location;
    constructor(data: Partial<Node>) {
        Object.assign(this, data);
    }
    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
    collect<K extends keyof Base>(name: K): Base[K] {
        return this[name];
    }
    refresh(): void {
        // Overwrite in subclasses
    }
    evaluate(): Base|Base[]|undefined {
        return undefined;
    }
}

export class Event extends Base {
    duration!: number;
    nextEvent!: Event;
    prevEvent!: Event;
    modifiedEvent!: Event|undefined;
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    next(): Event {
        return this.nextEvent;
    }
    previous(): Event {
        return this.prevEvent;
    }
    collect(name: string): any {
        // Overwrite in subclasses
        // @ts-ignore
        return this[name];
    }
    // @ts-ignore
    scale(scale: name): void {
        // Overwrite in subclasses
    }
    sometimesBy(probability: number, func: Function): Event {
        if(Math.random() < probability) {
            return this.modify(func);
        }
        return this;
    }
    sometimes(func: Function): Event {
        return this.sometimesBy(0.5, func);
    }
    rarely(func: Function): Event {
        return this.sometimesBy(0.1, func);
    }
    often(func: Function): Event {
        return this.sometimesBy(0.9, func);
    }
    update(func: Function): Event {
        func(this);
        this.refresh();
        return this;
    }
    modify(func: Function): Event {
        this.modifiedEvent = this.clone();
        func(this.modifiedEvent);
        this.modifiedEvent!.refresh();
        return this.modifiedEvent!;
    }
    skip(): Event {
        return this;
    }
}

export class Start extends Event {
    constructor() {
        super({});
    }
}

export class Pitch extends Event {
    pitch!: number;
    freq?: number;
    note?: number;
    octave?: number;
    bend?: number;
    key?: string;
    parsedScale?: string|number[];
    scaleName?: string;

    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }

    static createTracked(data: Partial<Node>): Pitch {
        const eventHandler = {
          set(target: any, property: string, value: any) {
            if (target[property] !== value) {
              target[property] = value;
              if(property === "pitch" || property === "key" || property === "parsedScale" || property === "octave") {
                console.log(`${property} has changed to ${value}`);
                  target.refresh();
              }
                    }
            return true;
          }
        };
    
        const instance = new Pitch(data);
        return new Proxy(instance, eventHandler);
    }

    refresh(): void {
        this.evaluate();
    }
    evaluate(): Pitch {
        const [note,bend] = noteFromPc(this.key!, this.pitch!, this.parsedScale!, this.octave!);
        this.note = note;
        this.freq = midiToFreq(this.note);
        if(bend) {
            this.bend = bend;
        }
        return this;
    }
    collect<K extends keyof Pitch>(name: K): Pitch[K] {
        return this[name];
    }
    scale(name: string): Pitch {
        if(this.scaleName!==name) {
            this.scaleName = name;
            this.parsedScale = getScale(name) as number[];
            return this.evaluate();
        }
        return this;
    }
}

export class Chord extends Event {
    pitches!: Pitch[];
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
        this.duration = Math.max(...this.pitches.map((pitch) => pitch.duration!));
    }
    evaluate(): Pitch[] {
        return this.pitches.map((pitch) => pitch.evaluate());
    }
    collect<K extends keyof Pitch>(name: K): Pitch[K] {
        const collect = this.pitches.map((pitch: Pitch) => pitch.collect(name)) as unknown as Pitch[K];
        return collect;
    }
    scale(name: string): Chord {
        this.pitches.forEach((pitch) => pitch.scale(name));
        return this;
    }
}

export class Rest extends Event {
    constructor(data: Partial<Node>) {
        super(data);
    }
}

export class RandomPitch extends Pitch {
    min!: number;
    max!: number;
    seed?: string;
    random: Function;

    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
        if(!data.min) this.min = 0;
        if(!data.max) this.max = scaleLength(this.parsedScale!);
        if(this.seed) {
             this.random = seedrandom(this.seed);
        } else {
            this.random = Math.random;
        }
    }
    evaluate(): Pitch {
        this.pitch = Math.floor(this.random() * (this.max - this.min + 1)) + this.min;
        return super.evaluate();
    }
}

export class OctaveChange extends Base {
    octave!: number;
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate() {
        return undefined;  
    }
}

export class DurationChange extends Base {
    duration!: number;
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate() {
        return undefined;
    }
}

export class Repeat extends Base {
    times!: number;
    item!: Base[];
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate(): Pitch[] {
        const repeated = [...Array(this.times)].map(() => this.item).flat(Infinity) as Base[];
        return repeated.map((item) => { return item.evaluate() }) as Pitch[];
    }
}

export class List extends Base {
    items!: Base[];
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate(): Pitch[] {
        return this.items.map((item: Base) => { return item.evaluate(); }) as unknown as Pitch[];
    }
}

export class ListOperation extends Base {
    left!: List;
    right!: List;
    operation!: string;
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate(): Pitch[] {
        this.left.evaluate();
        this.right.evaluate();
        // Parse operator from string to javascript operator
        const operator = OPERATORS[this.operation];
        // Create pairs of elements
        const pairs: [Pitch, Pitch][] = this.right.items.flatMap((r) => {
            return this.left.items.map((l) => {
                return [r.clone(), l.clone()] as [Pitch, Pitch];
            });
        });
        // Do pairwise operations
        const result: Pitch[] = pairs.map((p: [Pitch, Pitch]) => {
            p[0].pitch = operator(p[0].pitch, p[1].pitch);
            return p[0].evaluate();
        });
        return result;
    }
}

export class Cycle extends Event {
    items!: Base[];
    index: number;
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
        this.index = 0;
    }
    next(): Pitch|Chord|Rest {
        let value = this.items[this.index%this.items.length] as Pitch|Chord|Rest;
        while(value instanceof Cycle) {
            value = value.next();
        }
        this.index = this.index+1;
        // If index is out of bounds, evaluate
        if(this.index >= this.items.length) {
            this.index = 0;
            this.refresh();
        }
        return value;
    }
    refresh(): void {
        this.items = this.items.map((item: Base) => item.evaluate()) as Base[];
    }
    evaluate(): Base {
        this.refresh();
        return this;
    }
    collect<K extends keyof Pitch>(name: K): Pitch[K] {
        const item = this.next();
        return (item as Pitch|Chord).collect(name);
    }
}
