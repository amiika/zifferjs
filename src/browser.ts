import { z } from './ziffers';
import { SCALES } from './defaults';

const input = '(1 2 3)+(1 3)';
try {
  const result = z(input);
  console.log('Parsed result:', result);
  //console.log(result.evaluate());
} catch (error) {
  console.error('Error while parsing:', error);
}