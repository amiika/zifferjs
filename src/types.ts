import { noteFromPc, midiToFreq, scaleLength, safeScale, parseRoman, midiToPitchClass, namedChordFromDegree, noteNameToMidi, getScaleNotes, getChordFromScale } from './scale.ts';
import { OPERATORS, getScale, getRandomScale, DEFAULT_DURATION } from './defaults.ts';
import { deepClone } from './utils.ts';
import { Tetrachord, TonnetzSpaces, TriadChord, chordFromTonnetz, seventhsTransform, transform } from './tonnetz.ts';

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
    sound?: string;
    soundIndex?: number|RandomPitch;
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
    // Sound
    sound?: string;
    soundIndex?: number;
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
    evaluateValue(): any {
        return this.text;
    }

    toString(): string {
        return this.text;
    }
}

export abstract class Event extends Base {
    duration!: number;
    modifiedEvent: Event|undefined = undefined;
    globalOptions!: GlobalOptions;
    sound?: string|Base;
    soundIndex?: number|RandomPitch;

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
                const val = this[value as keyof this];
                if(val || val===0) acc[value] = this[value as keyof this];
            }
            return acc;
        }, {} as {[key: string]: any});
        return existing;
    }
    mapExisting(fromKeys: string[], toKeys: string[]): {[key: string]: any} {
        const existing = fromKeys.reduce((acc, value, index) => {
            if(Object.prototype.hasOwnProperty.call(this, value)) {
                const val = this[value as keyof this];
                if(val || val===0) acc[toKeys[index]] = this[value as keyof this];
            }
            return acc;
        }, {} as {[key: string]: any});
        return existing;
    }
}

