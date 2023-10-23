export type TonnetzSpaceConnected = [3, 4, 5] | [1, 1, 10] | [1, 2, 9] | [1, 3, 8] | [1, 4, 7] | [1, 5, 6] | [2, 3, 7] | [2, 5, 5]
export type TonnetzSpaceNonConnected = [2, 4, 6] | [2, 2, 8] | [3, 3, 6] | [4, 4, 4]

export type TonnetzSpaces = TonnetzSpaceConnected | TonnetzSpaceNonConnected

export type TriadChord = [number, number, number]
export type Tetrachord = [number, number, number, number]

export type TransformationFunctions = (triad: TriadChord, tonnetz: TonnetzSpaces) => TriadChord;

export type ObjectTransformations = {
    [key: string]: TransformationFunctions
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

export const dominantSeventChord = (rootNote: number, tonnetz: TonnetzSpaces): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + b % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (a + b) % modulo) + modulo) % modulo;
    const fourthNote = ((rootNote + (2 * a + b) % modulo) + modulo) % modulo;

    const dominant7: Tetrachord = [firstNote, secondNote, thirdNote, fourthNote];
    return dominant7;
};

export const minorSeventhChord = (rootNote: number, tonnetz: TonnetzSpaces): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + a % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (a + b) % modulo) + modulo) % modulo;
    const fourthNote = ((rootNote + (2 * a + b) % modulo) + modulo) % modulo;

    const min7: Tetrachord = [firstNote, secondNote, thirdNote, fourthNote];
    return min7;
};

export const halfDiminishedChord = (rootNote: number, tonnetz: TonnetzSpaces): Tetrachord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + a % modulo) + modulo) % modulo;
    const thirdNote = (rootNote + ((a + b - (b - a)) % modulo) + modulo) % modulo;
    const fourthNote = ((rootNote + (2 * a + b) % modulo) + modulo) % modulo;

    const halfdim7: Tetrachord = [firstNote, secondNote, thirdNote, fourthNote];
    return halfdim7;
};

export const augmentedTriadChord = (rootNote: number, tonnetz: TonnetzSpaces): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;

    const firstNote = ((rootNote % modulo) + modulo) % modulo;
    const secondNote = ((rootNote + b % modulo) + modulo) % modulo;
    const thirdNote = ((rootNote + (2 * b) % modulo) + modulo) % modulo;

    const augmentedTriad: TriadChord = [firstNote, secondNote, thirdNote];
    return augmentedTriad;
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
};

export const chordNotesToModN = <T extends number[]>(chord: T, modulo: number = 12): T => {
    const notesModN: number[] = [];
    for (let i = 0; i < chord.length; i++) {
        const noteComponents = ((chord[i] % modulo) + modulo) % modulo;
        notesModN.push(noteComponents);
    }
    return notesModN as T;
}

export function sortingTriadChord(disorderedTriad: TriadChord): TriadChord {
    disorderedTriad.sort((a, b) => a - b);
    const temp: TriadChord = [...disorderedTriad];

    if (Math.abs(disorderedTriad[1] - disorderedTriad[0]) === 5) {
        disorderedTriad[0] = temp[1];
        disorderedTriad[1] = temp[2];
        disorderedTriad[2] = temp[0];
    }
    if (Math.abs(disorderedTriad[2] - disorderedTriad[1]) === 5) {
        disorderedTriad[0] = temp[2];
        disorderedTriad[1] = temp[0];
        disorderedTriad[2] = temp[1];
    }
    return disorderedTriad;
}

export const parallelTransform: TransformationFunctions = (chordFromTonnetz, tonnetz): TriadChord => {
    const [a, b, c] = tonnetz;
    const modulo = a + b + c;
    const p: number = (a - b);

    const reduceModN = chordNotesToModN(chordFromTonnetz);
    const rootPositionTriad = sortingTriadChord(reduceModN);
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
    const rootPositionTriad = sortingTriadChord(reduceModN);
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
    const rootPositionTriad = sortingTriadChord(reduceModN);
    const transformedChord: TriadChord = [...rootPositionTriad];
    if (transformedChord[1] % modulo !== (transformedChord[0] + b) % modulo) {
        transformedChord[0] += r;
    } else {
        transformedChord[2] -= r;
    }
    const targetTriadChord = chordNotesToModN(transformedChord, modulo);
    return targetTriadChord;
}

export const CHORD_TYPES: ChordGenerators = {
    "M": majorChordFromTonnetz,
    "maj": majorChordFromTonnetz,
    "m": minorChordFromTonnetz,
    "min": minorChordFromTonnetz,
    "7": dominantSeventChord,
    "m7": minorSeventhChord,
    "hdim7": halfDiminishedChord,
    "aug": augmentedTriadChord,
    "augmented": augmentedTriadChord,
    "dim7": diminishedSeventhChord
};

export const chordFromTonnetz = (rootNote: number, chordType: string, tonnetz: TonnetzSpaces = [3, 4, 5]): TriadChord | Tetrachord => {
    return CHORD_TYPES[chordType](rootNote, tonnetz);
}

