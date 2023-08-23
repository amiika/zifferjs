import { noteFromPc, midiToFreq, scaleLength, safeScale } from './scale.ts';
import { OPERATORS, getScale, getRandomScale } from './defaults.ts';
import { deepClone } from './utils.ts';

export const globalOptionKeys: string[] = ["retrograde"];

export type GlobalOptions = {
    retrograde?: boolean;
}

export type Options = {
    nodeOptions?: NodeOptions;
    defaultDurs?: {[key: string]: number};
    
}

export type NodeOptions = {
    key?: string;
    scale?: string|number[];
    parsedScale?: number[]|undefined;
    scaleName?: string;
    duration?: number;
    octave?: number;
    index?: number;
    port?: string;
    channel?: number;
    velocity?: number;
    degrees?: boolean;
    redo?: number;
    seed?: string;
    randomSeed?: string;
    seededRandom?: Function;
    globalOptions?: GlobalOptions;
    retrograde?: boolean;
}

export type ChangingOptions = {
    octave?: number;
    duration?: number;
    scale?: string;
    key?: string;
}

export type Node = NodeOptions & {
    // Common
    type: string;
    text: string;
    location: Location;
    // Pitch
    pitch?: number;
    freq?: number;
    note?: number;
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

type Location = {
    end: Position;
    start: Position;
}

type Position = {
    offset: number;
    line: number;
    column: number;
}

export abstract class Base {
    type!: string;
    text!: string;
    location!: Location;
    constructor(data: Partial<Node>) {
        this.type = this.constructor.name;
        Object.assign(this, data);
    }
    public clone(): any {
          return deepClone(this);
    }
    collect<K extends keyof Base>(name: K): Base[K] {
        return this[name];
    }
    refresh(): void {
        // Overwrite in subclasses
    }
    // @ts-ignore
    evaluate(options: ChangingOptions = {}): Base|Base[]|undefined {
        return undefined;
    }
}

export abstract class Event extends Base {
    duration!: number;
    _next!: number;
    _prev!: number;
    modifiedEvent: Event|undefined = undefined;
    globalOptions!: GlobalOptions;

    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    next(): number {
        // TODO: Call modified event next instead?
        return this._next;
    }
    previous(): number {
        return this._prev;
    }
    collect(name: string): any {
        // Overwrite in subclasses
        // @ts-ignore
        return this[name];
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

    skip(): Event { return this }

    scale(_scale: string|number[]): Event { return this }

    randomScale(): Event { return this }

    retrograde(): Event { return this }

    asObject(): object {
        const attributes: Record<keyof this, any> = {} as Record<keyof this, any>;
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                attributes[key as keyof this] = this[key as keyof this];
            }
        }
        return attributes;
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

    evaluate(options: ChangingOptions = {}): Pitch {
        if(options.octave) this.octave = options.octave + (this.octave || 0);
        if(options.duration || options.duration === 0) this.duration = options.duration;
        if(options.scale) this.parsedScale = safeScale(options.scale) as number[];
        if(options.key) this.key = options.key;
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

    randomScale(): Pitch {
        this.parsedScale = getRandomScale();
        return this.evaluate();
    }
}

export class Chord extends Event {
    pitches!: Pitch[];
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
        this.duration = Math.max(...this.pitches.map((pitch) => pitch.duration!));
    }
    evaluate(options: ChangingOptions = {}): Pitch[] {
        return this.pitches.map((pitch) => pitch.evaluate(options));
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
    evaluate(options: ChangingOptions = {}): Rest {
        if(options.duration) this.duration = options.duration;
        return this;
    }
}

export class RandomPitch extends Pitch {
    min!: number;
    max!: number;
    randomSeed?: string;
    seededRandom?: Function;
    random: Function;

    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
        if(!data.min) this.min = 0;
        if(!data.max) this.max = scaleLength(this.parsedScale!);
        if(this.seededRandom) {
             this.random = this.seededRandom;
        } else {
            this.random = Math.random;
        }
    }
    evaluate(options: ChangingOptions = {}): Pitch {
        const randomValue = this.random();
        this.pitch = Math.floor(randomValue * (this.max - this.min + 1)) + this.min;
        const pitch = new Pitch(this as object).evaluate(options);
        return pitch;
    }
}

export class OctaveChange extends Base {
    octave!: number;
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate(options: ChangingOptions = {}) {
        options.octave = this.octave + (options.octave || 0);
        return undefined;  
    }
}

export class DurationChange extends Base {
    duration!: number;
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate(options: ChangingOptions = {}) {
        options.duration = this.duration;
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
    evaluate(options: ChangingOptions = {}): Pitch[] {
        const repeated = [...Array(this.times)].map(() => this.item).flat(Infinity) as Base[];
        return repeated.map((item) => { return item.evaluate(options) }) as Pitch[];
    }
}

export class List extends Base {
    items!: Base[];
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate(options: ChangingOptions = {}): Pitch[] {
        return this.items.map((item: Base) => { return item.evaluate(options); }) as unknown as Pitch[];
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
    evaluate(options: ChangingOptions = {}): Pitch[] {
        this.left.evaluate(options);
        this.right.evaluate(options);
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
            return p[0].evaluate(options);
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
    nextItem(options: ChangingOptions = {}): Base | Base[] | undefined {
        let value = this.items[this.index%this.items.length] as Base|Base[]|undefined;
        while(value instanceof Cycle) {
            value = value.nextItem(options);
        }
        this.index = this.index+1;
        if(value instanceof Base) {
            return value.evaluate(options);
        }
        return value; 
    }
    evaluate(options: ChangingOptions = {}): Base | Base[] | undefined {
        const value = this.nextItem(options);
        return value;
    }

}
