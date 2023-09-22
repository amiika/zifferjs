import { noteFromPc, midiToFreq, scaleLength, safeScale, parseRoman, chordFromDegree, midiToPitchClass, namedChordFromDegree } from './scale.ts';
import { OPERATORS, getScale, getRandomScale, DEFAULT_DURATION } from './defaults.ts';
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
    key?: string|number;
    add?: number;
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
    subdivisions?: boolean;
    inversion?: number;
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
        return this;
    }
}

export abstract class Event extends Base {
    duration!: number;
    modifiedEvent: Event|undefined = undefined;
    globalOptions!: GlobalOptions;

    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
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

    getExisting(...args: string[]): {[key: string]: any} {
        const existing = args.reduce((acc, value) => {
            if(Object.prototype.hasOwnProperty.call(this, value)) {
                acc[value] = this[value as keyof this];
            }
            return acc;
        }, {} as {[key: string]: any});
        return existing;
    }

}

export class Pitch extends Event {
    pitch!: number;
    add?: number;
    freq?: number;
    note?: number;
    octave?: number;
    bend?: number;
    key?: string|number;
    parsedScale?: string|number[];
    scaleName?: string;

    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
     }

    refresh(): void {
        this.evaluate();
    }

    evaluate(options: ChangingOptions = {}): Pitch {
        const clone = deepClone(this);
        if(options.octave) clone.octave = options.octave + (clone.octave || 0);
        if(!clone.duration) {
            clone.duration = (options.duration || options.duration === 0) ? options.duration : DEFAULT_DURATION;
        }
        if(options.scale) clone.parsedScale = safeScale(options.scale) as number[];
        if(options.key) clone.key = options.key;
        const [note,bend] = noteFromPc(clone.key!, clone.pitch!, clone.parsedScale!, clone.octave!);
        clone.note = clone.add ? note+clone.add : note;
        clone.freq = midiToFreq(clone.note);
        if(bend) {
            clone.bend = bend;
        }
        return clone;
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

export class Sample extends Pitch {
    sample!: string;
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
}

export class Chord extends Event {
    pitches!: Pitch[];
    chordName?: string;
    inversion?: number;
    key?: number|string;
    scaleName?: string;
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
        if(this.pitches && this.pitches.length > 0) {
            this.duration = Math.max(...this.pitches.map((pitch) => pitch.duration!));
         }
    }
    evaluate(options: ChangingOptions = {}): Chord {
        const dupChord = deepClone(this);
        if(options.inversion || dupChord.inversion) {
            dupChord.pitches = dupChord.invert((options.inversion || dupChord.inversion)!, options);
        } else {
            dupChord.pitches = dupChord.pitches.map((pitch) => pitch.evaluate(options));
        }
        dupChord.duration = Math.max(...dupChord.pitches.map((pitch) => pitch.duration!));
        return dupChord;
    }
    collect<K extends keyof Pitch>(name: K): Pitch[K] {
        const collect = this.pitches.map((pitch: Pitch) => pitch.collect(name)) as unknown as Pitch[K];
        return collect;
    }
    notes(): number[] {
        return this.pitches.map((pitch) => pitch.note!) as number[];
    }
    freqs(): number[] {
        return this.pitches.map((pitch) => pitch.freq!) as number[];
    }
    scale(name: string): Chord {
        this.pitches.forEach((pitch) => pitch.scale(name));
        return this;
    }
    invert(value: number, options: ChangingOptions = {}): Pitch[] {
        const newPcs = value < 0 ? this.pitches.reverse() : this.pitches;
        for (let i = 0; i < Math.abs(value); i++) {
            const pc = newPcs[i % newPcs.length];
            if (!pc.octave) pc.octave = 0;
            pc.octave += value <= 0 ? -1 : 1;
        }
        return newPcs.map((pitch) => pitch.evaluate(options));
    }
    voiceLeadFromNotes(leadedNotes: number[], options: NodeOptions): void {
        this.pitches = this.pitches.map((p: Pitch, i: number) => {
            if(leadedNotes[i]) {
                const newPitch = midiToPitchClass(leadedNotes[i], options.key, options.scaleName);
                const pc = deepClone(p);
                pc.pitch = newPitch.pc;
                pc.octave = newPitch.octave;
                pc.add = newPitch.add;
                pc.text = newPitch.text;
                pc.note = leadedNotes[i];
                pc.freq = midiToFreq(leadedNotes[i]);
                return pc;
            } else return deepClone(p);
        });
    }
}

export class Roman extends Chord {
    roman!: string;
    romanNumeral!: number;
    octave?: number;
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate(options: ChangingOptions = {}): Roman {
        const dup = deepClone(this);
        dup.romanNumeral = parseRoman(dup.roman);
        const key = dup.key || options.key || 60;
        const scale = dup.scaleName || options.scale || "MAJOR";

        const parsedScale = safeScale(scale) as number[];
        let octave = (dup.octave || 0) + (options.octave || 0);
        const chord = dup.chordName ? namedChordFromDegree(dup.romanNumeral, dup.chordName, key, scale, octave) : chordFromDegree(dup.romanNumeral, scale, key, octave);
        const pitchObj = chord.map((note) => {
            return midiToPitchClass(note,key,scale);
        });
        dup.pitches = pitchObj.map((pc) => {
            const pitchOct = octave+pc.octave;
            return new Pitch({pitch: pc.pc, octave: pitchOct, key: key, parsedScale: parsedScale, add: pc.add, duration: this.duration}).evaluate(options);
        });
        if(options.inversion || dup.inversion) {
            const inversion = options.inversion || dup.inversion;
            dup.pitches = dup.invert(inversion!, options);
        }
        dup.duration = Math.max(...dup.pitches.map((pitch) => pitch.duration!));
        return dup; 
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
        pitch.type = "Pitch";
        pitch.text = pitch.pitch.toString();
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

export class Subdivision extends Base {
    duration!: number;
    items!: (Pitch|Chord|Rest|Subdivision)[];
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate(options: ChangingOptions = {}): Subdivision {
        options.subdivisions = true;
        const dup = deepClone(this);
        dup.duration = options.duration || DEFAULT_DURATION;
        dup.items = dup.items.map((item: Base) => { return item.evaluate(options); }).flat(Infinity) as unknown as Pitch[];
        return dup;
    }
}

export class RepeatList extends Base {
    times!: number;
    items!: Base[];
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate(options: ChangingOptions = {}): Pitch|Chord|Rest[] {
        const evaluated = this.items.map((item) => { return item.evaluate(options) }) as Pitch|Chord|Rest[];
        const repeated = [...Array(this.times)].map(() => evaluated).flat(Infinity)  as Pitch|Chord|Rest[];
        return repeated;
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
