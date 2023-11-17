export type TonnetzSpaceConnected = [3, 4, 5] | [1, 1, 10] | [1, 2, 9] | [1, 3, 8] | [1, 4, 7] | [1, 5, 6] | [2, 3, 7] | [2, 5, 5]
export type TonnetzSpaceNonConnected = [2, 4, 6] | [2, 2, 8] | [3, 3, 6] | [4, 4, 4]

export type TonnetzSpaces = TonnetzSpaceConnected | TonnetzSpaceNonConnected

export type TriadChord = [number, number, number]
export type Tetrachord = [number, number, number, number]

export type TransformationFunctions = (triad: TriadChord, tonnetz: TonnetzSpaces) => TriadChord;

export type ObjectTransformations = {
    [key: string]: TransformationFunctions
}

export type TransformationFunctionsSeventhChords = (tetrachord: Tetrachord, tonnetz: TonnetzSpaces) => Tetrachord;

export type ObjectTransformationsSeventhChords = {
    [key: string]: TransformationFunctionsSeventhChords
}

export type ChordGenerationFunctions = (rootNote: number, tonnetz: TonnetzSpaces) => TriadChord | Tetrachord;

export type ChordGenerators = {
    [key: string]: ChordGenerationFunctions
}

export const majorChordFromTonnetz = (rootNote: number, tonnetz: TonnetzSpaces): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + b % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (a + b) % modulo) + modulo) % modulo;

    const majorTriad: TriadChord = [firstNote, secondNote, thirdNote];
    return majorTriad;
}

export const minorChordFromTonnetz = (rootNote: number, tonnetz: TonnetzSpaces): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + a % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (a + b) % modulo) + modulo) % modulo;

    const minorTriad: TriadChord = [firstNote, secondNote, thirdNote];
    return minorTriad;
}

export const dominantSeventhChord = (rootNote: number, tonnetz: TonnetzSpaces): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + b % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (a + b) % modulo) + modulo) % modulo;
    const fourthNote = ((rootNote + (2 * a + b) % modulo) + modulo) % modulo;

    const dominant7: Tetrachord = [firstNote, secondNote, thirdNote, fourthNote];
    return dominant7;
}

export const majorSeventhChord = (rootNote: number, tonnetz: TonnetzSpaces): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + b % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (a + b) % modulo) + modulo) % modulo;
    const fourthNote = ((rootNote + (2 * b + a) % modulo) + modulo) % modulo;

    const maj7: Tetrachord = [firstNote, secondNote, thirdNote, fourthNote];
    return maj7;
}

export const minorSeventhChord = (rootNote: number, tonnetz: TonnetzSpaces): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + a % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (a + b) % modulo) + modulo) % modulo;
    const fourthNote = ((rootNote + (2 * a + b) % modulo) + modulo) % modulo;

    const min7: Tetrachord = [firstNote, secondNote, thirdNote, fourthNote];
    return min7;
}

export const halfDiminishedChord = (rootNote: number, tonnetz: TonnetzSpaces): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + a % modulo) + modulo) % modulo;
    const thirdNote = (rootNote + ((a + b - (b - a)) % modulo) + modulo) % modulo;
    const fourthNote = ((rootNote + (2 * a + b) % modulo) + modulo) % modulo;

    const halfdim7: Tetrachord = [firstNote, secondNote, thirdNote, fourthNote];
    return halfdim7;
}

export const augmentedTriadChord = (rootNote: number, tonnetz: TonnetzSpaces): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + b % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (2 * b) % modulo) + modulo) % modulo;

    const augmentedTriad: TriadChord = [firstNote, secondNote, thirdNote];
    return augmentedTriad;
}

export const diminishedTriadChord = (rootNote: number, tonnetz: TonnetzSpaces): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + a % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (2 * a) % modulo) + modulo) % modulo;

    const diminishedTriadChord: TriadChord = [firstNote, secondNote, thirdNote];
    return diminishedTriadChord;
}

export const diminishedSeventhChord = (rootNote: number, tonnetz: TonnetzSpaces): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + a % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (2 * a) % modulo) + modulo) % modulo;
    const fourthNote = ((rootNote + (3 * a) % modulo) + modulo) % modulo;

    const dim7: Tetrachord = [firstNote, secondNote, thirdNote, fourthNote];
    return dim7;
}

export const minorMajorSeventhChord = (rootNote: number, tonnetz: TonnetzSpaces): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + a % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (a + b) % modulo) + modulo) % modulo;
    const fourthNote = ((rootNote + (2 * b + a) % modulo) + modulo) % modulo;

    const minMaj7: Tetrachord = [firstNote, secondNote, thirdNote, fourthNote];
    return minMaj7;
}

