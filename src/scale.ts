import { MODIFIERS, NOTES_TO_INTERVALS, getScale } from "./defaults";

export function noteFromPc(
    root: number | string,
    pitch_class: number,
    scale: string | Array<number>,
    octave: number = 0,
    modifier: number = 0,
    degrees: boolean = false
  ): [number, number | undefined] {
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

  export function noteNameToMidi(name: string): number {
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

  export function resolvePitchBend(note_value: number, semitones: number = 1): [number, number] {
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
  
  export function midiToFreq(note: number): number {
    const freq = 440  // Frequency of A
    return (freq / 32) * (2 ** ((note - 9) / 12))
  }
  
  
  
  