export const seededRandom = (seed: string = ''): (() => number) => {
  let x: number = 0;
  let y: number = 0;
  let z: number = 0;
  let w: number = 0;

  function next(): number {
    const t: number = (x ^ (x << 11)) >>> 0;
    x = y;
    y = z;
    z = w;
    w ^= ((w >>> 19) ^ t ^ (t >>> 8)) >>> 0
    return (w >>> 0) / 0x100000000;
  }

  for (let k = 0; k < seed.length + 64; k++) {
    x ^= seed.charCodeAt(k) | 0;
    next();
  }

  return next;
}

export const deepClone = <T, U = T extends Array<infer V> ? V : never>(source: T ): T => {
    if (Array.isArray(source)) {
        return source.map(item => (deepClone(item))) as T & U[]
    }
    if (source && typeof source === 'object') {
        return (Object.getOwnPropertyNames(source) as (keyof T)[]).reduce<T>((o, prop) => {
        Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!)
        o[prop] = deepClone(source[prop])
        return o
        }, Object.create(Object.getPrototypeOf(source)))
    }
    return source
}

export const choose = <T>(arr: Array<T>): T => {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const safeEval = (expression: string): number => {
  try {
    return new Function(`"use strict";return (${expression})`)();
  } catch (error) {
    throw new Error(`Error in eval: ${error}`);
  }
}

export const safeMod = (value: number, n: number) => {
  if(value === 0 || n === 0) return 0;
  return ((value % n) + n) % n;
}

export function filterObject(
  obj: Record<string, any>|undefined,
  filter: string[],
  rename: Record<string, string> = {},
): Record<string, any> {
  /*
   * Filter certain keys from object
   *
   * @param {Record<string, any>} obj - Object to filter
   * @param {string[]} filter - Keys to filter
   * @returns {object} Filtered object
   *
   */
  if(obj === undefined) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => filter.includes(key)).map(([key, value]) => [rename[key] || key, value])
  );
}

export const repeat = (value: any, n: number): any[] => {
  return Array(n).fill(value).flat();
} 