export const augmentedMajorSeventhChord = (rootNote: number, tonnetz: TonnetzSpaces): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + b % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (2 * b) % modulo) + modulo) % modulo;
    const fourthNote = ((rootNote + (2 * b + a) % modulo) + modulo) % modulo;

    const maj7aug5: Tetrachord = [firstNote, secondNote, thirdNote, fourthNote];
    return maj7aug5;
}

export const sharpFiveDominantSeventhChord = (rootNote: number, tonnetz: TonnetzSpaces): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + b % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (2 * b) % modulo) + modulo) % modulo;
    const fourthNote = ((rootNote + (2 * a + b) % modulo) + modulo) % modulo;

    const dom7aug5: Tetrachord = [firstNote, secondNote, thirdNote, fourthNote];
    return dom7aug5;
}

export const flatFiveDominantSeventhChord = (rootNote: number, tonnetz: TonnetzSpaces): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + b % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (2 * a) % modulo) + modulo) % modulo;
    const fourthNote = ((rootNote + (2 * a + b) % modulo) + modulo) % modulo;

    const Dom7b5: Tetrachord = [firstNote, secondNote, thirdNote, fourthNote];
    return Dom7b5;
}

export const chordNotesToModN = <T extends number[]> (chord: T, modulo: number = 12): T => {
    const notesModN: number[] = [];
    for (let i = 0; i < chord.length; i++) {
        const noteComponents = ((chord[i] % modulo) + modulo) % modulo;
        notesModN.push(noteComponents);
    }
    return notesModN as T;
}

export const sortingTriadChord = (disorderedTriad: TriadChord, tonnetz: TonnetzSpaces): TriadChord => {
    const [, , c] = tonnetz;
    disorderedTriad.sort((x, y) => x - y);
    const temp: TriadChord = [...disorderedTriad];

    if (Math.abs(disorderedTriad[1] - disorderedTriad[0]) === c) {
        disorderedTriad[0] = temp[1];
        disorderedTriad[1] = temp[2];
        disorderedTriad[2] = temp[0];
    }
    if (Math.abs(disorderedTriad[2] - disorderedTriad[1]) === c) {
        disorderedTriad[0] = temp[2];
        disorderedTriad[1] = temp[0];
        disorderedTriad[2] = temp[1];
    }
    return disorderedTriad;
}

export const firstChordComparison = (reduceModN: TriadChord | Tetrachord, compareOne: TriadChord | Tetrachord): boolean => {
    const firstChordCompare = reduceModN.map((item, index) => item === compareOne[index]);
    const equalFirstChord: boolean = firstChordCompare.every(item => item === true);
    return equalFirstChord;
}

export const secondChordComparison = (reduceModN: TriadChord | Tetrachord, compareTwo: TriadChord | Tetrachord): boolean => {
    const secondChordCompare = reduceModN.map((item, index) => item === compareTwo[index]);
    const equalSecondChord: boolean = secondChordCompare.every(item => item === true);
    return equalSecondChord;
}

export const parallelTransform: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const p: number = (a - b);

    const reduceModN = chordNotesToModN(chordFromTonnetz);
    const rootPositionTriad = sortingTriadChord(reduceModN, tonnetz);
    const transformedChord: TriadChord = [...rootPositionTriad];
    if (transformedChord[1] % modulo !== (transformedChord[0] + b) % modulo) {
        transformedChord[1] -= p;
    } else {
        transformedChord[1] += p;
    }
    const targetTriadChord = chordNotesToModN(transformedChord, modulo);
    return targetTriadChord;
}

export const leadingToneTransform: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const l: number = (b - c);

    const reduceModN = chordNotesToModN(chordFromTonnetz);
    const rootPositionTriad = sortingTriadChord(reduceModN, tonnetz);
    const transformedChord: TriadChord = [...rootPositionTriad];
    if (transformedChord[1] % modulo !== (transformedChord[0] + b) % modulo) {
        transformedChord[2] -= l;
    } else {
        transformedChord[0] += l;
    }
    const targetTriadChord = chordNotesToModN(transformedChord, modulo);
    return targetTriadChord;
}

export const relativeTransform: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const r: number = (a - c)

    const reduceModN = chordNotesToModN(chordFromTonnetz);
    const rootPositionTriad = sortingTriadChord(reduceModN, tonnetz);
    const transformedChord: TriadChord = [...rootPositionTriad];
    if (transformedChord[1] % modulo !== (transformedChord[0] + b) % modulo) {
        transformedChord[0] += r;
    } else {
        transformedChord[2] -= r;
    }
    const targetTriadChord = chordNotesToModN(transformedChord, modulo);
    return targetTriadChord;
}

