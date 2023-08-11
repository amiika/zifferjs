// @ts-nocheck
import { pattern,next } from './ziffers';
import { SCALES } from './defaults';
import { parse as parseScale } from './parser/scalaParser.ts'
import * as seedrandom from 'seedrandom';

try {
  next('q (1,5)',{redo:0})
  next('q (1,5)',{redo:0})

  console.log('Parsed result:', result);
  //console.log(result.evaluate());
} catch (error) {
  console.error('Error while parsing:', error);
}