// @ts-nocheck
import { get,pattern,cachedEventTest,cachedPattern,note } from './ziffers';
import { SCALES } from './defaults';
import { parse as parseScale } from './parser/scalaParser.ts'


try {

  console.log(cachedEventTest('1 2 3 4',{retrograde: true}));
 
  // This should output: 4// This should output: 4
//console.log('Parsed result:', result);
  //const test = next('1 2 3').scale('minor');
 //console.log(test);
  //console.log(result.evaluate());
} catch (error) {
  console.error('Error while parsing:', error);
}