import { describe, expect, it } from 'vitest'
import { pattern, cachedIterator, get, pitch, freq, clear } from '../ziffers.ts'

describe('main-tests', () => {
  it('parse', () => {
    expect(pattern('1',{scale: "minor"}).values.length).toEqual(1);
    expect(pattern('12 3 4 5').values.length).toEqual(4);
    expect(1 + 1).toEqual(2);
    expect(true).to.be.true;
  })

  it('durations', () => {
    expect(pattern('e 1').durations()[0]).toEqual(0.125);
  })

  it('lists', () => {
    expect(pattern('(0 4 3 5)+(e0 3)').pitches()).toEqual([0, 4, 3, 5, 3, 7, 6, 8]);
  })

  it('notes', () => {
    expect(pattern('1 2 3 4').notes()).toEqual([62, 64, 65, 67]);
    expect(pattern('1 2 3 4',{octave: 1}).notes()).toEqual([74,76,77,79]);
    expect(pattern('^ 1 2 3 4').notes()).toEqual([74,76,77,79]);
    expect(pattern('_ 1 _2 ^3 4').notes()).toEqual([50,40,65,55]);
  })

  it('chords', () => {
    expect(pattern('123 234').pitches()).toEqual([1,2,3,2,3,4]);
  })

  it('cycles', () => {
    expect(cachedIterator('<1 <2 3>>').collect('pitch')).toEqual(1);
    expect(cachedIterator('<1 <2 3>>').collect('pitch')).toEqual(2);
    expect(cachedIterator('<1 <2 3>>').collect('pitch')).toEqual(1);
    expect(cachedIterator('<1 <2 3>>').collect('pitch')).toEqual(3);
  })

  it('randoms', () => {
    expect(pattern('? ? ? ?').pitches()).to.satisfy((pitches: number[]) => pitches.every(pitch => pitch >= 0 && pitch <= 7));
    expect(pattern('(1,4) (0,4) (2,4)').pitches()).to.satisfy((pitches: number[]) => pitches.every(pitch => pitch >= 0 && pitch <= 4));
    expect(pattern('(1,7)',{scale: '187. 356. 526. 672. 856. 985. 1222.', seed: "foo"}).pitches()).toEqual([4]);
    expect(pattern('(1,7)',{scale: '187. 356. 526. 672. 856. 985. 1222.', seed: "bar"}).pitches()).toEqual([3]);
  })

  it('cache', () => {
    // Clear earlier tests
    clear('1 2');
    clear('2 4 1',{key: "C"});
    clear('0');
    clear('1 4');

    expect(cachedIterator('1 2').collect('pitch')).toEqual(1);
    expect(cachedIterator('1 2').collect('pitch')).toEqual(2);
    expect(cachedIterator('1 2').collect('pitch')).toEqual(1);
    expect(get('2 4 1',{key: "C"}).collect('pitch')).toEqual(2);
    expect(get('2 4 1',{key: "C"}).collect('pitch')).toEqual(2);
    expect(get('2 4 1',{key: "C", index: 2}).collect('pitch')).toEqual(1);
    expect(cachedIterator('2 4 1', {key: "C"}).collect('pitch')).toEqual(4);
    expect(freq('0')).toEqual(261.6255653005986);
    expect(pitch('1 4')).toEqual(1);
    expect(pitch('1 4')).toEqual(4);
  })
})