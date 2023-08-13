// @ts-nocheck
import { pattern,next,note } from './ziffers';
import { SCALES } from './defaults';
import { parse as parseScale } from './parser/scalaParser.ts'
import * as seedrandom from 'seedrandom';


try {
  const result = pattern('1 2 3',{seed: "foo"});
  console.log(result);
 result.values[0].pitch = 10;

  //console.log('Parsed result:', result);
  //const test = next('1 2 3').scale('minor');
 //console.log(test);
  //console.log(result.evaluate());
} catch (error) {
  console.error('Error while parsing:', error);
}