export class Pitch extends Event {
    pitch!: number|RandomPitch;
    originalPitch?: number;
    add?: number;
    freq?: number;
    note?: number;
    octave?: number;
    pitchOctave?: number;
    bend?: number;
    key?: string|number;
    parsedScale?: number[];
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
        if(!clone.duration) {
            clone.duration = (options.duration || options.duration === 0) ? options.duration : DEFAULT_DURATION;
        }
        if(options.scale) {
            if(typeof options.scale === "string" && clone.scaleName !== options.scale) {
                clone.scaleName = options.scale;
                if(clone.originalPitch) {
                    clone.pitch = clone.originalPitch;
                    clone.pitchOctave = 0;
                    clone.octave = 0;
                }
            }
            clone.parsedScale = safeScale(options.scale) as number[];
        }
        if(options.key) clone.key = options.key;
        if(options.soundIndex || options.soundIndex===0) {
            if(!(typeof options.soundIndex === "number")) {
                clone.soundIndex = (options.soundIndex as Event).evaluateValue() as unknown as number;
            } else {
                clone.soundIndex = options.soundIndex;
            }
        }
        if(options.sound) {
            if(!(typeof options.sound === "string")) {
                clone.sound = (options.sound as Event).evaluateValue() as unknown as string; 
            } else { 
                clone.sound = options.sound;
            }
        }
        if(clone.pitch || clone.pitch === 0) {
            if(clone.pitch instanceof RandomPitch) {
                clone.pitch = clone.pitch.evaluateValue();
            }
            if(clone.parsedScale && clone.pitch >= clone.parsedScale.length) {
                clone.originalPitch = clone.pitch;
                clone.pitchOctave = Math.floor(clone.pitch / clone.parsedScale.length);
                clone.pitch = clone.pitch % clone.parsedScale.length;
            }
            if(options.octave || clone.pitchOctave) clone.octave = (options.octave || 0) + (clone.pitchOctave || 0);
            const [note,bend] = noteFromPc(clone.key!, (clone.pitch as number)!, clone.parsedScale!, clone.octave!);
            clone.note = clone.add ? note+clone.add : note;
            clone.freq = midiToFreq(clone.note);
            if(bend) {
                clone.bend = bend;
            }
        }
        if(clone.soundIndex instanceof RandomPitch) {
            clone.soundIndex = clone.soundIndex.evaluateValue();
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

    tonnetzChord(chordType: string, tonnetz: TonnetzSpaces = [3,4,5]): Chord {
        const chordNotes = chordFromTonnetz(this.note!, chordType, tonnetz);
        const pitches = chordNotes.map((note) => {
            const rootedNote = note + (typeof this.key == "number" ? note : noteNameToMidi(this.key!)) + ((this.octave||0)*12); 
            const pitchClass = midiToPitchClass(rootedNote, this.key!, this.scaleName!);

            const pitch = new Pitch({
                note: rootedNote, 
                duration: this.duration, 
                key: this.key, 
                parsedScale: this.parsedScale, 
                scaleName: this.scaleName, 
                pitch: pitchClass.pc, 
                octave: (this.octave||0)+pitchClass.octave, 
                add: pitchClass.add, 
                text: pitchClass.text
            });
            return pitch as unknown as Node;
        });
        return new Chord({pitches: pitches, duration: this.duration});
    }
}

export class Sound extends Pitch {
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluateValue() {
        return this.sound;
    }
}

export class SoundEvent extends Event {
    item!: Base
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate(options?: ChangingOptions): Event|Event[]|undefined {
        let soundValue = this.sound;
        if(options) {
            options.sound = soundValue as string;
        } else {
            options = {sound: soundValue as string}
        }
        const node: Event = this.item.evaluate(options) as Event;
        return node;
    }
}

export class SoundIndex extends Event {
    item!: Base;
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate(options?: ChangingOptions): Event|Event[]|undefined {
        if(options) {
            options.soundIndex = this.soundIndex;
        } else {
            options = {soundIndex: this.soundIndex}
        }
        return this.item.evaluate(options) as Event;
    }
}

export class Chord extends Event {
    pitches!: Pitch[];
    chordName?: string;
    inversion?: number;
    key?: number|string;
    scaleName?: string;
    parsedScale?: number[];
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
        if(this.pitches && this.pitches.length > 0) {
            this.duration = Math.max(...this.pitches.map((pitch) => pitch.duration!));
         }
    }
    static fromPitchClassArray(pcs: number[], key: string|number, scaleName: string): Chord {
        const pitches = pcs.map((pc) => {
            return new Pitch({pitch: pc, key: key, scaleName: scaleName, parsedScale: safeScale(scaleName)}) as unknown as Node;
        });
        return new Chord({pitches: pitches});
    }
    evaluate(options: ChangingOptions = {}): Chord {
        const dupChord = deepClone(this);
        if(options.scale) {
            if(typeof options.scale === "string") dupChord.scaleName = options.scale;
            dupChord.parsedScale = safeScale(options.scale) as number[];
        }
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
    pcs(): number[] {
        return this.pitches.map((pitch) => pitch.pitch!) as number[];
    }
    midiChord(): {[key: string]: any} {
        const params = this.pitches.map((pitch) => pitch.mapExisting(["note","soundIndex"],["note","channel"]));
        return params;
    }
    scale(name: string): Chord {
        if(this.scaleName!==name) return this.evaluate({scale: name})
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

    triadTonnetz(transformationInput: string, tonnetz: TonnetzSpaces = [3,4,5], transformFunc: Function = transform): Chord|Chord[] {
        const notes = this.notes();
        if(notes.length === 3) {
            const splittedTransforms = transformationInput.split(" ");
            const allTransforms = splittedTransforms.map((transformation) => {
                const transformedChord = (transformFunc(notes as TriadChord, transformation, tonnetz) as TriadChord)?.sort((a,b) => a-b);
                if(!transformedChord) return this;
                const parsedScale = this.pitches[0].parsedScale!;
                const chord = new Chord({pitches: transformedChord.map((pc) => {
                    const newPC = midiToPitchClass(pc, this.key, this.scaleName);
                    const newPitch = new Pitch({pitch: newPC.pc, add: newPC.add, duration: this.duration, key: this.key, scaleName: this.scaleName, parsedScale: parsedScale});
                    return newPitch as unknown as Node;
                })});
                return chord.evaluate();
            });
            return allTransforms;
        } else return this;
    }

    tetraTonnetz(transformationInput: string, tonnetz: TonnetzSpaces = [3,4,5], transformFunc: Function = seventhsTransform): Chord|Chord[] {
        const notes = this.notes();
        if(notes.length === 4) {
            const splittedTransforms = transformationInput.split(" ");
            const allTransforms = splittedTransforms.map((transformation) => {
                const transformedChord = (transformFunc(notes as Tetrachord, transformation, tonnetz) as Tetrachord)?.sort((a,b) => a-b);
                if(!transformedChord) return this;
                const parsedScale = this.pitches[0].parsedScale!;
                const chord = new Chord({pitches: transformedChord.map((pc) => {
                    const newPC = midiToPitchClass(pc, this.key, this.scaleName);
                    const newPitch = new Pitch({pitch: newPC.pc, add: newPC.add, duration: this.duration, key: this.key, scaleName: this.scaleName, parsedScale: parsedScale});
                    return newPitch as unknown as Node;
                })});
                return chord.evaluate();
            });
            return allTransforms;
        } else return this;
    }

}

export class Roman extends Chord {
    roman!: string;
    romanNumeral!: number;
    octave?: number;
    chordOctave?: number;
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate(options: ChangingOptions = {}): Roman {
        const dup = deepClone(this);
        if(options.scale && typeof options.scale === "string") {
            dup.scaleName = options.scale;
        }
        dup.romanNumeral = parseRoman(dup.roman);
        const key = dup.key || options.key || 60;

        const scale = dup.scaleName || "MAJOR";
        const parsedScale = safeScale(scale) as number[];

        let octave = (dup.chordOctave || 0) + (options.octave || 0);

        if(dup.chordName) {
            const chord = namedChordFromDegree(dup.romanNumeral, dup.chordName, key, scale, octave);
            const pitchObj = chord.map((note) => {
                return midiToPitchClass(note,key,scale);
            });
            dup.pitches = pitchObj.map((pc) => {
                const pitchOct = octave+pc.octave;
                return new Pitch({pitch: pc.pc, octave: pitchOct, key: key, parsedScale: parsedScale, add: pc.add, duration: this.duration}).evaluate(options);
            });
        } else {
            const scaleNotes: number[] = getScaleNotes(scale, 0, 7);
            const chrom_pcs: number[] = getChordFromScale(dup.romanNumeral, 0, scale);
            const pcs: number[] = chrom_pcs.map((note) => {
                return scaleNotes.indexOf(note);
            });
            dup.pitches = pcs.map((pc) => {
                return new Pitch({pitch: pc, octave: octave, key: key, parsedScale: parsedScale, duration: this.duration}).evaluate(options);
            });
        }
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
        if(!this.duration) this.duration = (options.duration || options.duration === 0) ? options.duration : DEFAULT_DURATION;
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
        this.pitch = this.evaluateValue();
        const pitch = new Pitch(this as object).evaluate(options);
        pitch.type = "Pitch";
        pitch.text = pitch.pitch.toString();
        return pitch;
    }
    evaluateValue(): number {
        return Math.floor(this.random() * (this.max - this.min + 1)) + this.min;
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
    evaluate(options: ChangingOptions = {}): (Pitch|Chord)[] {
        return this.items.map((item: Base) => { return item.evaluate(options); }).flat(Infinity) as unknown as (Pitch|Chord)[];
    }
}

export class Arpeggio extends List {
    chord!: Chord;
    indexes!: List|number[];
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate(options: ChangingOptions = {}): (Pitch|Chord)[] {
        
        const chord = this.chord.evaluate(options);
        const chordLength = chord.pitches.length;
        if(this.indexes instanceof List) {
            const pitchIndexes = this.indexes.evaluate(deepClone(options)).filter((item) => item !== undefined);
            return pitchIndexes.map((idx: Pitch|Chord) => {
                if(idx instanceof Chord) {
                    const dupChord = idx.clone() as Chord;
                    dupChord.pitches = dupChord.pitches.map((pc) => {
                        return chord.pitches[pc.pitch as number % chordLength];
                    });
                    return dupChord.evaluate(options);
                } else if (idx instanceof Pitch){
                    const origPitch = chord.pitches[idx.pitch as number % chordLength];
                    const dupPitch = idx.clone() as Pitch;
                    dupPitch.pitch = origPitch.pitch;
                    dupPitch.octave = (dupPitch.octave||0)+(origPitch.octave||0);
                    dupPitch.add = (dupPitch.add||0)+(origPitch.add||0);
                    dupPitch.key = origPitch.key;
                    dupPitch.scaleName = origPitch.scaleName;
                    dupPitch.parsedScale = origPitch.parsedScale;
                    
                    return dupPitch.evaluate(options);
                }
                return idx;
            })
        } else if(Array.isArray(this.indexes)) {
            const pitches = this.indexes.map(i => {
                if(Array.isArray(i)) {
                    const chordPitches = i.map((index) => {
                        return chord.pitches[index % chordLength];
                    }) as unknown as Node[];
                    return new Chord({pitches: chordPitches, duration: chord.duration}).evaluate(options);
                } else {
                    const pitch = chord.pitches[i % chordLength];
                    return pitch.evaluate(options);
                }
            }) as unknown as (Pitch|Chord)[];
            return pitches;
        } else {
            return [];
        }
    }
}

export class Subdivision extends Base {
    duration!: number;
    items!: (Pitch|Chord|Rest|Subdivision)[];
    evaluated!: (Pitch|Chord|Rest|Subdivision)[];
    constructor(data: Partial<Node>) {
        super(data);
        Object.assign(this, data);
    }
    evaluate(options: ChangingOptions = {}): Subdivision {
        options.subdivisions = true;
        //const dup = deepClone(this);
        this.duration = options.duration || DEFAULT_DURATION;
        this.evaluated = this.items.map((item: Base) => { return item.evaluate(options); }).filter((v) => v).flat(Infinity) as unknown as Pitch[];
        return this;
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
        const left = this.left.evaluate(options).flat(Infinity);
        const right = this.right.evaluate(options).flat(Infinity);
        // Parse operator from string to javascript operator
        const operator = OPERATORS[this.operation];
        // Create pairs of elements
        const pairs: [Pitch, Pitch][] = right.flatMap((r) => {
            return left.map((l) => {
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
        this.items = this.items.filter((item) => item !== undefined);
        this.index = 0;
    }
    nextItem(options: ChangingOptions = {}): Base | Base[] | undefined {
        let value = this.items[this.index%this.items.length] as Base|Base[]|undefined;
        while(value instanceof Cycle) {
            value = value.nextItem(options);
        }
        this.index = this.index+1;
        if(value instanceof Base) {
            const test = value.evaluate(options) as Event;
            return test;
        }
        return value; 
    }
    evaluate(options: ChangingOptions = {}): Base | Base[] | undefined {
        const value = this.nextItem(options);
        return value;
    }
    evaluateValue(options: ChangingOptions = {}): any {
        const next = this.nextItem(options);
        if(next instanceof Base) {
            return next.evaluateValue();
        } else {
            return next;
        }
    }

}
