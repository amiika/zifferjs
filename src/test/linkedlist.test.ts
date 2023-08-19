// @ts-nocheck
import { describe, expect, it } from 'vitest'
import { pattern, cachedEventTest, cachedEventTest, get, pitch, freq, clear } from '../ziffers.ts'
import { Pitch } from '../types.ts'

describe('main-tests', () => {
  it('links', () => {
    clear('1 4');
    clear('1 5');
    clear('1 <5 3>');

    expect((cachedEventTest('1 4') as Pitch).pitch).toEqual(1);
    expect((cachedEventTest('1 4') as Pitch).pitch).toEqual(4);

    expect((cachedEventTest('1 5') as Pitch).pitch).toEqual(1);
    expect((cachedEventTest('1 5') as Pitch).pitch).toEqual(5);
    expect((cachedEventTest('1 5') as Pitch).pitch).toEqual(1);
 
    expect((cachedEventTest('1 <5 3>') as Pitch).pitch).toEqual(1);
    expect((cachedEventTest('1 <5 3>') as Pitch).pitch).toEqual(5);
    expect((cachedEventTest('1 <5 3>') as Pitch).pitch).toEqual(1);

})
})