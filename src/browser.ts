// @ts-nocheck
import { pattern,next } from './ziffers';
import { SCALES } from './defaults';
import { parse as parseScale } from './parser/scalaParser.ts'
import * as seedrandom from 'seedrandom';

try {
  const result = pattern('q (1,5)', {scale: '87. 256. 126. 672. 856. 985. 1222.'})

  console.log('Parsed result:', result);
  //console.log(result.evaluate());
} catch (error) {
  console.error('Error while parsing:', error);
}