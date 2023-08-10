import { describe, expect, it } from 'vitest'
import { SCALES, getScale } from '../defaults.ts'
import { getPrimes } from '../scale.ts'
import { parse as parseScale } from '../parser/scalaParser.ts'
import { pattern } from '../ziffers.ts'

const f = String.raw;

describe('scale-tests', () => {

  it('getters', () => {
    expect(getScale("chromatic")).toEqual([1,1,1,1,1,1,1,1,1,1,1,1]);
    expect(SCALES["MAJOR"]).toEqual([2,2,1,2,2,2,1]);
  })

  it('primes', () => {
    expect(getPrimes(2)).toEqual([2,3]);
    expect(getPrimes(5)).toEqual([2,3,5,7,11]);
  })

  it('parser', () => {
    // TODO: Better tests
    expect(parseScale("100.0 200.0 400.0 612.0")).toEqual([1,1,2,2.12]);
    expect(parseScale("9/8 5/4")).toEqual([2.0391000173077485,1.8240371213406]);
    expect(parseScale('[-1 1 0> [2 -1 0>')).toEqual([7.019550008653875,-2.0391000173077494]);
    expect(parseScale(f`5\29 9\29 14\29`)).toEqual([2.0689655172413803,1.6551724137931019,2.0689655172413794])
    expect(parseScale("9/8 32/27 4/3 3/2 5/3 16/9 2/1")).toEqual([2.0391000173077485,0.902249956730628,2.0391000173077485,2.0391000173077494,1.8240371213406001,1.1173128526977758,2.03910001730775,])
  })

  it('patterns', () => {
    expect(pattern("s (0 4 3 5)+(0 3)",{scale: '9/8 32/27 4/3 3/2 5/3 16/9 2/1'}).notes()).toEqual([60.0, 67.01955000865388, 64.98044999134612, 68.84358712999448, 64.98044999134612, 72.0, 69.96089998269225, 74.03910001730775])
  })

})