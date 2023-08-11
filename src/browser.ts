// @ts-nocheck
import { pattern } from './ziffers';
import { SCALES } from './defaults';
import { parse as parseScale } from './parser/scalaParser.ts'

const input = '(';
try {
  const result = pattern('s (3,5) (0 4 3 5)+(0 3)', {scale: '187. 356. 526. 672. 856. 985. 1222.'})
  console.log('Parsed result:', result);
  //console.log(result.evaluate());
} catch (error) {
  console.error('Error while parsing:', error);
}