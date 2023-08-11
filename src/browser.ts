// @ts-nocheck
import { pattern,next } from './ziffers';
import { SCALES } from './defaults';
import { parse as parseScale } from './parser/scalaParser.ts'
import * as seedrandom from 'seedrandom';

try {
 // const result = pattern('<2 3>')
 next('<1 2>')
 next('<1 2>')

  //console.log('Parsed result:', result);
  //console.log(result.evaluate());
} catch (error) {
  console.error('Error while parsing:', error);
}