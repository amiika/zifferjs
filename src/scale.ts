import { MODIFIERS, NOTES_TO_INTERVALS, getScale } from "./defaults";

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

export const noteNameToMidi = (name: string): number => {
  const items = name.match(/^([a-gA-G])([#bs])?([1-9])?$/);
  if (items === null) {
    return 60; // Default MIDI note C4 if the input is invalid
  }
  const [, noteName, modifierSymbol, octaveStr] = items;
  const octave = octaveStr ? parseInt(octaveStr, 10) : 4;
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
    console.log("Odd number doesnt create real scale");
  }
  const arr = (number >>> 0).toString(2).padStart(12, '0').split('');
  return arr.reduce((acc, bit, i) => bit === '1' ? [11 - i, ...acc] : acc, [] as number[]);
}