export const f: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const f: number = (a + b)

    const reduceModN = chordNotesToModN(chordFromTonnetz);
    let rootPositionTriad: TriadChord = sortingTriadChord(reduceModN, tonnetz);
    if (rootPositionTriad[1] % modulo === (rootPositionTriad[0] + b) % modulo) {
        rootPositionTriad = minorChordFromTonnetz(rootPositionTriad[0] + f, tonnetz);
    } else {
        rootPositionTriad = majorChordFromTonnetz(rootPositionTriad[0] - f, tonnetz);
    }
    const targetTriadChord = chordNotesToModN(rootPositionTriad, modulo);
    return targetTriadChord;
}

export const n: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const n: number = c;

    const reduceModN = chordNotesToModN(chordFromTonnetz);
    let rootPositionTriad: TriadChord = sortingTriadChord(reduceModN, tonnetz);
    if (rootPositionTriad[1] % modulo === (rootPositionTriad[0] + b) % modulo) {
        rootPositionTriad = minorChordFromTonnetz(rootPositionTriad[0] + n, tonnetz);
    } else {
        rootPositionTriad = majorChordFromTonnetz(rootPositionTriad[0] - n, tonnetz);
    }
    const targetTriadChord = chordNotesToModN(rootPositionTriad, modulo);
    return targetTriadChord;
}

export const s: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const s: number = (b - a);

    const reduceModN = chordNotesToModN(chordFromTonnetz);
    let rootPositionTriad: TriadChord = sortingTriadChord(reduceModN, tonnetz);
    if (rootPositionTriad[1] % modulo === (rootPositionTriad[0] + b) % modulo) {
        rootPositionTriad = minorChordFromTonnetz(rootPositionTriad[0] + s, tonnetz);
    } else {
        rootPositionTriad = majorChordFromTonnetz(rootPositionTriad[0] - s, tonnetz);
    }
    const targetTriadChord = chordNotesToModN(rootPositionTriad, modulo);
    return targetTriadChord;
}

export const h: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const h: number = (2 * b);

    const reduceModN = chordNotesToModN(chordFromTonnetz);
    let rootPositionTriad: TriadChord = sortingTriadChord(reduceModN, tonnetz);
    if (rootPositionTriad[1] % modulo === (rootPositionTriad[0] + b) % modulo) {
        rootPositionTriad = minorChordFromTonnetz(rootPositionTriad[0] + h, tonnetz);
    } else {
        rootPositionTriad = majorChordFromTonnetz(rootPositionTriad[0] - h, tonnetz);
    }
    const targetTriadChord = chordNotesToModN(rootPositionTriad, modulo);
    return targetTriadChord;
}

export const t6: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const h: number = (2 * a);

    const reduceModN = chordNotesToModN(chordFromTonnetz);
    let rootPositionTriad: TriadChord = sortingTriadChord(reduceModN, tonnetz);
    if (rootPositionTriad[1] % modulo === (rootPositionTriad[0] + b) % modulo) {
        rootPositionTriad = majorChordFromTonnetz(rootPositionTriad[0] + h, tonnetz);
    } else {
        rootPositionTriad = minorChordFromTonnetz(rootPositionTriad[0] - h, tonnetz);
    }
    const targetTriadChord = chordNotesToModN(rootPositionTriad, modulo);
    return targetTriadChord;
}

