import { describe, expect, it } from 'vitest'
import { pattern } from '../ziffers.ts'

describe('main-tests', () => {
  it('parse', () => {
    expect(pattern('1',{scale: "minor"}).values.length).toEqual(1);
    expect(pattern('12 3 4 5').values.length).toEqual(4);
    expect(1 + 1).toEqual(2);
    expect(true).to.be.true;
  })

  it('repeats', () => {
    expect(pattern('1 2:2 3:3 4').pitches()).toEqual([1,2,2,3,3,3,4]);
  })

  it('durations', () => {
    expect(pattern('e 1').durations()[0]).toEqual(0.125);
  })

  it('lists', () => {
    expect(pattern('(0 4 3 5)+(e0 3)').pitches()).toEqual([0, 4, 3, 5, 3, 7, 6, 8]);
  })

  it('notes', () => {
    expect(pattern('1 2 3 4').notes()).toEqual([62, 64, 65, 67]);
    expect(pattern('1 2 3 4',{key: "D3"}).notes()).toEqual([52, 54, 55, 57]);
    expect(pattern('1 2 3 4',{octave: 1}).notes()).toEqual([74,76,77,79]);
    expect(pattern('^ 1 2 3 4').notes()).toEqual([74,76,77,79]);
    expect(pattern('_ 1 _2 ^3 4').notes()).toEqual([50,40,65,55]);
  })

  it('cycles', () => {
    // Rewrite
    //expect(cachedEventTest('<1 <2 3>>').collect('pitch')).toEqual(1);
  })

  it('randoms', () => {
    expect(pattern('? ? ? ?').pitches()).to.satisfy((pitches: number[]) => pitches.every(pitch => pitch >= 0 && pitch <= 7));
    expect(pattern('(1,4) (0,4) (2,4)').pitches()).to.satisfy((pitches: number[]) => pitches.every(pitch => pitch >= 0 && pitch <= 4));
    expect(pattern('(1,7)',{scale: '187. 356. 526. 672. 856. 985. 1222.', seed: "foo"}).pitches()).toEqual([2]);
    expect(pattern('(1,7) (1,7)',{scale: '187. 356. 526. 672. 856. 985. 1222.', seed: "foo"}).pitches()).toEqual([2,3]);
    expect(pattern('(1,7) (1,7) (1,7) (1,7) (1,7)',{scale: '187. 356. 526. 672. 856. 985. 1222.', seed: "foo"}).pitches()).toEqual([2,3,3,2,5]);
})

  it('rests', () => {
    expect(pattern('er qr').durations()).toEqual([0.125,0.25]);
  })

  it('subdivisions', () => {
    expect(pattern('[1 [2 3]]').pitches()).toEqual([1,2,3]);
    expect(pattern('[1 [2 3]]').durations()).toEqual([0.125,0.0625,0.0625]);
    expect(pattern('[1 [2 (3 4)+(3 6)]]').durations()).toEqual([0.125,0.025,0.025,0.025,0.025,0.025]);
  })


})