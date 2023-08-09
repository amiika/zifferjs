import { describe, expect, it } from 'vitest'
import { SCALES, getScale } from '../defaults.ts'
import { getPrimes } from '../scale.ts'
import { parse as parseScale } from '../parser/scalaParser.ts'
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
    expect(parseScale(".100 .200 .300")).toEqual([0.1,0.2,0.3]);
    expect(parseScale("9/8 5/4")).toEqual([203.91000173077484,386.31371386483485]);
    expect(parseScale('[-1 1 0> [2 -1 0>')).toEqual([701.9550008653874,498.0449991346125]);
    expect(parseScale(f`5\29 9\29 14\29`)).toEqual([206.89655172413802,372.4137931034482,579.3103448275862])
    expect(parseScale(f`1\6 2\6<4/3>`)).toEqual([200.00000000000006, 166.01499971153754])
  })

})