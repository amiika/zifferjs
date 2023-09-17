import { describe, expect, it } from 'vitest'
import { chord, midiToPitchClass, tMatrix, voiceLead} from '../scale.ts'
import { pattern } from '../ziffers.ts';

describe('chord-tests', () => {

  it('chords', () => {
    expect(chord('Cmaj')).toEqual([60,64,67]);
    expect(chord('Dmaj')).toEqual([62,66,69]);
    expect(chord('Cmin')).toEqual([60,63,67]);
    expect(chord('Caug')).toEqual([60,64,68]);
    expect(chord('EaugMaj7')).toEqual([64,68,72,75]);
  })

  it('supportive', () => {
    expect(midiToPitchClass(60)).toEqual({pc: 0, octave: 0, text: "0", add: 0});
    expect(midiToPitchClass(50,50)).toEqual({pc: 0, octave: 0, text: "0", add: 0});
    expect(midiToPitchClass(58,70)).toEqual({pc: 0, octave: -1, text: "_0", add: 0});
    expect(midiToPitchClass(59)).toEqual({pc: 6, octave: -1, text: "_6", add: 0});
  })

  it('romans', () => {
    expect(pattern('i ii iii iv v vi vii').notes()).toEqual([[60, 64, 67], [62, 65, 69], [64, 67, 71], [65, 69, 72], [67, 71, 74], [69, 72, 76], [71, 74, 77]]);
    expect(pattern('i ii iii iv v vi vii',{key: "D3"}).notes()).toEqual([[50, 54, 57], [52, 55, 59], [54, 57, 61], [55, 59, 62], [57, 61, 64], [59, 62, 66], [61, 64, 67]]);
    expect(pattern('i', {key: "D3"}).pitches()).toEqual([[0,2,4]]);
    expect(pattern('ii 0').update().notes()).toEqual([[62,65,69], 60]);
    expect(pattern('imin').update().notes()).toEqual([[60,63,67]]);
    expect(pattern('i^min').update().notes()).toEqual([[60,63,67]]);
  })

  it('chords', () => {
    expect(pattern('123 234').pitches()).toEqual([[1,2,3],[2,3,4]]);
  })

  it('namedChords', () => {
    expect(pattern('Cmaj').notes()).toEqual([[60,64,67]]);
    expect(pattern('Cmaj').pitches()).toEqual([[0,2,4]]);
    expect(pattern('Cmaj', {scale: "CHROMATIC"}).pitches()).toEqual([[0,4,7]]);
    expect(pattern('Cmaj Cmin D7 Edim').pitches()).toEqual([[0,2,4],[0,2,4],[0,2,4,5],[0,1,3]]);
    expect(pattern('Cmaj Cmin D7 Edim').notes()).toEqual([[60, 64, 67],[60, 63, 67],[62, 66, 69, 72],[64, 67, 70]]);
    expect(pattern('Cmaj Cmin').notes()).toEqual([[60,64,67],[60,63,67]]);
  })

  it('notes', () => {
    expect(pattern('C D E F G A B').notes()).toEqual([ 60, 62, 64, 65, 67, 69, 71 ]);
    expect(pattern('(C B)+(D F)').notes()).toEqual([ 62, 72, 65, 76 ]);
    expect(pattern('C e F F qE F').durations()).toEqual([ 0.25, 0.125, 0.125, 0.25, 0.125 ]);
  })

  it('inversions', () => {
    expect(pattern('i i%1').notes()).toEqual([[60,64,67],[72,64,67]]);
    expect(pattern('024 024%1').notes()).toEqual([[60,64,67],[72,64,67]]);
    expect(pattern('Cmaj Cmaj%1').notes()).toEqual([[60,64,67],[72,64,67]]);

    expect(pattern('i i%-1').notes()).toEqual([[60,64,67],[55,64,60]]);
    expect(pattern('024 024%-1').notes()).toEqual([[60,64,67],[55,64,60]]);
    expect(pattern('Cmaj Cmaj%-1').notes()).toEqual([[60,64,67],[55,64,60]]);
  })

  it('voiceLeading', () => {
    expect(voiceLead([60,64,67],[67,71,74])).toEqual([62,67,71]);
    expect(tMatrix([60,64,67],[67,71,74])).toEqual([2,3,4]);
    expect(pattern('i v vi').notes()).toEqual([[60,64,67],[67,71,74],[69,72,76]]);
    expect(pattern('i v vi').lead().notes()).toEqual([[60,64,67],[62,67,71],[60,64,69]]);
    expect(pattern('i v7 vi').lead().notes()).toEqual([[60,64,67],[62,65,67,77],[60,64,67]]);
  })

})