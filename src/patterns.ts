export const pAdicValuation = (baseTenNumber: number, baseNumber: number): number => {
    let index = 0;
    if (baseTenNumber < 1) return index;
    while (baseTenNumber % (baseNumber ** index) === 0) index++;
    return index - 1;
}

export const pAdicNorm = (baseTenNumber: number, baseNumber: number): number => {
    if (baseTenNumber === 0) return 0;
    const power = pAdicValuation(baseTenNumber, baseNumber);
    const absoluteValue = 1 / (baseNumber ** power);
    return absoluteValue;
}

export const pAdicExpansion = (baseTenNumber: number, baseNumber: number, precision: number = 11): number[] => {
    const inverseLimitArr: number[] = [];
    for (let index = 1; index < precision; index++) {
        const power = baseNumber ** index;
        const inverseLimits: number = (((baseTenNumber % (power))) + (power)) % (power)
        inverseLimitArr.push(inverseLimits);
    }

    const pAdicExpansionArray = [inverseLimitArr[0]];
    for (let index = 0; index < precision - 2; index++) {
        const a1 = inverseLimitArr[index + 1];
        const a0 = inverseLimitArr[index];
        const power = (baseNumber ** (index + 1));
        const DIGITS = ((a1 - a0) / power);
        pAdicExpansionArray.push(DIGITS);
    }
    return pAdicExpansionArray;
}

export const pAdicExpansionArithmetic = (baseTenNumber: number, baseNumber: number, precision: number = 11): number[] => {
    const inverseLimitArr: number[] = [];
    for (let index = 1; index < precision; index++) {
        const power = baseNumber ** index;
        const inverseLimits: number = (((baseTenNumber % (power))) + (power)) % (power)
        inverseLimitArr.push(inverseLimits);
    }

    const pAdicExpansionArray = [inverseLimitArr[0]];
    for (let index = 0; index < precision - 2; index++) {
        const a1 = inverseLimitArr[index + 1];
        const a0 = inverseLimitArr[index];
        const power = (baseNumber ** (index + 1));
        const DIGITS = ((a1 - a0) / power);
        pAdicExpansionArray.push(DIGITS);
    }
    const reversepAdicExpansionArray = pAdicExpansionArray.reverse();
    return reversepAdicExpansionArray
        .slice(reversepAdicExpansionArray.findIndex(digit => digit !== 0));
}

