// @ts-nocheck
import { pattern,note } from './ziffers';
import { SCALES } from './defaults';
import { parse as parseScale } from './parser/scalaParser.ts'
import { freqToMidi, midiToFreq, resolvePitchBend, stepsToScale, scaleToSteps, numberToScale, midiToPitchClass} from './scale.ts';


try {
  const yep = pattern('i v vi iv');
  console.log(yep.notes());
  yep.invert(-1);
  console.log(yep.notes());
} catch (error) {
  console.error('Error while parsing:', error);
} 