export const TRANSFORMATIONS: ObjectTransformations = {
    "p": parallelTransform,
    "l": leadingToneTransform,
    "r": relativeTransform,
};

export const transform = (chord: TriadChord, transformation: string, tonnetz: TonnetzSpaces = [3, 4, 5]): TriadChord => {
    const transformations = transformation.split("");
    let transformedChord: TriadChord = [...chord];
    for (let i = 0; i < transformations.length; i++) {
        const validTransformation = transformations[i];
        if (validTransformation) {
            transformedChord = TRANSFORMATIONS[validTransformation](transformedChord, tonnetz);
        }
    }
    return transformedChord;
}

export const hexaCycles = (rootNote: number, tonnetz: TonnetzSpaces, reps: number = 3): TriadChord[] => {
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

export const octaCycles = (rootNote: number, tonnetz: TonnetzSpaces, reps: number = 4): TriadChord[] => {
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

export const enneaCycles = (rootNote: number, tonnetz: TonnetzSpaces, reps: number = 3): Tetrachord[] => {
    const [, b,] = tonnetz;
    const arrayTargetSet: Tetrachord[] = [];
    for (let index = 0; index < Math.abs(reps); index++) {
        const baseNote = rootNote + ((-b) * index);
        const dominant7 = chordNotesToModN(dominantSeventChord(baseNote, tonnetz));
        const minor7 = chordNotesToModN(minorSeventhChord(baseNote, tonnetz));
        const halfdim7 = chordNotesToModN(halfDiminishedChord(baseNote, tonnetz));
        arrayTargetSet.push(dominant7, minor7, halfdim7);
    }
    return arrayTargetSet;
}

export const weitzmannRegions = (rootNote: number, tonnetz: TonnetzSpaces = [3, 4, 5]): Map<TriadChord, TriadChord[]> => {
    const [a, b, c] = tonnetz;
    const augmentedTriadRoot: TriadChord = augmentedTriadChord(rootNote, tonnetz);

    const arrayTargetSet: TriadChord[] = [];
    const childChord1 = chordNotesToModN(minorChordFromTonnetz(rootNote + (b - a), tonnetz));
    const childChord2 = chordNotesToModN(minorChordFromTonnetz(rootNote + c, tonnetz))
    const childChord3 = chordNotesToModN(minorChordFromTonnetz(rootNote + b + c, tonnetz))
    const childChord4 = chordNotesToModN(majorChordFromTonnetz(rootNote, tonnetz));
    const childChord5 = chordNotesToModN(majorChordFromTonnetz(rootNote + (-b), tonnetz));
    const childChord6 = chordNotesToModN(majorChordFromTonnetz(rootNote + b, tonnetz));
    arrayTargetSet.push(childChord1, childChord2, childChord3, childChord4, childChord5, childChord6);

    const treeChords: Map<TriadChord, TriadChord[]> = new Map();
    treeChords.set(augmentedTriadRoot, arrayTargetSet)
    return treeChords;
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
        const rightDominant7 = chordNotesToModN(dominantSeventChord(baseNote + a, tonnetz));
        octaLeft.push(leftHalfDim7);
        octaCenter.push(centerMinor7);
        octaRight.push(rightDominant7);
    }
    const octaTowerMatrix: Tetrachord[][] = [];
    octaTowerMatrix.push(octaLeft, octaCenter, octaRight);
    return octaTowerMatrix;
}

export const boretzRegions = (rootNote: number, tonnetz: TonnetzSpaces = [3, 4, 5]): Map<Tetrachord, Tetrachord[]> => {
    const [a, b, c] = tonnetz;
    const diminished7Chord: Tetrachord = diminishedSeventhChord(rootNote, tonnetz);

    const arrayTargetSet: Tetrachord[] = [];
    const childChord1 = chordNotesToModN(dominantSeventChord(rootNote - (b - a), tonnetz));
    const childChord2 = chordNotesToModN(halfDiminishedChord(rootNote + a, tonnetz));
    const childChord3 = chordNotesToModN(dominantSeventChord(rootNote + (c - a), tonnetz));
    const childChord4 = chordNotesToModN(halfDiminishedChord(rootNote + (c + (b - a)), tonnetz));
    const childChord5 = chordNotesToModN(dominantSeventChord(rootNote - (a + b), tonnetz));
    const childChord6 = chordNotesToModN(halfDiminishedChord(rootNote + (-a), tonnetz));
    const childChord7 = chordNotesToModN(dominantSeventChord(rootNote + (-b), tonnetz));
    const childChord8 = chordNotesToModN(halfDiminishedChord(rootNote, tonnetz));
    arrayTargetSet.push(childChord1, childChord2, childChord3, childChord4, childChord5, childChord6, childChord7, childChord8);

    const treeChords: Map<Tetrachord, Tetrachord[]> = new Map();
    treeChords.set(diminished7Chord, arrayTargetSet)
    return treeChords;
}

