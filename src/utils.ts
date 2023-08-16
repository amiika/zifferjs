export function seededRandom(seed: string = ''): () => number {
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

export function deepClone<T, U = T extends Array<infer V> ? V : never>(source: T ): T {
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

export function choose<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
