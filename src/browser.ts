import { Ziffers } from './ziffers';
import { SCALES } from './defaults';

const input = '0.3 ((1):2):2 q4:5 q1 (1 2(3 4)):2';
try {
  const result = new Ziffers(input);
  console.log('Parsed result:', result);
  //console.log(result.evaluate());
} catch (error) {
  console.error('Error while parsing:', error);
}