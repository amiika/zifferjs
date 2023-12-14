import { describe, expect, it } from 'vitest'
import { pattern } from '../ziffers.ts'
import { Pitch } from '../types.ts';

describe('main-tests', () => {
  it('parse', () => {
    expect(pattern('1',{scale: "minor"}).values.length).toEqual(1);
    expect(pattern('12 3 4 5').values.length).toEqual(4);
    expect(1 + 1).toEqual(2);
    expect(true).to.be.true;
  })

  it('octaves', () => {
    expect(pattern('0 ^ 0').octaves()).toEqual([0,1]);
    expect(pattern('0 _ 0').octaves()).toEqual([0,-1]);
    expect(pattern('0 _ ^0').octaves()).toEqual([0,0]);
    expect(pattern('0 ^ _0').octaves()).toEqual([0,0]);
    expect(pattern('0 ^ _0').octaves()).toEqual([0,0]);
    expect(pattern('0 ^^ _0').octaves()).toEqual([0,1]);
    expect(pattern('0 _ ^^0').octaves()).toEqual([0,1]);
    expect(pattern('0 ^0').octaves()).toEqual([0,1]);
    expect(pattern('0 _0').octaves()).toEqual([0,-1]);
    expect(pattern('0 7').octaves()).toEqual([0,1]);
    const pat = pattern('^ 2');
    pat.next(); pat.next(); pat.next(); pat.next();
    expect((pat.next() as Pitch).octave).toEqual(1);
  })

  it('repeats', () => {
    expect(pattern('1 2!2 3!3 4').pitches()).toEqual([1,2,2,3,3,3,4]);
    expect(pattern('^ 4!4').octaves()).toEqual([1,1,1,1]);
  })

  it('durations', () => {
    expect(pattern('e 1').durations()[0]).toEqual(0.125);
    expect(pattern('q 3 e3 5').durations()).toEqual([0.25,0.125,0.25]);
    expect(pattern('0.25 3 0.125 3 0.25 5').durations()).toEqual([0.25,0.125,0.25]);
    expect(pattern('1/4 4 2/4 3 1/16 9 1/32 4').durations()).toEqual([0.25,0.5,0.0625,0.03125]);
    expect(pattern('q. 0 0 | q0 e1 q.2 | q2 e1 q2 e3 | h.4 | e 7 7 7 4 4 4 2 2 2 0 0 0 | q4 e3 q2 e1 | h. 0').durations()).toEqual([0.375, 0.375, 0.25, 0.125, 0.375, 0.25, 0.125, 0.25, 0.125, 0.75, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.25, 0.125, 0.25, 0.125, 0.75])
  })

  it('lists', () => {
    expect(pattern('(0 4 3 5)+(e0 3)').pitches()).toEqual([0, 4, 3, 5, 3, 0, 6, 1]);
    expect(pattern('(0 4 3 5)+(e0 3)').octaves()).toEqual([0, 0, 0, 0, 0, 1, 0, 1]);
    expect(pattern('(0 1 2 3)*2').pitches()).toEqual([0,2,4,6]);
    expect(pattern('((1)+1 0)+1').pitches()).toEqual([3,1]);
    expect(pattern('((1 2 3)+4)').pitches()).toEqual([5,6,0]);
    expect(pattern('(2 4)%(5 6)').pitches()).toEqual([2,4,2,4]);
    expect(pattern('(2 4)-(1 2)').pitches()).toEqual([1,3,0,2]);
  })

  it('loops', () => {
   // expect(pattern('(: 1 2 3 :)').pitches()).toEqual([1,2,3,1,2,3]);
   // expect(pattern("2 0 3 1").evaluated.map((e) => e.getExisting("pitch"))).toEqual([2,0,3,1]);
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
    //expect(pattern('? ? ? ?').pitches()).to.satisfy((pitches: number[]) => pitches.every(pitch => pitch >= 0 && pitch <= 7));
    //expect(pattern('(1,4) (0,4) (2,4)').pitches()).to.satisfy((pitches: number[]) => pitches.every(pitch => pitch >= 0 && pitch <= 4));
    expect(pattern('(1,7)',{scale: '187. 356. 526. 672. 856. 985. 1222.', seed: "foo"}).pitches()).toEqual([2]);
    expect(pattern('(1,7) (1,7)',{scale: '187. 356. 526. 672. 856. 985. 1222.', seed: "foo"}).pitches()).toEqual([2,3]);
    expect(pattern('(1,7) (1,7) (1,7) (1,7) (1,7)',{scale: '187. 356. 526. 672. 856. 985. 1222.', seed: "foo"}).pitches()).toEqual([2,3,3,2,5]);
})

  it('rests', () => {
    expect(pattern('e^r 1/4^r 0.25^r').durations()).toEqual([0.125,0.25,0.25]);
    expect(pattern('0 r 3 e 4 r').durations()).toEqual([0.25,0.25,0.25,0.125,0.125]);
  })

  it('subdivisions', () => {
    expect(pattern('[1 [2 3]]').pitches()).toEqual([1,2,3]);
    expect(pattern('[1 [2 3]]').durations()).toEqual([0.125,0.0625,0.0625]);
    expect(pattern('[1 [2 (3 4)+(3 6)]]').durations()).toEqual([0.125,0.025,0.025,0.025,0.025,0.025]);
    expect(pattern('q [0 3] 4 5 3 2').durations()).toEqual([0.125,0.125,0.25,0.25,0.25, 0.25]);
    expect(pattern('q [0 3] 4 [4 5] 5 3 2').durations()).toEqual([0.125,0.125,0.25,0.125,0.125,0.25,0.25,0.25]);
    expect(pattern('h 1 [0 2 3 3] 1 w 3 [0 3] w [0 [2 4]] d 3 [0 [1 2]]').durations()).toEqual([0.5,0.125,0.125,0.125,0.125,0.5,1,0.5,0.5,0.5,0.25,0.25,2,1,0.5,0.5]);
    expect(pattern('1.0 ^ [0 0] 2 2 [4 4]').octaves()).toEqual([1,1,1,1,1,1])
    // Subdivision octave test
    const pat = pattern('1.0 ^ [0 0] 2');
    pat.next(); pat.next(); pat.next(); pat.next();
    const pitch = (pat.next() as Pitch)
    if(pitch) {
      expect(pitch.octave).toEqual(1);
    }
  })

  it('randomtests', () => {
    const a = pattern('q 1');
    expect(a.next().duration).toEqual(0.25);
  })

  it('toString', () => {
    expect(pattern('1 2 3 4').toString()).toEqual('1 2 3 4');
    expect(pattern('1  2 3 4').toString()).toEqual('1 2 3 4');
  })

  it('variables', () => {
   expect(pattern('A=(1 2 3) A A').pitches()).toEqual([1,2,3,1,2,3])
    // A-G are notenames by default
   expect(pattern('A=(1 2 3) A A B C').pitches()).toEqual([1,2,3,1,2,3,6,0])
   expect(pattern("A=(0 2 1) A+1").pitches()).toEqual([1,3,2])
   expect(pattern("A=(0 2 1) B=(1 2 3) B+A").pitches()).toEqual([ 1, 2, 3, 3, 4, 5, 2, 3, 4 ])
   expect(pattern("A=(0 2) B=(1 A 3) B").pitches()).toEqual([1, 0, 2, 3])
   // All values in the list should be the same value using allEqual
   expect(pattern("A=((1,5)) A A A A").pitches()).toSatisfy((pitches: number[]) => pitches.every(pitch => pitch === pitches[0]));
   expect(pattern("A~((1,5)) A A A A").pitches()).toSatisfy((pitches: number[]) => !pitches.every(pitch => pitch === pitches[0]));
  })


})