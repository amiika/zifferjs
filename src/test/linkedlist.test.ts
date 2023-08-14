// @ts-nocheck
import { describe, expect, it } from 'vitest'
import { pattern, cachedStart, cachedIterator, get, pitch, freq, clear } from '../ziffers.ts'
import { Pitch } from '../types.ts'

describe('main-tests', () => {
  it('links', () => {
    clear('1 4');
    clear('1 5');
    clear('1 <5 3>');

    expect((cachedStart('1 4').next() as Pitch).pitch).toEqual(1);
    expect((cachedStart('1 4') as Pitch).pitch).toEqual(1);
    expect((cachedStart('1 4') as Pitch).pitch).toEqual(4);

    expect((cachedIterator('1 5') as Pitch).pitch).toEqual(1);
    expect((cachedIterator('1 5') as Pitch).pitch).toEqual(5);
    expect((cachedIterator('1 5') as Pitch).pitch).toEqual(1);
 
    expect((cachedIterator('1 <5 3>') as Pitch).pitch).toEqual(1);
    expect((cachedIterator('1 <5 3>') as Pitch).pitch).toEqual(5);
    expect((cachedIterator('1 <5 3>') as Pitch).pitch).toEqual(1);

})
})