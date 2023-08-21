// @ts-nocheck
import { describe, expect, it } from 'vitest'
import { pattern, cachedPattern, cachedEventTest, cachedEventTest, get, pitch, freq, clear } from '../ziffers.ts'
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


it('hasStarted', () => {
  clear('1 2 3 4');
  
  let pattern = cachedPattern("1 2 3 4");
  expect(pattern.hasStarted()).toEqual(false);

  let event = pattern.next();
  expect(pattern.peek().type).toEqual("Pitch");
  expect(pattern.hasStarted()).toEqual(true);
  expect(event.type).toEqual("Start");

  event = pattern.peek();
  expect(event.collect("pitch")).toEqual(1);

  event = pattern.next();
  expect(event.collect("pitch")).toEqual(1);
  
})

})