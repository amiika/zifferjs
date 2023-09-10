// @ts-nocheck
import { pattern,note } from './ziffers';
import { SCALES } from './defaults';
import { parse as parseScale } from './parser/scalaParser.ts'
import { freqToMidi, midiToFreq, resolvePitchBend, stepsToScale, scaleToSteps, numberToScale} from './scale.ts';


try {
  const yep = pattern('4 i7 6 v 7 vi iv7');
  console.log(yep.notes());
  yep.lead();
  console.log(yep.notes());
  // This should output: 4// This should output: 4
//console.log('Parsed result:', result);
  //const test = next('1 2 3').scale('minor');
 //console.log(test);
  //console.log(result.evaluate());
} catch (error) {
  console.error('Error while parsing:', error);
} 