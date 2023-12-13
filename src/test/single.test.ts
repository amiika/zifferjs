import { describe, expect, it } from 'vitest'
import { pattern } from '../ziffers.ts'



describe('scale-tests', () => {


    it('scales', () => {
      expect(pattern("0 1 2 3 4 5 6 7 8 9 {10 11}").edo(11).octaves()).toEqual([0,0,0,0,0,0,0,0,0,0,0,1]);
    })
  

});