export const q13: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, majorChordFromTonnetz(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, diminishedTriadChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: TriadChord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = diminishedTriadChord(transformedChord[0] + (b - a), tonnetz)
    } else {
        transformedChord = majorChordFromTonnetz(transformedChord[0] - (b - a), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const q42: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, augmentedTriadChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, minorChordFromTonnetz(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: TriadChord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = minorChordFromTonnetz(transformedChord[0] + (b - a), tonnetz)
    } else {
        transformedChord = augmentedTriadChord(transformedChord[0] - (b - a), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const l41: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, augmentedTriadChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, majorChordFromTonnetz(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: TriadChord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = majorChordFromTonnetz(transformedChord[0] + (b), tonnetz)
    } else {
        transformedChord = augmentedTriadChord(transformedChord[0] - (b), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const n42: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, augmentedTriadChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, minorChordFromTonnetz(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: TriadChord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = minorChordFromTonnetz(transformedChord[0] + (c), tonnetz)
    } else {
        transformedChord = augmentedTriadChord(transformedChord[0] - (c), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const l14: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, majorChordFromTonnetz(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, augmentedTriadChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: TriadChord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = augmentedTriadChord(transformedChord[0] + (b), tonnetz)
    } else {
        transformedChord = majorChordFromTonnetz(transformedChord[0] - (b), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const p32: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, diminishedTriadChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, minorChordFromTonnetz(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: TriadChord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = minorChordFromTonnetz(transformedChord[0], tonnetz)
    } else {
        transformedChord = diminishedTriadChord(transformedChord[0], tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const rt42: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, augmentedTriadChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, minorChordFromTonnetz(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: TriadChord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = minorChordFromTonnetz(transformedChord[0] - a, tonnetz)
    } else {
        transformedChord = augmentedTriadChord(transformedChord[0] + a, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const p41: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, augmentedTriadChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, majorChordFromTonnetz(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: TriadChord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = majorChordFromTonnetz(transformedChord[0], tonnetz)
    } else {
        transformedChord = augmentedTriadChord(transformedChord[0], tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const lt13: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, majorChordFromTonnetz(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, diminishedTriadChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: TriadChord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = diminishedTriadChord(transformedChord[0] + b, tonnetz)
    } else {
        transformedChord = majorChordFromTonnetz(transformedChord[0] - b, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const rt23: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, minorChordFromTonnetz(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, diminishedTriadChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: TriadChord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = diminishedTriadChord(transformedChord[0] - a, tonnetz)
    } else {
        transformedChord = minorChordFromTonnetz(transformedChord[0] + a, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const CHORD_TYPES: ChordGenerators = {
    "M": majorChordFromTonnetz,
    "maj": majorChordFromTonnetz,
    "m": minorChordFromTonnetz,
    "min": minorChordFromTonnetz,
    "7": dominantSeventhChord,
    "maj7": majorSeventhChord,
    "m7": minorSeventhChord,
    "hdim7": halfDiminishedChord,
    "aug": augmentedTriadChord,
    "augmented": augmentedTriadChord,
    "diminished": diminishedTriadChord,
    "dim7": diminishedSeventhChord,
    "minMaj7": minorMajorSeventhChord,
    "maj7aug5": augmentedMajorSeventhChord,
    "dom7aug5": sharpFiveDominantSeventhChord,
    "dom7b5": flatFiveDominantSeventhChord
};

export const chordFromTonnetz = (rootNote: number, chordType: string, tonnetz: TonnetzSpaces = [3, 4, 5]): TriadChord | Tetrachord => {
    return CHORD_TYPES[chordType](rootNote, tonnetz);
}

export const TRANSFORMATIONS: ObjectTransformations = {
    "p": parallelTransform,
    "l": leadingToneTransform,
    "r": relativeTransform,
    "f": f,
    "n": n,
    "s": s,
    "h": h,
    "t": t6,

    "p32": p32,
    "p41": p41,
    "lt13": lt13,
    "l41": l41,
    "l14": l14,
    "rt23": rt23,
    "rt42": rt42,
    "q13": q13,
    "q42": q42,
    "n42": n42,
};

export const transform = (chord: TriadChord, transformation: string, tonnetz: TonnetzSpaces = [3, 4, 5]): TriadChord | undefined => {
    const transformations = transformation.split("");
    if (transformations.length === 0) return undefined;
    let transformedChord: TriadChord = [...chord];
    for (let i = 0; i < transformations.length; i++) {
        const validTransformation = transformations[i];
        if (validTransformation) {
            const parsedTransform = TRANSFORMATIONS[validTransformation];
            if (parsedTransform) {
                transformedChord = parsedTransform(transformedChord, tonnetz);
            } else {
                return undefined;
            }
        }
    }
    return sortingTriadChord(transformedChord, tonnetz);
}

export const hexaCycles = (rootNote: number, tonnetz: TonnetzSpaces = [3, 4, 5], reps: number = 3): TriadChord[] => {
    const [, b,] = tonnetz;
    const arrayTargetSet: TriadChord[] = [];
    for (let index = 0; index < Math.abs(reps); index++) {
        const baseNote = rootNote + ((-b) * index);
        const majorTriad = chordNotesToModN(majorChordFromTonnetz(baseNote, tonnetz));
        const minorTriad = chordNotesToModN(minorChordFromTonnetz(baseNote, tonnetz));
        arrayTargetSet.push(majorTriad, minorTriad)
    }
    return arrayTargetSet;
}

export const octaCycles = (rootNote: number, tonnetz: TonnetzSpaces = [3, 4, 5], reps: number = 4): TriadChord[] => {
    const [a] = tonnetz;
    const arrayTargetSet: TriadChord[] = [];
    for (let index = 0; index < Math.abs(reps); index++) {
        const baseNote = rootNote + (a * index);
        const majorTriad = chordNotesToModN(majorChordFromTonnetz(baseNote, tonnetz));
        const minorTriad = chordNotesToModN(minorChordFromTonnetz(baseNote, tonnetz));
        arrayTargetSet.push(majorTriad, minorTriad)
    }
    return arrayTargetSet;
}

export const enneaCycles = (rootNote: number, tonnetz: TonnetzSpaces = [3, 4, 5], reps: number = 3): Tetrachord[] => {
    const [, b,] = tonnetz;
    const arrayTargetSet: Tetrachord[] = [];
    for (let index = 0; index < Math.abs(reps); index++) {
        const baseNote = rootNote + ((-b) * index);
        const dominant7 = chordNotesToModN(dominantSeventhChord(baseNote, tonnetz));
        const minor7 = chordNotesToModN(minorSeventhChord(baseNote, tonnetz));
        const halfdim7 = chordNotesToModN(halfDiminishedChord(baseNote, tonnetz));
        arrayTargetSet.push(dominant7, minor7, halfdim7);
    }
    return arrayTargetSet;
}

export const weitzmannRegions = (rootNote: number, tonnetz: TonnetzSpaces = [3, 4, 5]): TriadChord[] => {
    const [a, b, c] = tonnetz;
    const augmentedTriadRoot: TriadChord = augmentedTriadChord(rootNote, tonnetz);

    const arrayTargetSet: TriadChord[] = [];
    const childChord1 = chordNotesToModN(minorChordFromTonnetz(rootNote + (b - a), tonnetz));
    const childChord2 = chordNotesToModN(minorChordFromTonnetz(rootNote + c, tonnetz))
    const childChord3 = chordNotesToModN(minorChordFromTonnetz(rootNote + b + c, tonnetz))
    const childChord4 = chordNotesToModN(majorChordFromTonnetz(rootNote, tonnetz));
    const childChord5 = chordNotesToModN(majorChordFromTonnetz(rootNote + (-b), tonnetz));
    const childChord6 = chordNotesToModN(majorChordFromTonnetz(rootNote + b, tonnetz));
    arrayTargetSet.push(augmentedTriadRoot, childChord1, childChord2, childChord3, childChord4, childChord5, childChord6);

    return arrayTargetSet;
}

export const octaTowers = (rootNote: number, tonnetz: TonnetzSpaces = [3, 4, 5], reps: number = 3): Tetrachord[][] => {
    const [a] = tonnetz;
    const octaLeft: Tetrachord[] = [];
    const octaCenter: Tetrachord[] = [];
    const octaRight: Tetrachord[] = [];
    for (let index = 0; index >= (-a * Math.abs(reps)); index += (-a)) {
        const baseNote = rootNote + index;
        const leftHalfDim7 = chordNotesToModN(halfDiminishedChord(baseNote, tonnetz))
        const centerMinor7 = chordNotesToModN(minorSeventhChord(baseNote, tonnetz));
        const rightDominant7 = chordNotesToModN(dominantSeventhChord(baseNote + a, tonnetz));
        octaLeft.push(leftHalfDim7);
        octaCenter.push(centerMinor7);
        octaRight.push(rightDominant7);
    }
    const octaTowerMatrix: Tetrachord[][] = [];
    octaTowerMatrix.push(octaLeft, octaCenter, octaRight);
    return octaTowerMatrix;
}

export const octaTower = (rootNote: number, tonnetz: TonnetzSpaces = [3, 4, 5], reps: number = 3): Tetrachord[] => {
    const [a] = tonnetz;
    const octaTowerMatrix: Tetrachord[] = [];
    for (let index = 0; index >= (-a * Math.abs(reps)); index += (-a)) {
        const baseNote = rootNote + index;
        const leftHalfDim7 = chordNotesToModN(halfDiminishedChord(baseNote, tonnetz));
        const centerMinor7 = chordNotesToModN(minorSeventhChord(baseNote, tonnetz));
        const rightDominant7 = chordNotesToModN(dominantSeventhChord(baseNote + a, tonnetz));
        octaTowerMatrix.push(leftHalfDim7, centerMinor7, rightDominant7);
    }
    return octaTowerMatrix;
}

export const octaTowerLeft = (rootNote: number, tonnetz: TonnetzSpaces = [3, 4, 5], reps: number = 3): Tetrachord[] => {
    const [a] = tonnetz;
    const octaTowerMatrix: Tetrachord[] = [];
    for (let index = 0; index >= (-a * Math.abs(reps)); index += (-a)) {
        const baseNote = rootNote + index;
        const leftHalfDim7 = chordNotesToModN(halfDiminishedChord(baseNote, tonnetz));
        const centerMinor7 = chordNotesToModN(minorSeventhChord(baseNote, tonnetz));
        const rightDominant7 = chordNotesToModN(dominantSeventhChord(baseNote, tonnetz));
        octaTowerMatrix.push(leftHalfDim7, centerMinor7, rightDominant7);
    }
    return octaTowerMatrix;
}

export const octaTowerRight = (rootNote: number, tonnetz: TonnetzSpaces = [3, 4, 5], reps: number = 3): Tetrachord[] => {
    const [a] = tonnetz;
    const octaTowerMatrix: Tetrachord[] = [];
    for (let index = 0; index >= (-a * Math.abs(reps)); index += (-a)) {
        const baseNote = rootNote + index;
        const leftDominant7 = chordNotesToModN(dominantSeventhChord(baseNote, tonnetz));
        const centerMinor7 = chordNotesToModN(minorSeventhChord(baseNote, tonnetz));
        const rightHalfDim7 = chordNotesToModN(halfDiminishedChord(baseNote, tonnetz));
        octaTowerMatrix.push(leftDominant7, centerMinor7, rightHalfDim7);
    }
    return octaTowerMatrix;
}

export const boretzRegions = (rootNote: number, tonnetz: TonnetzSpaces = [3, 4, 5]): Tetrachord[] => {
    const [a, b, c] = tonnetz;
    const diminished7Chord: Tetrachord = diminishedSeventhChord(rootNote, tonnetz);

    const arrayTargetSet: Tetrachord[] = [];
    const childChord1 = chordNotesToModN(dominantSeventhChord(rootNote - (b - a), tonnetz));
    const childChord2 = chordNotesToModN(halfDiminishedChord(rootNote + a, tonnetz));
    const childChord3 = chordNotesToModN(dominantSeventhChord(rootNote + (c - a), tonnetz));
    const childChord4 = chordNotesToModN(halfDiminishedChord(rootNote + (c + (b - a)), tonnetz));
    const childChord5 = chordNotesToModN(dominantSeventhChord(rootNote - (a + b), tonnetz));
    const childChord6 = chordNotesToModN(halfDiminishedChord(rootNote + (-a), tonnetz));
    const childChord7 = chordNotesToModN(dominantSeventhChord(rootNote + (-b), tonnetz));
    const childChord8 = chordNotesToModN(halfDiminishedChord(rootNote, tonnetz));
    arrayTargetSet.push(diminished7Chord, childChord1, childChord2, childChord3, childChord4, childChord5, childChord6, childChord7, childChord8);

    return arrayTargetSet;
}

export const p12: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const p: number = (a - b);

    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, dominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, minorSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    const transformedChord: Tetrachord = [...reduceModN];
    if (transformedChord[1] % modulo !== (transformedChord[0] + b) % modulo) {
        transformedChord[1] -= p;
    } else {
        transformedChord[1] += p;
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const p14: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const p: number = (a - b);

    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, dominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, majorSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    const transformedChord: Tetrachord = [...reduceModN];
    if (transformedChord[3] % modulo !== (transformedChord[0] + (2 * b + a)) % modulo) {
        transformedChord[3] -= p;
    } else {
        transformedChord[3] += p;
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const p23: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const p: number = (a - b);

    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, minorSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, halfDiminishedChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    const transformedChord: Tetrachord = [...reduceModN];
    if (transformedChord[2] % modulo !== (transformedChord[0] + (a + b)) % modulo) {
        transformedChord[2] -= p;
    } else {
        transformedChord[2] += p;
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const p35: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const p: number = (a - b);

    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, halfDiminishedChord(reduceModN[0], tonnetz));
    const equalToChordTwo = secondChordComparison(reduceModN, diminishedSeventhChord(reduceModN[0], tonnetz));

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    const transformedChord: Tetrachord = [...reduceModN];
    if (transformedChord[3] % modulo !== (transformedChord[0] + (2 * a + b)) % modulo) {
        transformedChord[3] -= p;
    } else {
        transformedChord[3] += p;
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const r12: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, dominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, minorSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = minorSeventhChord(transformedChord[0] - a, tonnetz)
    } else {
        transformedChord = dominantSeventhChord(transformedChord[0] + a, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const r23: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, minorSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, halfDiminishedChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = halfDiminishedChord(transformedChord[0] - a, tonnetz)
    } else {
        transformedChord = minorSeventhChord(transformedChord[0] + a, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const r42: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, majorSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, minorSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = minorSeventhChord(transformedChord[0] - a, tonnetz)
    } else {
        transformedChord = majorSeventhChord(transformedChord[0] + a, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const r35: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, halfDiminishedChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, diminishedSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = diminishedSeventhChord(transformedChord[0] - a, tonnetz)
    } else {
        transformedChord = halfDiminishedChord(transformedChord[0] + a, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const r53: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, diminishedSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, halfDiminishedChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = halfDiminishedChord(transformedChord[0] - a, tonnetz)
    } else {
        transformedChord = diminishedSeventhChord(transformedChord[0] + a, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const l13: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, dominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, halfDiminishedChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = halfDiminishedChord(transformedChord[0] + b, tonnetz)
    } else {
        transformedChord = dominantSeventhChord(transformedChord[0] - b, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const l15: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, dominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, diminishedSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = diminishedSeventhChord(transformedChord[0] + b, tonnetz)
    } else {
        transformedChord = dominantSeventhChord(transformedChord[0] - b, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const l42: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, majorSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, minorSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = minorSeventhChord(transformedChord[0] + b, tonnetz)
    } else {
        transformedChord = majorSeventhChord(transformedChord[0] - b, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const q43: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, majorSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, halfDiminishedChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = halfDiminishedChord(transformedChord[0] + (b - a), tonnetz)
    } else {
        transformedChord = majorSeventhChord(transformedChord[0] - (b - a), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const q15: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, dominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, diminishedSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = diminishedSeventhChord(transformedChord[0] + (b - a), tonnetz)
    } else {
        transformedChord = dominantSeventhChord(transformedChord[0] - (b - a), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const rr35: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, halfDiminishedChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, diminishedSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = diminishedSeventhChord(transformedChord[0] + (2 * a), tonnetz)
    } else {
        transformedChord = halfDiminishedChord(transformedChord[0] - (2 * a), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const qq51: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, diminishedSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, dominantSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = dominantSeventhChord(transformedChord[0] + (c - a), tonnetz)
    } else {
        transformedChord = diminishedSeventhChord(transformedChord[0] - (c - a), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const n51: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, diminishedSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, dominantSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = dominantSeventhChord(transformedChord[0] + c, tonnetz)
    } else {
        transformedChord = diminishedSeventhChord(transformedChord[0] - c, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const p18: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const p: number = (a - b);

    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, dominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, sharpFiveDominantSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    const transformedChord: Tetrachord = [...reduceModN];
    if (transformedChord[2] % modulo !== (transformedChord[0] + a + b) % modulo) {
        transformedChord[2] += p;
    } else {
        transformedChord[2] -= p;
    }

    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const p19: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const p: number = (a - b);

    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, dominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, flatFiveDominantSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    const transformedChord: Tetrachord = [...reduceModN];
    if (transformedChord[2] % modulo !== (transformedChord[0] + a + b) % modulo) {
        transformedChord[2] -= p;
    } else {
        transformedChord[2] += p;
    }

    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const p26: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const p: number = (a - b);

    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, minorSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, minorMajorSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    const transformedChord: Tetrachord = [...reduceModN];
    if (transformedChord[3] % modulo !== (transformedChord[0] + (2 * a) + b) % modulo) {
        transformedChord[3] += p;
    } else {
        transformedChord[3] -= p;
    }

    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const p39: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const p: number = (a - b);

    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, halfDiminishedChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, flatFiveDominantSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    const transformedChord: Tetrachord = [...reduceModN];
    if (transformedChord[1] % modulo !== (transformedChord[0] + b) % modulo) {
        transformedChord[1] -= p;
    } else {
        transformedChord[1] += p;
    }

    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const p47: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const p: number = (a - b);

    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, majorSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, augmentedMajorSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    const transformedChord: Tetrachord = [...reduceModN];
    if (transformedChord[2] % modulo !== (transformedChord[0] + a + b) % modulo) {
        transformedChord[2] += p;
    } else {
        transformedChord[2] -= p;
    }

    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const p64: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const p: number = (a - b);

    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, minorMajorSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, majorSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    const transformedChord: Tetrachord = [...reduceModN];
    if (transformedChord[1] % modulo !== (transformedChord[0] + b) % modulo) {
        transformedChord[1] -= p;
    } else {
        transformedChord[1] += p;
    }

    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const p87: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const p: number = (a - b);

    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, sharpFiveDominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, augmentedMajorSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    const transformedChord: Tetrachord = [...reduceModN];
    if (transformedChord[3] % modulo !== (transformedChord[0] + (2 * a) + b) % modulo) {
        transformedChord[3] += p;
    } else {
        transformedChord[3] -= p;
    }

    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const p98: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const p: number = (c - a);

    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, flatFiveDominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, sharpFiveDominantSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    const transformedChord: Tetrachord = [...reduceModN];
    if (transformedChord[2] % modulo !== (transformedChord[0] + (2 * a)) % modulo) {
        transformedChord[2] -= p;
    } else {
        transformedChord[2] += p;
    }

    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const r63: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, minorMajorSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, halfDiminishedChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = halfDiminishedChord(transformedChord[0] - a, tonnetz)
    } else {
        transformedChord = minorMajorSeventhChord(transformedChord[0] + a, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const r76: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, augmentedMajorSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, minorMajorSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = minorMajorSeventhChord(transformedChord[0] - a, tonnetz)
    } else {
        transformedChord = augmentedMajorSeventhChord(transformedChord[0] + a, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const r86: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, sharpFiveDominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, minorMajorSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = minorMajorSeventhChord(transformedChord[0] - a, tonnetz)
    } else {
        transformedChord = sharpFiveDominantSeventhChord(transformedChord[0] + a, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const l71: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, augmentedMajorSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, dominantSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = dominantSeventhChord(transformedChord[0] + b, tonnetz)
    } else {
        transformedChord = augmentedMajorSeventhChord(transformedChord[0] - b, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const l89: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, sharpFiveDominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, flatFiveDominantSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = flatFiveDominantSeventhChord(transformedChord[0] + b, tonnetz)
    } else {
        transformedChord = sharpFiveDominantSeventhChord(transformedChord[0] - b, tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const q62: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, augmentedMajorSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, minorSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = minorSeventhChord(transformedChord[0] + (b - a), tonnetz)
    } else {
        transformedChord = augmentedMajorSeventhChord(transformedChord[0] - (b - a), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const q76: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, augmentedMajorSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, minorMajorSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = minorMajorSeventhChord(transformedChord[0] + (b - a), tonnetz)
    } else {
        transformedChord = augmentedMajorSeventhChord(transformedChord[0] - (b - a), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const rr19: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, dominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, flatFiveDominantSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = flatFiveDominantSeventhChord(transformedChord[0] + (2 * a), tonnetz)
    } else {
        transformedChord = dominantSeventhChord(transformedChord[0] - (2 * a), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const rr39: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, halfDiminishedChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, flatFiveDominantSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = flatFiveDominantSeventhChord(transformedChord[0] + (2 * a), tonnetz)
    } else {
        transformedChord = halfDiminishedChord(transformedChord[0] - (2 * a), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const rr98: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, flatFiveDominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, sharpFiveDominantSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = sharpFiveDominantSeventhChord(transformedChord[0] + (2 * a), tonnetz)
    } else {
        transformedChord = flatFiveDominantSeventhChord(transformedChord[0] - (2 * a), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const qq38: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, halfDiminishedChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, sharpFiveDominantSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = sharpFiveDominantSeventhChord(transformedChord[0] + (c - a), tonnetz)
    } else {
        transformedChord = halfDiminishedChord(transformedChord[0] - (c - a), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const qq98: TransformationFunctionsSeventhChords = (chordFromTonnetz, tonnetz): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const reduceModN = chordNotesToModN(chordFromTonnetz);

    const equalToChordOne = firstChordComparison(reduceModN, flatFiveDominantSeventhChord(reduceModN[0], tonnetz))
    const equalToChordTwo = secondChordComparison(reduceModN, sharpFiveDominantSeventhChord(reduceModN[0], tonnetz))

    if (equalToChordOne === equalToChordTwo) return reduceModN;

    let transformedChord: Tetrachord = [...reduceModN];
    if (equalToChordOne) {
        transformedChord = sharpFiveDominantSeventhChord(transformedChord[0] + (c - a), tonnetz)
    } else {
        transformedChord = flatFiveDominantSeventhChord(transformedChord[0] - (c - a), tonnetz)
    }
    const targetTetraChord = chordNotesToModN(transformedChord, modulo);
    return targetTetraChord;
}

export const SEVENTHSTRANFORMATIONS: ObjectTransformationsSeventhChords = {
    "p12": p12,
    "p14": p14,
    "p23": p23,
    "p35": p35,
    "r12": r12,
    "r23": r23,
    "r42": r42,
    "r35": r35,
    "r53": r53,
    "l13": l13,
    "l15": l15,
    "l42": l42,
    "q43": q43,
    "q15": q15,
    "rr35": rr35,
    "qq51": qq51,
    "n51": n51,
    "p18": p18,
    "p19": p19,
    "p26": p26,
    "p39": p39,
    "p47": p47,
    "p64": p64,
    "p87": p87,
    "p98": p98,
    "r63": r63,
    "r76": r76,
    "r86": r86,
    "l71": l71,
    "l89": l89,
    "q62": q62,
    "q76": q76,
    "rr19": rr19,
    "rr98": rr98,
    "qq38": qq38,
    "qq98": qq98
}

export const seventhsTransform = (chord: Tetrachord, transformation: string, tonnetz: TonnetzSpaces = [3, 4, 5]): Tetrachord | undefined => {
    const transformations = transformation.match(/([a-z]{1,2}[0-9]*)/g);
    if (!transformations || transformations && transformations.length < 1) {
        return undefined;
    }
    let transformedChord: Tetrachord = [...chord];
    for (let i = 0; i < transformations.length; i++) {
        const validTransformation = transformations[i];
        if (validTransformation) {
            const parsedTransform = SEVENTHSTRANFORMATIONS[validTransformation]
            if (parsedTransform) {
                transformedChord = parsedTransform(transformedChord, tonnetz);
            } else {
                return undefined;
            }
        }
    }
    return transformedChord;
}
