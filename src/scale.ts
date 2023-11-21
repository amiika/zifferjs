import { MODIFIERS, NOTES_TO_INTERVALS, getScale, getScaleLength } from "./defaults";
import { isScale, CHORDS, CIRCLE_OF_FIFTHS, INTERVALS_TO_NOTES, ROMANS } from "./defaults";
import { parse as parseScala } from "./parser/scalaParser";
import { Pitch } from "./types";
import { safeMod } from "./utils";

export const noteFromPc = (
    root: number | string,
    pitch_class: number,
    scale: string | Array<number>,
    octave: number = 0,
    modifier: number = 0,
    degrees: boolean = false
  ): [number, number | undefined] => {
    // Initialization
    pitch_class = degrees && pitch_class > 0 ? pitch_class - 1 : pitch_class;
    root = typeof root === 'string' ? noteNameToMidi(root) : root;
    const intervals = typeof scale === 'string' ? getScale(scale) : scale;
    const scale_length = intervals.length;
  
    // Resolve pitch classes to the scale and calculate octave
    if (pitch_class >= scale_length || pitch_class < 0) {
      octave += Math.floor(pitch_class / scale_length);
      pitch_class = pitch_class < 0 ? scale_length - (Math.abs(pitch_class) % scale_length) : pitch_class % scale_length;
      if (pitch_class === scale_length) {
        pitch_class = 0;
      }
    }
  
    // Computing the result
    let note = root + intervals.slice(0, pitch_class).reduce((a, b) => a + b, 0);
    note = note + octave * intervals.reduce((a, b) => a + b, 0) + modifier;
  
    if (Number.isInteger(note)) {
        return [note, undefined];
    }

    // Else if the note is a float, we need to resolve the pitch bend
    return resolvePitchBend(note);
    
}

