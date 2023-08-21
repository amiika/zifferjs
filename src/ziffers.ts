import { parse as parseZiffers } from './parser/ziffersParser.ts';
import { parse as parseScala } from './parser/scalaParser.ts';
import { DEFAULT_OPTIONS, isScale, getScale } from './defaults.ts';
import { Base, Pitch, Chord, Rest, Event, Options, NodeOptions, GlobalOptions, globalOptionKeys } from './types.ts';
import { LRUCache} from 'lru-cache';
import { deepClone, seededRandom } from './utils.ts';

const zcache = new LRUCache({max: 1000, ttl: 1000 * 60 * 5});

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

    update() {
        this.evaluated = this.evaluate();
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
        this.evaluated.reverse();
        return this;
    }
            
    next(): Event {
        if(this.redo > 0 && this.index >= this.evaluated.length*this.redo) {
            this.update();
            this.index = 0;
        }
        
        if(this.index < 0) {
            // Starting first time
            this.index = 0;
        }

        const nextEvent = this.evaluated[this.index % this.evaluated.length];
 
        this.index++;
        this.counter++;

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

    evaluate(): (Pitch|Chord|Rest)[] {

        const items = this.values.map((node: Base) => {
            return node.evaluate();
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

export const pattern = (input: string, options: object = {}): Ziffers => {
    return new Ziffers(input, options);
}

export const cachedPattern = (input: string, options: NodeOptions = {}): Ziffers => {
    return cachedCall(input, options);
}

export const cachedEvent = (input: string, options: NodeOptions = {}): Event => {
    const fromCache = cachedCall(input, options);
    let next = fromCache.next();
    return next;
}

export const cachedEventTest = (input: string, options: NodeOptions = {}): Event => {
    const next = cachedEvent(input, options); 
    if(next.type === "Start") return cachedEvent(input, options);
    return next;
}

export const get = (input: string, options: NodeOptions = {}): Event => {
    if(options.index) {
        let index = options.index;
        delete options.index;
        let fromCache = cachedCall(input, options);
        if(fromCache.notStarted()) fromCache.next();
        index = index%fromCache.evaluated.length;
        return fromCache.evaluated[index];
    }
    const fromCache = cachedCall(input, options);
    if(fromCache.notStarted()) fromCache.next();
    return fromCache.peek()!;
}

export const note = (input: string, options: NodeOptions = {}): number|undefined => {
    return cachedEventTest(input, options).collect("note");
}

export const pitch = (input: string, options: NodeOptions = {}): number|undefined => {
    return cachedEventTest(input, options).collect("pitch");
}

export const freq = (input: string, options: NodeOptions = {}): number|undefined => {
    return cachedEventTest(input, options).collect("freq");
}

export const clear = (input: string, options: NodeOptions = {}): void => {
    const cacheKey = generateCacheKey(input, options);
    zcache.delete(cacheKey);
}
