import { parse as parseZiffers } from './parser/ziffersParser.ts';
import { parse as parseScala } from './parser/scalaParser.ts';
import { DEFAULT_OPTIONS, isScale, getScale } from './defaults.ts';
import { Base, Pitch, Chord, Rest, Event, Options, NodeOptions, GlobalOptions, globalOptionKeys, ChangingOptions } from './types.ts';
import { deepClone, seededRandom } from './utils.ts';

export class Ziffers {
    input: string;
    values: Base[];
    evaluated: (Pitch|Chord|Rest)[];
    options: Options;
    counter: number = 0;
    redo: number;
    index: number = -1;
    globalOptions : GlobalOptions;

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
           this.evaluated = this.evaluate();
           this.applyTransformations();
        } catch (ex: any) {
            console.log(ex);
            // Handle parsing error
            // [...]
            this.values = [];
            this.evaluated = [];
        }
    }

    update(options: ChangingOptions = {}) {
        this.evaluated = this.evaluate(options);
        this.applyTransformations();
    }

    pitches(): (number|undefined|number[])[] {
        return this.evaluated.map((item: Pitch|Chord|Rest) => {
            return item.collect("pitch");
        })
    }

    notes(): (number|undefined|number[])[] {
        return this.evaluated.map((item: Pitch|Chord|Rest) => {
            return item.collect("note");
        });  
    }

    freqs(): (number|undefined|number[])[] {
        return this.evaluated.map((item: Pitch|Chord|Rest) => {
            return item.collect("freq");
        });
    }

    durations(): (number|undefined|number[])[] {
        return this.evaluated.map((item: Pitch|Chord|Rest) => {
            return item.collect("duration");
        });
    }

    retrograde(): Ziffers {
        this.evaluated = this.evaluated.reverse();
        return this;
    }

    scale(scale: string) {
        if(this.isInOptions('scaleName', scale)) return this;
        this.update({scale: scale});
        return this;
    }

    key(key: string) {
        if(this.isInOptions('key', key)) return this;
        this.update({key: key});
        return this;
    }

    octave(octave: number) {
        // TODO: Check if this has side effects?
        if(this.isInOptions('octave', octave)) return this;
        this.update({octave: octave});
        return this;
    }

    isInOptions(key: string, value: string|number) {
        return this.options.nodeOptions && this.options.nodeOptions[key as keyof NodeOptions] === value;
    }
            
    next(): Event {
        this.index++;
        this.counter++;

        if(this.redo > 0 && this.index >= this.evaluated.length*this.redo) {
            this.update();
            this.index = 0;
        }

        const nextEvent = this.evaluated[this.index % this.evaluated.length];
        
        return nextEvent;
    }

    applyTransformations() {
        // TODO: Make more generic
        if(this.globalOptions?.retrograde) {
            this.evaluated = this.evaluated.reverse();
        }
    }

    clone(): Ziffers {
        return deepClone(this);
    }

    notStarted() {
        return this.index < 0;
    }

    peek() {
        return this.evaluated[this.index-1 || 0];
    }

    hasStarted(): boolean {
        return this.index >= 0;
    }

    

    evaluate(options: ChangingOptions = {}): (Pitch|Chord|Rest)[] {

        const items = this.values.map((node: Base) => {
            return node.evaluate(options);
        }).flat(Infinity).filter((node) => node !== undefined) as (Pitch|Chord|Rest)[];
        
        items.forEach((item: Event, index) => {
            item._next = index < items.length-1 ? index+1 : 0;
            item._prev = index > 0 ? index-1 : items.length-1;
        });

        return items;
    }

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
