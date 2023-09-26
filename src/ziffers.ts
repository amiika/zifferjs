import { parse as parseZiffers } from './parser/ziffersParser.ts';
import { parse as parseScala } from './parser/scalaParser.ts';
import { DEFAULT_OPTIONS, isScale, getScale } from './defaults.ts';
import { voiceLead } from './scale.ts';
import { Base, Pitch, Chord, Roman, Rest, Event, SoundEvent, Options, NodeOptions, GlobalOptions, globalOptionKeys, ChangingOptions, Subdivision } from './types.ts';
import { deepClone, seededRandom } from './utils.ts';

type ZEvent = Pitch|Chord|Roman|Rest|SoundEvent;

export class Ziffers {
    input: string;
    values: Base[];
    evaluated: ZEvent[];
    options: Options;
    counter: number = 0;
    redo: number;
    index: number = -1;
    globalOptions : GlobalOptions;
    duration: number;

    constructor(input: string, options: NodeOptions = {}, globalOptions: GlobalOptions = {}) {
        this.input = input;
        // Merge options with default options. TODO: Ignore some common options like degrees?
        options = {...DEFAULT_OPTIONS, ...options};
        this.globalOptions = globalOptions;
        // Parse scala format if scale is not a scale name
        if(options.scale) {
            if(typeof options.scale === 'string') {
                 if(!isScale(options.scale)) {
                    options.scale = parseScala(options.scale) as number[];
                } else {
                    options.scaleName = options.scale;
                    options.scale = getScale(options.scale) as number[];
                }
            }
            options.parsedScale = options.scale as number[];
            delete options.scale;
        }

        if(options.redo !== undefined) {
            this.redo = options.redo;
        } else {
            this.redo = 1;
        }

        if(options && options.seed) {
            options.randomSeed = options.seed;
            options.seededRandom = seededRandom(options.seed);
        }

        // Check if globalOpions is empty
        if(Object.keys(globalOptions).length === 0) {
            this.globalOptions = getGlobalOption(options);
        }

        this.options = {nodeOptions: options};

        try {
            this.values = parseZiffers(input, this.options);
            this.evaluated = this.evaluate(this.values);
            this.applyTransformations();
            this.duration = this.totalDuration();
        } catch (ex: any) {
            console.log(ex);
            // Handle parsing error
            // [...]
            this.values = [];
            this.evaluated = [];
            this.duration = 0;
        }
    }

    pitches(): (number|undefined|number[])[] {
        return this.evaluated.map((item: ZEvent) => {
            return item.collect("pitch");
        })
    }

    notes(): (number|undefined|number[])[] {
        return this.evaluated.map((item: ZEvent) => {
            return item.collect("note");
        });  
    }

    sounds(): string[] {
        return this.evaluated.map((item: ZEvent) => {
            return item.collect("sound");
        });  
    }

    indices(): number[] {
        return this.evaluated.map((item: ZEvent) => {
            return item.collect("soundIndex");
        });
    }

    freqs(): (number|undefined|number[])[] {
        return this.evaluated.map((item: ZEvent) => {
            return item.collect("freq");
        });
    }

    durations(): (number|undefined|number[])[] {
        return this.evaluated.map((item: ZEvent) => {
            return item.collect("duration");
        });
    }

    octaves(): (undefined|number|number[])[] {
        return this.evaluated.map((item: ZEvent) => {
            return item.collect("octave");
        });
    }

    retrograde(): Ziffers {
        this.evaluated = this.evaluated.reverse();
        return this;
    }

    scale(scale: string) {
        this.applyOptions({scale: scale});
        return this;
    }

    key(key: string) {
        this.applyOptions({key: key});
        return this;
    }

    octave(octave: number) {
        this.applyOptions({octave: octave});
        return this;
    }

    invert(invert: number) {
        this.applyOptions({inversion: invert});
        return this;
    }

    isInOptions(key: string, value: string|number) {
        return this.options.nodeOptions && this.options.nodeOptions[key as keyof NodeOptions] === value;
    }
            
    atLast(): boolean {
        return this.index+1 >= this.evaluated.length*this.redo;
    }

    clone(): Ziffers {
        return deepClone(this);
    }

    notStarted() {
        return this.index < 0
    }

    peek() {
        return this.evaluated[this.index-1 || 0];
    }

    hasStarted(): boolean {
        return this.index >= 0;
    }

    next(): Event {
        // Check for the first run
        if(this.index<0) this.index = 0;

        // Get next item
        const nextEvent = this.evaluated[this.index % this.evaluated.length];

        this.index++;
        this.counter++;

        // Check if next item is last
        if(this.redo > 0 && this.index >= this.evaluated.length * this.redo) {
            this.index = 0; 
            this.evaluated = this.evaluate(this.values);
        }

        return nextEvent;
    }

    applyOptions(options: ChangingOptions = {}) {
        this.evaluated = this.evaluate(this.evaluated, options);
        this.applyTransformations();
    }

    applyTransformations() {
        // TODO: Make more generic
        if(this.globalOptions?.retrograde) {
            this.evaluated = this.evaluated.reverse();
        }
    }

    update() {
        this.evaluated = this.evaluate(this.values);
        this.applyTransformations();
        return this;
    }

    evaluate(values: Base[], options: ChangingOptions = {}): ZEvent[] {
        let items = values.map((node: Base) => {
            return node.evaluate(options);
        }).flat(Infinity).filter((node) => node !== undefined) as (ZEvent|Subdivision)[];
        if(options.subdivisions) {
            items = resolveSubdivisions(items);
         }
        return items as ZEvent[];
    }

    totalDuration(): number {
        const length = this.evaluated.reduce((acc: number, item: ZEvent) => {
            return acc + item.collect("duration");
        }, 0);
        return length;
    }

    lead(): Ziffers {
        // Get first chord from evaluated events
        let lastChordIndex = this.evaluated.findIndex((o)=>{return o instanceof Chord});
        if(lastChordIndex>=0) {
            for(let i = lastChordIndex+1; i<=this.evaluated.length; i++) {
                if(this.evaluated[i] instanceof Chord) {
                    const aChord = (this.evaluated[lastChordIndex] as Chord);
                    const bChord = (this.evaluated[i] as Chord);
                    const leadedChord = voiceLead(aChord.notes(),bChord.notes());
                    const newChord = deepClone(bChord);
                    newChord.voiceLeadFromNotes(leadedChord, this.options.nodeOptions!);
                    this.evaluated[i] = newChord;
                    lastChordIndex = i;
                }
            }
        }
        return this;
    }
}

const resolveSubdivisions = (values: (Chord|Rest|Pitch|SoundEvent|Subdivision)[], duration: number|undefined = undefined): ZEvent[] => {
    const sub = values.map((item: Chord|Rest|Pitch|SoundEvent|Subdivision) => {
        if(item instanceof Subdivision) {
            const length = item.items.length
            const newDuration = (duration || item.duration) / length;
            return resolveSubdivisions(item.items, newDuration);
        } else {
            item.duration = duration || item.duration;
            return item;
        }
    });
    return sub.flat(Infinity) as ZEvent[];
}

const getGlobalOption = (options: NodeOptions): GlobalOptions => {
    let globalOptions: GlobalOptions = {};
    globalOptionKeys.forEach((key: string) => {
        if(options[key as keyof GlobalOptions] !== undefined) {
            const val = options[key as keyof GlobalOptions];
            globalOptions[key as keyof GlobalOptions] = val;
            delete options[key as keyof GlobalOptions];
        }
    });
    return globalOptions;
}

export const pattern = (input: string, options: object = {}): Ziffers => {
    return new Ziffers(input, options);
}