export const noteNameToMidi = (name: string, defaultOctave: number = 4): number => {
  const items = name.match(/^([a-gA-G])([#bs])?([1-9])?$/);
  if (items === null) {
    return 60; // Default MIDI note C4 if the input is invalid
  }
  const [, noteName, modifierSymbol, octaveStr] = items;
  const octave = octaveStr ? parseInt(octaveStr, 10) : defaultOctave;
  const modifier = MODIFIERS[modifierSymbol] || 0;
  const interval = NOTES_TO_INTERVALS[noteName.toUpperCase()];
  return 12 + octave * 12 + interval + modifier;
}

export const resolvePitchBend = (note_value: number, semitones: number = 1): [number, number] => {
  let midi_bend_value = 8192;
  if (note_value % 1 !== 0) {
    const start_value = note_value > Math.round(note_value) ? note_value : Math.round(note_value);
    const end_value = note_value > Math.round(note_value) ? Math.round(note_value) : note_value;
    const bend_diff = midiToFreq(start_value) / midiToFreq(end_value);
    const bend_target = 1200 * Math.log2(bend_diff);
    // https://www.cs.cmu.edu/~rbd/doc/cmt/part7.html
    midi_bend_value = midi_bend_value + Math.floor(8191 * (bend_target / (100 * semitones)));
  }
  return [note_value, midi_bend_value];
}

export const midiToFreq = (note: number): number => {
  const freq = 440  // Frequency of A
  return (freq / 32) * (2 ** ((note - 9) / 12))
}

export const freqToMidi = (freq: number): number => {
  return (12 / Math.log(2)) * Math.log(freq / 440) + 69
}

export const ratioToCents = (ratio: number): number => {
  return 1200.0 * Math.log2(ratio);
}

export const primeSieve = function* () {
  const sieve: { [key: number]: number[] } = {};
  let current = 2;

  while (true) {
      if (!(current in sieve)) {
          yield current;
          sieve[current * current] = [current];
      } else {
          for (const composite of sieve[current]) {
              (sieve[composite + current] ||= []).push(composite);
          }
          delete sieve[current];
      }

      current++;
  }
}

export const getPrimes = (n: number): number[] => {
  const primeGenerator: Generator<number> = primeSieve();
  return Array.from({ length: n }, () => primeGenerator.next().value);
}

export const monzoToCents = (monzo: number[]): number => {
  const maxIndex = monzo.length;
  const primes = getPrimes(maxIndex+1);

  let ratio = 1;
  for (let i = 0; i < maxIndex; i++) {
      ratio *= Math.pow(primes[i], monzo[i]);
  }

  return ratioToCents(ratio);

}

export const centsToSemitones = (cents: number[]): number[] => {
  if (cents[0] !== 0) {
      cents = [0, ...cents];
  }
  const semitoneScale: number[] = [];
  for (let i = 0; i < cents.length - 1; i++) {
      const semitoneInterval = (cents[i + 1] - cents[i]) / 100;
      semitoneScale.push(semitoneInterval);
  }
  return semitoneScale;
}

export const scaleLength = (scale: string|number[]): number => {
  return typeof scale === 'string' ? getScale(scale).length : scale.length;
}

export const stepsToScale = (steps: number[]) => {
  return [0,...steps].reduce((scale: number[], step: number, index: number) => {
    const value = index === 0 ? 0 : step + scale[index-1];
    return [...scale, value];
  }, []);
}

export const scaleToSteps = (pcs: number[]): number[] => {
  const pc_int = (a: number, b: number): number => {
    const r = (b - a) % 12;
    return r < 0 ? r+12 : r;
  }
  return pcs.map((pc, i) => pc_int(pc, pcs[(i + 1) % pcs.length]));
}

export const numberToScale = (number: number): number[] => {
  if (number < 0 || number > 4095) {
    console.log("Input number must be odd and between 0 and 4095. Using major (2741) instead.");
    number = 2741;
  }
  if(number % 2 === 0) {
    console.log("Even numbers doesnt create a 'real' scale");
  }
  const arr = (number >>> 0).toString(2).padStart(12, '0').split('');
  return arr.reduce((acc, bit, i) => bit === '1' ? [11 - i, ...acc] : acc, [] as number[]);
}

export function scaleToNumber(pcs: number[]): number {
  if (pcs.length > 0 && pcs[pcs.length - 1] === 12) {
    pcs.pop(); // Remove the last value if 12
  }
  let number = 0;
  for (const pc of pcs) {
    number |= (1 << pc);
  }
  return number;
}

export const parseScalaScale = (scala: string): number[] => {
  try {
    return parseScala(scala) as number[];
  } catch (error) {
    return [];
  }
}

export const safeScale = (scale: string|number|number[]): number[] => {
  if(typeof scale === 'string') {
    if(isScale(scale)) {
      return getScale(scale);
    } else {
      const scalaScale = parseScalaScale(scale) as number[];
      if(scalaScale && scalaScale.length > 0) {
        return scalaScale;
      } else {
        return getScale('MAJOR');
      }
    }
  } else if(typeof scale === 'number') {
    return scaleToSteps(numberToScale(scale));
  }
  // TODO: Check for valid intervals?
  return scale;
}

export const namedChordFromDegree = (
  degree: number,
  name: string = "major",
  root: number|string = 60,
  scale: string = "CHROMATIC",
  numOctaves: number = 1
): number[] => {
  const intervals: number[] = CHORDS[name] || CHORDS["major"];
  root = typeof root === "string" ? noteNameToMidi(root) : root;
  const scaleDegree: number = getScaleNotes(scale, root)[degree - 1];
  const notes: number[] = [];

  for (let curOct = 0; curOct <= numOctaves; curOct++) {
    for (const interval of intervals) {
      notes.push(scaleDegree + interval + curOct * 12);
    }
  }
   return notes;
}

export const getPitchesFromNamedChord = (
  name: string = "major",
  root: number|string = 60,
  scale: string = "MAJOR",
  numOctaves: number = 1,
  duration: number
): Pitch[] => {
  const notes = namedChordFromDegree(1, name, root, "CHROMATIC", numOctaves);
  const parsedScale = typeof scale === "string" ? getScale(scale) : scale;
  const pitches: Pitch[] = notes.map(note => {
    const pitch = midiToPitchClass(note, root, scale);
    return new Pitch({text: pitch.text, note: note, pitch: pitch.pc, octave: pitch.octave, add: pitch.add, duration: duration, scaleName: scale, parsedScale: parsedScale, key: root});
  });
  return pitches;
}

export const getScaleNotes = (
  name: string|number|number[], 
  root: number|string = 60, 
  numOctaves: number = 1
  ): number[] => {
  const scale = safeScale(name);
  let scaleRoot = typeof root === "string" ? noteNameToMidi(root) : root;
  const scaleNotes: number[] = [scaleRoot];

  for (let i = 0; i < numOctaves; i++) {
    for (const semitone of scale) {
      scaleRoot += semitone;
      scaleNotes.push(scaleRoot);
    }
  }

  return scaleNotes;
}

/* Get all scale notes, defaults for full sized keyboard from 21 to 108 */
export const getAllScaleNotes = (
  name: string|number|number[],
  key: string|number = "C",
  from: number = 21,
  to: number = 108
): number[] => {
  const scale = safeScale(name);
  const scaleNotes: number[] = [];
  let scaleRoot = typeof key === "string" ? noteNameToMidi(key, 0) : key;
  for (let i = 0; i < 9; i++) {
    for (const semitone of scale) {
      scaleRoot += semitone;
      scaleNotes.push(scaleRoot);
    }
  }
  return scaleNotes.filter(note => note >= from && note <= to);
}

export const chordFromDegree = (
  degree: number,
  scale: string = "MAJOR",
  root: string | number = 60,
  numOctaves: number = 1,
  name: string | undefined = undefined,
): number[] => {
  const rootMidi: number = typeof root === "string" ? noteNameToMidi(root) : root;
  if (
    !name &&
    typeof scale === "string" &&
    scale.toUpperCase() === "CHROMATIC"
  ) { name = "major"; }

  if (name) {
    return namedChordFromDegree(degree, name, rootMidi, scale, numOctaves);
  } else {
    return getChordFromScale(degree, rootMidi, scale);
  }
}

export const getChordFromScale = (
  degree: number,
  root: number = 60,
  scale: string | number[] = "Major",
  numNotes: number = 3,
  skip: number = 2
): number[] => {
  const scaleLength: number = typeof scale === "string" ? getScaleLength(scale) : scale.length;

  const numOctaves: number = Math.floor((numNotes * skip + degree - 1) / scaleLength) + 1;
  const scaleNotes: number[] = getScaleNotes(scale, root, numOctaves);
  
  const chord: number[] = [];

  for (let i = degree - 1; chord.length < numNotes && i < scaleNotes.length; i += skip) {
    chord.push(scaleNotes[i]);
  }

  return chord;
}

export const chord = (name: string): number[] => {
  // Parse chord name from notation scientific notation + chord name
  // For example Cmaj or C7
  const parsedChord = name.match(/([a-gA-G][#bs]?)([0-9])?([a-zA-Z0-9]+)/);
  if (parsedChord === null) {
    // C major chord by default
    return [60, 64, 67];
  }
  let [, root, oct, chordName] = parsedChord;
  const rootMidi = noteNameToMidi(root);
  const octave = oct ? parseInt(oct, 10) : 0;
  const namedChord = namedChordFromDegree(1, chordName, rootMidi, "CHROMATIC", octave);	
  return namedChord;
}

export const parseRoman = (numeral: string): number => {
  const values: number[] = numeral.split('').map(val => ROMANS[val]);

  return values.reduce((result, current, index, array) => {
    if (index < array.length - 1 && current < array[index + 1]) {
      return result - current;
    } else {
      return result + current;
    }
  }, 0);
}

export const accidentalsFromNoteName = (name: string): number => {
  if (!CIRCLE_OF_FIFTHS.includes(name)) {
    name = midiToNoteName(noteNameToMidi(name));
  }

  const idx: number = CIRCLE_OF_FIFTHS.indexOf(name);
  return idx - 6;
}

export const midiToNoteName = (midi: number): string => {
  return INTERVALS_TO_NOTES[midi % 12];
}

export const accidentalsFromMidiNote = (note: number): number => {
  const name: string = midiToNoteName(note);
  return accidentalsFromNoteName(name);
}

export const midiToTpc = (note: number, key: string | number): number => {
  let acc: number;

  if (typeof key === "string") {
    acc = accidentalsFromNoteName(key[0]);
  } else {
    acc = accidentalsFromMidiNote(key);
  }

  return ((note * 7 + 26 - (11 + acc)) % 12 + (11 + acc)) as number;
}

export const midiToOctave = (note: number, key: number = 60): number => {
  return note <= 0 ? 0 : Math.floor((note - key) / 12);
}

type PitchClass = {
  text: string,
  pc: number,
  octave: number,
  add: number,
}

export const midiToPitchClass = (note: number, key: string | number = 60, scale: string = "MAJOR"): PitchClass => {
  function repeatSign(num: number): string {
    return num > 0 ? "^".repeat(num) : num < 0 ? "_".repeat(Math.abs(num)) : "";
  }
  
  const keyNumber = typeof key == "number" ? key : noteNameToMidi(key);
  const pitchClass: number = safeMod(note - keyNumber, 12);

  const octave: number = midiToOctave(note, keyNumber);
  if(typeof scale === "string" && scale.toUpperCase() === "CHROMATIC") {
    return {
      text: pitchClass.toString(),
      pc: pitchClass,
      octave: octave,
      add: 0
    };
  }
  
  const sharps: string[] = ["0", "#0", "1", "#1", "2", "3", "#3", "4", "#4", "5", "#5", "6"];
  const flats: string[] = ["0", "b1", "1", "b2", "2", "3", "b4", "4", "b5", "5", "b6", "6"];
  
  const tpc: number = midiToTpc(note, key);
  
  let npc: string;

  if ((tpc >= 6 && tpc <= 12 && flats[pitchClass].length === 2)) {
    npc = flats[pitchClass];
  } else {
    npc = sharps[pitchClass];
  }

  if (npc.length > 1) {
    const modifier: number = npc[0] === "#" ? 1 : -1;
     return {
      text: repeatSign(octave) + npc,
      pc: parseInt(npc[1]),
      octave: octave,
      add: modifier,
    };
  }

  return {
    text: repeatSign(octave) + npc,
    pc: parseInt(npc),
    octave: octave,
    add: 0
  };
}

export const noteNameToPitchClass = (name: string, key: string, scale: string): PitchClass => {
  const midiNote = noteNameToMidi(name);
  return midiToPitchClass(midiNote, key, scale);
}

// Dmitri Tymoczko voice leading algorithm

export const octaveTransform = (inputChord: number[], root: number): number[] => {
  return inputChord.map(x => root + (x % 12)).sort((a, b) => a - b);
}

export const tMatrix = (chordA: number[], chordB: number[]): (number|undefined)[] => {
  const root = chordA[0];
  const transformedA = octaveTransform(chordA, root);
  const transformedB = octaveTransform(chordB, root);
  return transformedA.map((a, index) => transformedB[index] ? transformedB[index] - a : undefined);
}

export const voiceLead = (chordA: number[], chordB: number[]): number[] => {
  const root = chordA[0];
  const aLeadings = chordA.map(x => [x,
    octaveTransform(chordA, root).indexOf(root + (x % 12))
  ]);

  const tMatrixResult = tMatrix(chordA, chordB);

  const bVoicing = aLeadings.map(([x, y]) => {
      return tMatrixResult[y] ? x + tMatrixResult[y]! : x;
  });

  // TODO: Check octave for extra notes in chordB?

  return bVoicing;
}

export const voiceLeadChords = (inputChords: number[][]): number[][] => {
  // Initialize the result array with the first chord as-is
  const voiceLedChords: number[][] = [inputChords[0]];

  // Iterate through each subsequent chord and voice lead it to the previous chord
  for (let i = 1; i < inputChords.length; i++) {
    const voiceLedChord = voiceLead(inputChords[i], voiceLedChords[i - 1]);
    voiceLedChords.push(voiceLedChord);
  }

  return voiceLedChords;
}

export function transpose(pitches: number[], interval: number, base: number = 12): number[] {
  return pitches.map((x) => (x + interval) % base);
}

export function invert(pitches: number[], axis: number = 0, base: number = 12): number[] {
  return pitches.map((x) => { return (axis - x) % base });
}

export function multiply(pitches: number[], m: number = 5, base: number = 12): number[] {
  return pitches.map((x) => (x * m) % base);
}

export function zero(pitches: number[], base: number = 12): number[] {
  return transpose(pitches, -pitches[0], base);
}

export function cycles(pitches: number[]) {
  const sortedPitches = pitches.slice().sort((a, b) => a - b);
  const cyclicVariations = [];
  for (let i = 0; i < sortedPitches.length; i++) {
    cyclicVariations.push(sortedPitches.slice(i).concat(sortedPitches.slice(0, i)));
  }
  return cyclicVariations;
}

export function normalForm(pitches: number[], base: number = 12): number[] {
  return mostLeftCompact(cycles(pitches), base);
}

export function prime(pitches: number[], base: number = 12): number[] {
  return mostLeftCompact([normalForm(pitches, base), normalForm(invert(pitches, 0, base), base)], base);
}

export function arrayToBinary(array: number[]): number {
  return array.reduce((sum, n) => sum + 2 ** n, 0);
}

export function mostLeftCompact(pcsetArray: number[][], base: number): number[] {
  if (!pcsetArray.every((pcs) => pcs.length === pcsetArray[0].length)) {
    throw new Error("Format error: All pitch sets must have the same cardinality");
  }
  const zeroedPitchArrays = pcsetArray.map((pcs) => zero(pcs, base));
  const binaries = zeroedPitchArrays.map((array) => arrayToBinary(array));
  const minBinary = Math.min(...binaries);
  const winners = pcsetArray.filter((_, i) => binaries[i] === minBinary);
  return winners.sort()[0];
}

export function nearScales(scale: number): number[] {
  const near: number[] = [];
  for (let i = 1; i < 12; i++) {
    let copy = scale;
    if (scale & (1 << i)) {
      // Tone off
      const off = copy ^ (1 << i);
      near.push(off);
      // Down one semitone
      copy = off | (1 << (i - 1));
      near.push(copy);
      // Up one semitone but not octave
      if (i !== 11) {
        copy = off | (1 << (i + 1));
        near.push(copy);
      }
    } else {
      copy = copy | (1 << i);
      near.push(copy);
    }
  }
  const uniq = Array.from(new Set(near));
  return uniq;
}