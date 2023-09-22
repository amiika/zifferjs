// @ts-nocheck
import { pattern,note } from './ziffers';
import { SCALES } from './defaults';
import { parse as parseScale } from './parser/scalaParser.ts'
import { freqToMidi, midiToFreq, resolvePitchBend, stepsToScale, scaleToSteps, numberToScale, midiToPitchClass} from './scale.ts';


console.log(pattern('h [0 2 3 3] 1 w 3 [0 3] w [0 [2 4]] d 3 [0 [1 2 [3 4]]]').durations());