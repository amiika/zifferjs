import { describe, expect, it } from 'vitest'
import { pattern } from '../ziffers.ts'
import { transform } from '../tonnetz.ts';

describe('tonnetz-tests', () => {

    it('tonnetzChords', () => {
        expect(pattern('0 1 2 3 4 5 6 7').tonnetzChords('M').notes()).toEqual([[60, 64, 67], [62, 66, 69], [64, 68, 71], [65, 69, 60], [67, 71, 62], [69, 61, 64], [71, 63, 66], [72, 76, 79]]);
        expect(pattern('0 1 2 3 4 5 6 7').tonnetzChords('m').notes()).toEqual([[60, 63, 67], [62, 65, 69], [64, 67, 71], [65, 68, 60], [67, 70, 62], [69, 60, 64], [71, 62, 66], [72, 75, 79]]);
        expect(pattern('0 1 2 3 4 5 6 7 8 9 {10 11}', { scale: "chromatic" }).tonnetzChords('M').notes()).toEqual([[60, 64, 67], [61, 65, 68], [62, 66, 69], [63, 67, 70], [64, 68, 71], [65, 69, 60], [66, 70, 61], [67, 71, 62], [68, 60, 63], [69, 61, 64], [70, 62, 65], [71, 63, 66]]);
    });

    it('tonnetzTransformation "p,r,l" and involutions to "normal form"', () => {
        expect(transform([0, 4, 7], "p")).toEqual([0, 3, 7]);
        expect(transform([0, 3, 7], "p")).toEqual([0, 4, 7]);
        expect(transform([0, 4, 7], "pp")).toEqual([0, 4, 7]);
        expect(transform([0, 3, 7], "pp")).toEqual([0, 3, 7]);
        expect(transform([0, 4, 7], "r")).toEqual([9, 0, 4]);
        expect(transform([0, 3, 7], "r")).toEqual([3, 7, 10]);
        expect(transform([0, 4, 7], "rr")).toEqual([0, 4, 7]);
        expect(transform([0, 3, 7], "rr")).toEqual([0, 3, 7]);
        expect(transform([0, 4, 7], "l")).toEqual([4, 7, 11]);
        expect(transform([0, 3, 7], "l")).toEqual([8, 0, 3]);
        expect(transform([0, 4, 7], "ll")).toEqual([0, 4, 7]);
        expect(transform([0, 3, 7], "ll")).toEqual([0, 3, 7]);
    });

    it('tonnetzTransformations "pr, pl, rp, lp" compositions to "normal form"', () => {
        expect(transform([0, 4, 7], "pr")).toEqual([3, 7, 10]);
        expect(transform([0, 3, 7], "pr")).toEqual([9, 0, 4]);
        expect(transform([0, 4, 7], "pl")).toEqual([8, 0, 3]);
        expect(transform([0, 3, 7], "pl")).toEqual([4, 7, 11]);
        expect(transform([0, 4, 7], "rp")).toEqual([9, 1, 4]);
        expect(transform([0, 3, 7], "rp")).toEqual([3, 6, 10]);
        expect(transform([0, 4, 7], "lp")).toEqual([4, 8, 11]);
        expect(transform([0, 3, 7], "lp")).toEqual([8, 11, 3]);
    })

    it('tonnetzTransformations "rl, lr" compositions to "normal form"', () => {
        expect(transform([0, 4, 7], "rl")).toEqual([5, 9, 0]);
        expect(transform([0, 3, 7], "rl")).toEqual([7, 10, 2]);
        expect(transform([0, 4, 7], "lr")).toEqual([7, 11, 2]);
        expect(transform([0, 3, 7], "lr")).toEqual([5, 8, 0]);
    })

    it('tonnetzTransformations "prl" compositions to "normal form"', () => {
        expect(transform([0, 4, 7], "prl")).toEqual([7, 10, 2]);
        expect(transform([0, 3, 7], "prl")).toEqual([5, 9, 0]);
        expect(transform([0, 4, 7], "lrp")).toEqual([7, 10, 2]);
        expect(transform([0, 3, 7], "lrp")).toEqual([5, 9, 0]);
        expect(transform([0, 4, 7], "plr")).toEqual([5, 8, 0]);
        expect(transform([0, 3, 7], "plr")).toEqual([7, 11, 2]);
        expect(transform([0, 4, 7], "rlp")).toEqual([5, 8, 0]);
        expect(transform([0, 3, 7], "rlp")).toEqual([7, 11, 2]);
        expect(transform([0, 4, 7], "rpl")).toEqual([1, 4, 8]);
        expect(transform([0, 3, 7], "rpl")).toEqual([11, 3, 6]);
        expect(transform([0, 4, 7], "lpr")).toEqual([1, 4, 8]);
        expect(transform([0, 3, 7], "lpr")).toEqual([11, 3, 6]);
    })

    it('tonnetzTransformations "hexaCycles and octaCycles" to "normal form"', () => {
        expect(transform([0, 4, 7], "plplpl")).toEqual([0, 4, 7]);
        expect(transform([0, 3, 7], "plplpl")).toEqual([0, 3, 7]);
        expect(transform([0, 4, 7], "prprprpr")).toEqual([0, 4, 7]);
        expect(transform([0, 3, 7], "prprprpr")).toEqual([0, 3, 7]);
    })

    it('tonnetzTransformations "complex" compositions to "normal form"', () => {
        expect(transform([0, 4, 7], "plprlplrl")).toEqual([2, 5, 9]);
        expect(transform([1, 5, 8], "plprlplrl")).toEqual([3, 6, 10]);
        expect(transform([2, 6, 9], "plprlplrl")).toEqual([4, 7, 11]);
        expect(transform([3, 7, 10], "plprlplrl")).toEqual([5, 8, 0]);
        expect(transform([4, 8, 11], "plprlplrl")).toEqual([6, 9, 1]);
        expect(transform([5, 9, 0], "plprlplrl")).toEqual([7, 10, 2]);
        expect(transform([6, 10, 1], "plprlplrl")).toEqual([8, 11, 3]);
        expect(transform([7, 11, 2], "plprlplrl")).toEqual([9, 0, 4]);
        expect(transform([8, 0, 3], "plprlplrl")).toEqual([10, 1, 5]);
        expect(transform([9, 1, 4], "plprlplrl")).toEqual([11, 2, 6]);
        expect(transform([10, 2, 5], "plprlplrl")).toEqual([0, 3, 7]);
        expect(transform([11, 3, 6], "plprlplrl")).toEqual([1, 4, 8]);

        expect(transform([0, 3, 7], "plprlplrl")).toEqual([10, 2, 5]);
        expect(transform([1, 4, 8], "plprlplrl")).toEqual([11, 3, 6]);
        expect(transform([2, 5, 9], "plprlplrl")).toEqual([0, 4, 7]);
        expect(transform([3, 6, 10], "plprlplrl")).toEqual([1, 5, 8]);
        expect(transform([4, 7, 11], "plprlplrl")).toEqual([2, 6, 9]);
        expect(transform([5, 8, 0], "plprlplrl")).toEqual([3, 7, 10]);
        expect(transform([6, 9, 1], "plprlplrl")).toEqual([4, 8, 11]);
        expect(transform([7, 10, 2], "plprlplrl")).toEqual([5, 9, 0]);
        expect(transform([8, 11, 3], "plprlplrl")).toEqual([6, 10, 1]);
        expect(transform([9, 0, 4], "plprlplrl")).toEqual([7, 11, 2]);
        expect(transform([10, 1, 5], "plprlplrl")).toEqual([8, 0, 3]);
        expect(transform([11, 2, 6], "plprlplrl")).toEqual([9, 1, 4]);
    })
});