export function* fibonacci(): Generator<number> {
    let [a, b] = [0, 1];
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

export function* tribonacci(): Generator<number> {
    let [a, b, c] = [0, 0, 1];
    while (true) {
        yield b;
        [a, b, c] = [c, a, a + b + c];
    }
}

export function* tetranacci(): Generator<number> {
    let [a, b, c, d] = [0, 0, 0, 1];
    while (true) {
        yield c;
        [a, b, c, d] = [d, a, b, a + b + c + d];
    }
}

export function* pentanacci(): Generator<number> {
    let [a, b, c, d, e] = [0, 0, 0, 0, 1];
    while (true) {
        yield d;
        [a, b, c, d, e] = [e, a, b, c, a + b + c + d + e];
    }
}

export function* hexanacci(): Generator<number> {
    let [a, b, c, d, e, f] = [0, 0, 0, 0, 0, 1];
    while (true) {
        yield e;
        [a, b, c, d, e, f] = [f, a, b, c, d, a + b + c + d + e + f];
    }
}

export function* heptanacci(): Generator<number> {
    let [a, b, c, d, e, f, g] = [0, 0, 0, 0, 0, 0, 1];
    while (true) {
        yield f;
        [a, b, c, d, e, f, g] = [g, a, b, c, d, e, a + b + c + d + e + f + g];
    }
}

export function* octanacci(): Generator<number> {
    let [a, b, c, d, e, f, g, h] = [0, 0, 0, 0, 0, 0, 0, 1];
    while (true) {
        yield g;
        [a, b, c, d, e, f, g, h] = [h, a, b, c, d, e, f, a + b + c + d + e + f + g + h];
    }
}

export function* enneanacci(): Generator<number> {
    let [a, b, c, d, e, f, g, h, i] = [0, 0, 0, 0, 0, 0, 0, 0, 1];
    while (true) {
        yield h;
        [a, b, c, d, e, f, g, h, i] = [i, a, b, c, d, e, f, g, a + b + c + d + e + f + g + h + i];
    }
}

export function* modularFibonacci(modulo: number): Generator<number> {
    let [a, b] = [0, 1];
    while (true) {
        yield a;
        [a, b] = [b, (a + b) % modulo];
    }
}

export function* modularTribonacci(modulo: number): Generator<number> {
    let [a, b, c] = [0, 0, 1];
    while (true) {
        yield b;
        [a, b, c] = [c, a, (a + b + c) % modulo];
    }
}

export function* modularTetranacci(modulo: number): Generator<number> {
    let [a, b, c, d] = [0, 0, 0, 1];
    while (true) {
        yield c;
        [a, b, c, d] = [d, a, b, (a + b + c + d) % modulo];
    }
}

export function* modularPentanacci(modulo: number): Generator<number> {
    let [a, b, c, d, e] = [0, 0, 0, 0, 1];
    while (true) {
        yield d;
        [a, b, c, d, e] = [e, a, b, c, (a + b + c + d + e) % modulo];
    }
}

export function* modularHexanacci(modulo: number): Generator<number> {
    let [a, b, c, d, e, f] = [0, 0, 0, 0, 0, 1];
    while (true) {
        yield e;
        [a, b, c, d, e, f] = [f, a, b, c, d, (a + b + c + d + e + f) % modulo];
    }
}

export function* modularHeptanacci(modulo: number): Generator<number> {
    let [a, b, c, d, e, f, g] = [0, 0, 0, 0, 0, 0, 1];
    while (true) {
        yield f;
        [a, b, c, d, e, f, g] = [g, a, b, c, d, e, (a + b + c + d + e + f + g) % modulo];
    }
}

export function* modularOctanacci(modulo: number): Generator<number> {
    let [a, b, c, d, e, f, g, h] = [0, 0, 0, 0, 0, 0, 0, 1];
    while (true) {
        yield g;
        [a, b, c, d, e, f, g, h] = [h, a, b, c, d, e, f, (a + b + c + d + e + f + g + h) % modulo];
    }
}

export function* modularEnneanacci(modulo: number): Generator<number> {
    let [a, b, c, d, e, f, g, h, i] = [0, 0, 0, 0, 0, 0, 0, 0, 1];
    while (true) {
        yield h;
        [a, b, c, d, e, f, g, h, i] = [i, a, b, c, d, e, f, g, (a + b + c + d + e + f + g + h + i) % modulo];
    }
}

export function* padicFibonacci(baseNumber: number): Generator<number> {
    let [a, b] = [0, 1];
    while (true) {
        yield pAdicValuation(a, baseNumber);
        [a, b] = [b, a + b];
    }
}

export function* padicTribonacci(baseNumber: number): Generator<number> {
    let [a, b, c] = [0, 0, 1];
    while (true) {
        yield pAdicValuation(b, baseNumber);
        [a, b, c] = [c, a, a + b + c];
    }
}

export function* padicTetranacci(baseNumber: number): Generator<number> {
    let [a, b, c, d] = [0, 0, 0, 1];
    while (true) {
        yield pAdicValuation(c, baseNumber);
        [a, b, c, d] = [d, a, b, a + b + c + d];
    }
}

export function* padicPentanacci(baseNumber: number): Generator<number> {
    let [a, b, c, d, e] = [0, 0, 0, 0, 1];
    while (true) {
        yield pAdicValuation(d, baseNumber);
        [a, b, c, d, e] = [e, a, b, c, a + b + c + d + e];
    }
}

export function* padicHexanacci(baseNumber: number): Generator<number> {
    let [a, b, c, d, e, f] = [0, 0, 0, 0, 0, 1];
    while (true) {
        yield pAdicValuation(e, baseNumber);
        [a, b, c, d, e, f] = [f, a, b, c, d, a + b + c + d + e + f];
    }
}

export function* padicHeptanacci(baseNumber: number): Generator<number> {
    let [a, b, c, d, e, f, g] = [0, 0, 0, 0, 0, 0, 1];
    while (true) {
        yield pAdicValuation(f, baseNumber);
        [a, b, c, d, e, f, g] = [g, a, b, c, d, e, a + b + c + d + e + f + g];
    }
}

export function* padicOctanacci(baseNumber: number): Generator<number> {
    let [a, b, c, d, e, f, g, h] = [0, 0, 0, 0, 0, 0, 0, 1];
    while (true) {
        yield pAdicValuation(g, baseNumber);
        [a, b, c, d, e, f, g, h] = [h, a, b, c, d, e, f, a + b + c + d + e + f + g + h];
    }
}

export function* padicEnneanacci(baseNumber: number): Generator<number> {
    const initial: number[] = Array(9).fill(0);
    initial[9 - 1] = 1;
    let [a, b, c, d, e, f, g, h, i] = initial;
    while (true) {
        yield pAdicValuation(h, baseNumber);
        [a, b, c, d, e, f, g, h, i] = [i, a, b, c, d, e, f, g, a + b + c + d + e + f + g + h + i];
    }
}

export function* normPadicFibonacci(baseNumber: number): Generator<number> {
    let [a, b] = [0, 1];
    while (true) {
        yield pAdicNorm(a, baseNumber);
        [a, b] = [b, a + b];
    }
}

export function* normPadicTribonacci(baseNumber: number): Generator<number> {
    let [a, b, c] = [0, 0, 1];
    while (true) {
        yield pAdicNorm(b, baseNumber);
        [a, b, c] = [c, a, a + b + c];
    }
}

export function* normPadicTetranacci(baseNumber: number): Generator<number> {
    let [a, b, c, d] = [0, 0, 0, 1];
    while (true) {
        yield pAdicNorm(c, baseNumber);
        [a, b, c, d] = [d, a, b, a + b + c + d];
    }
}

export function* normPadicPentanacci(baseNumber: number): Generator<number> {
    let [a, b, c, d, e] = [0, 0, 0, 0, 1];
    while (true) {
        yield pAdicNorm(d, baseNumber);
        [a, b, c, d, e] = [e, a, b, c, a + b + c + d + e];
    }
}

export function* normPadicHexanacci(baseNumber: number): Generator<number> {
    let [a, b, c, d, e, f] = [0, 0, 0, 0, 0, 1];
    while (true) {
        yield pAdicNorm(e, baseNumber);
        [a, b, c, d, e, f] = [f, a, b, c, d, a + b + c + d + e + f];
    }
}

export function* normPadicHeptanacci(baseNumber: number): Generator<number> {
    let [a, b, c, d, e, f, g] = [0, 0, 0, 0, 0, 0, 1];
    while (true) {
        yield pAdicNorm(f, baseNumber);
        [a, b, c, d, e, f, g] = [g, a, b, c, d, e, a + b + c + d + e + f + g];
    }
}

export function* normPadicOctanacci(baseNumber: number): Generator<number> {
    let [a, b, c, d, e, f, g, h] = [0, 0, 0, 0, 0, 0, 0, 1];
    while (true) {
        yield pAdicNorm(g, baseNumber);
        [a, b, c, d, e, f, g, h] = [h, a, b, c, d, e, f, a + b + c + d + e + f + g + h];
    }
}

export function* normPadicEnneanacci(baseNumber: number): Generator<number> {
    const initial: number[] = Array(9).fill(0);
    initial[9 - 1] = 1;
    let [a, b, c, d, e, f, g, h, i] = initial;
    while (true) {
        yield pAdicNorm(h, baseNumber);
        [a, b, c, d, e, f, g, h, i] = [i, a, b, c, d, e, f, g, a + b + c + d + e + f + g + h + i];
    }
}

export function* pAdicExpansionFibonacci(baseNumber: number, precision: number = 11): Generator<number[]> {
    let [a, b] = [0, 1];
    while (true) {
        yield pAdicExpansionArithmetic(a, baseNumber, precision);
        [a, b] = [b, a + b];
    }
}

export function* pAdicExpansionTribonacci(baseNumber: number, precision: number = 11): Generator<number[]> {
    let [a, b, c] = [0, 0, 1];
    while (true) {
        yield pAdicExpansionArithmetic(b, baseNumber, precision);
        [a, b, c] = [c, a, a + b + c];
    }
}

export function* pAdicExpansionTetranacci(baseNumber: number, precision: number = 11): Generator<number[]> {
    let [a, b, c, d] = [0, 0, 0, 1];
    while (true) {
        yield pAdicExpansionArithmetic(c, baseNumber, precision);
        [a, b, c, d] = [d, a, b, a + b + c + d];
    }
}

export function* pAdicExpansionPentanacci(baseNumber: number, precision: number = 11): Generator<number[]> {
    let [a, b, c, d, e] = [0, 0, 0, 0, 1];
    while (true) {
        yield pAdicExpansionArithmetic(d, baseNumber, precision);
        [a, b, c, d, e] = [e, a, b, c, a + b + c + d + e];
    }
}

export function* pAdicExpansionHexanacci(baseNumber: number, precision: number = 11): Generator<number[]> {
    let [a, b, c, d, e, f] = [0, 0, 0, 0, 0, 1];
    while (true) {
        yield pAdicExpansionArithmetic(e, baseNumber, precision);
        [a, b, c, d, e, f] = [f, a, b, c, d, a + b + c + d + e + f];
    }
}

export function* pAdicExpansionHeptanacci(baseNumber: number, precision: number = 11): Generator<number[]> {
    let [a, b, c, d, e, f, g] = [0, 0, 0, 0, 0, 0, 1];
    while (true) {
        yield pAdicExpansionArithmetic(f, baseNumber, precision);
        [a, b, c, d, e, f, g] = [g, a, b, c, d, e, a + b + c + d + e + f + g];
    }
}

export function* pAdicExpansionOctanacci(baseNumber: number, precision: number = 11): Generator<number[]> {
    let [a, b, c, d, e, f, g, h] = [0, 0, 0, 0, 0, 0, 0, 1];
    while (true) {
        yield pAdicExpansionArithmetic(g, baseNumber, precision);
        [a, b, c, d, e, f, g, h] = [h, a, b, c, d, e, f, a + b + c + d + e + f + g + h];
    }
}

export function* pAdicExpansionEnneanacci(baseNumber: number, precision: number = 11): Generator<number[]> {
    const initial: number[] = Array(9).fill(0);
    initial[9 - 1] = 1;
    let [a, b, c, d, e, f, g, h, i] = initial;
    while (true) {
        yield pAdicExpansionArithmetic(h, baseNumber, precision);
        [a, b, c, d, e, f, g, h, i] = [i, a, b, c, d, e, f, g, a + b + c + d + e + f + g + h + i];
    }
}
