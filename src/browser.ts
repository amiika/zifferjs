import { pattern } from './ziffers';
import { SCALES } from './defaults';
import { parse as parseScale } from './parser/scalaParser.ts'

const input = '(1 2 3)+(1 3)';
try {
  const result = pattern('s (0 4 3 5)+(0 3)', {scale: '9/8 32/27 4/3 3/2 5/3 16/9 2/1'})
  console.log('Parsed result:', result);
  //console.log(result.evaluate());
} catch (error) {
  console.error('Error while parsing:', error);
}