// @ts-nocheck
import { get,pattern,cachedIterator,note } from './ziffers';
import { SCALES } from './defaults';
import { parse as parseScale } from './parser/scalaParser.ts'
import * as seedrandom from 'seedrandom';


try {
 console.log(cachedIterator('1 2'));
 console.log(cachedIterator('1 2'));
 console.log(get('2 4 1',{key: "C"}).collect('pitch'));
 console.log(get('2 4 1',{key: "C"}).collect('pitch'));
  //console.log('Parsed result:', result);
  //const test = next('1 2 3').scale('minor');
 //console.log(test);
  //console.log(result.evaluate());
} catch (error) {
  console.error('Error while parsing:', error);
}