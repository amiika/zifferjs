import { describe, expect, it } from 'vitest'
import { pattern } from '../ziffers.ts'

describe('tonnetz-tests', () => {

  it('tonnetzChords', () => {
    expect(pattern('0 1 2 3 4 5 6 7').tonnetzChords('M').notes()).toEqual([[60,64,67],[62,66,69],[64,68,71],[65,69,60],[67,71,62],[69,61,64],[71,63,66],[60,64,67]]);
    expect(pattern('0 1 2 3 4 5 6 7').tonnetzChords('m').notes()).toEqual([[60,63,67],[62,65,69],[64,67,71],[65,68,60],[67,70,62],[69,60,64],[71,62,66],[60,63,67]]);
    expect(pattern('0 1 2 3 4 5 6 7 8 9 {10 11}', {scale: "chromatic"}).tonnetzChords('M').notes()).toEqual([[60,64,67],[61,65,68],[62,66,69],[63,67,70],[64,68,71],[65,69,60],[66,70,61],[67,71,62],[68,60,63],[69,61,64],[70,62,65],[71,63,66]]);
});

});