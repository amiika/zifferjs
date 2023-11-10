import { describe, expect, it } from 'vitest'
import { pAdicExpansion, pAdicNorm, pAdicValuation } from '../patterns.ts';
describe('padic-tests', () => {

  it('padic', () => {
    expect(pAdicValuation(1000,7)).toEqual(0);
    expect(pAdicValuation(1002,7)).toEqual(0);
    expect(pAdicNorm(10,11)).toEqual(1);
    expect(pAdicExpansion(100,7,4)).toEqual([2,0,2]);
    expect(pAdicExpansion(101,7,4)).toEqual([3,0,2]);
    expect(pAdicExpansion(102,7,4)).toEqual([4,0,2]);
    expect(pAdicExpansion(1000,7,4)).toEqual([6,2,6]);
  })

})