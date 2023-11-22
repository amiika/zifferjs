import { describe, expect, it } from 'vitest'
import { pattern } from '../ziffers.ts'
import { boretzRegions, enneaCycles, explorativeSeventhsTransform, getAvailableSeventhsTransformations, hexaCycles, octaCycles, octaTower, octaTowerLeft, octaTowerRight, randomSeventhTransformation, seventhsTransform, transform, weitzmannRegions } from '../tonnetz.ts';

describe('tonnetz-tests', () => {

    it('tonnetzChords', () => {
        expect(pattern('0 1 2 3 4 5 6 7').tonnetzChords('M').notes()).toEqual([[60, 64, 67], [62, 66, 69], [64, 68, 71], [65, 69, 60], [67, 71, 62], [69, 61, 64], [71, 63, 66], [72, 76, 79]]);
        expect(pattern('0 1 2 3 4 5 6 7').tonnetzChords('m').notes()).toEqual([[60, 63, 67], [62, 65, 69], [64, 67, 71], [65, 68, 60], [67, 70, 62], [69, 60, 64], [71, 62, 66], [72, 75, 79]]);
        expect(pattern('0 1 2 3 4 5 6 7 8 9 {10 11}', { scale: "chromatic" }).tonnetzChords('M').notes()).toEqual([[60, 64, 67], [61, 65, 68], [62, 66, 69], [63, 67, 70], [64, 68, 71], [65, 69, 60], [66, 70, 61], [67, 71, 62], [68, 60, 63], [69, 61, 64], [70, 62, 65], [71, 63, 66]]);
    });

    it('triadTonnetz', () => {
        expect(pattern("i").triadTonnetz("p").notes()[0]).toEqual([60, 63, 67]);
        expect(pattern("024").triadTonnetz("p").notes()[0]).toEqual([60, 63, 67]);
        expect(pattern("024").triadTonnetz("plr").notes()[0]).toEqual([60, 65, 68]);
        expect(pattern("024 246").triadTonnetz("plr").notes()).toEqual([[60, 65, 68], [63, 66, 71]]);
        expect(pattern("i7").tonnetz("o p").notes()).toEqual([ [ 60, 64, 67, 70 ], [60,63,67,70] ]);
        expect(pattern("i i7").tonnetz("o").notes()).toEqual([ [ 60, 64, 67 ], [ 60, 64, 67, 70 ] ]);
        expect(pattern("i i7").tonnetz("p").notes()).toEqual([ [ 60, 63, 67 ], [ 60, 63, 67, 70 ] ]);
        expect(pattern("i i7").tonnetz("p2").notes()).toEqual([ [ 60, 63, 67 ], [ 60, 64, 67, 71 ] ]);
        expect(pattern("i i7").tonnetz("p3").notes()).toEqual([ [ 60, 63, 67 ], [ 60, 64, 68, 70 ] ]);
    });

    it('tetraTonnetz', () => {
        // expect(pattern("0246").tetraTonnetz("p").notes()[0]).toEqual([60, 64, 67, 71]); problem with RegExp
        // expect(pattern("0246").tetraTonnetz("plr").notes()[0]).toEqual([60, 64, 67, 71]);  problem with RegExp
        expect(pattern("i7").notes()[0]).toEqual([60, 64, 67, 70]);
        expect(pattern("i7").tetraTonnetz("p12l13r12").notes()[0]).toEqual([ 61, 63, 67, 70 ]);
        expect(pattern("vi7").tetraTonnetz("p12").notes()[0]).toEqual([60, 64, 67, 69 ]);
    });

    it('hexaCycle', () => {
        expect(pattern("0").hexaCycle().notes()).toEqual([[60, 67, 72], [60, 65, 72], [74, 60, 65], [74, 79, 65], [67, 74, 79], [67, 72, 79]]);
        expect(pattern("0").octaCycle().notes()).toEqual([[60, 67, 72], [60, 65, 72], [65, 72, 77], [65, 71, 77], [71, 77, 62], [71, 76, 62], [76, 62, 67], [76, 60, 67]]);
        expect(pattern("0").enneaCycle().notes()).toEqual([[60, 67, 72, 77], [60, 65, 72, 77], [60, 65, 71, 77], [74, 60, 65, 71], [74, 79, 65, 71], [74, 79, 64, 71], [67, 74, 79, 64], [67, 72, 79, 64], [67, 72, 77, 64]]);
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

    it('tonnetzTransformations "f" function to "normal form"', () => {
        expect(transform([0, 4, 7], "f")).toEqual([7, 10, 2]);
        expect(transform([0, 4, 7], "ff")).toEqual([0, 4, 7]);
        expect(transform([9, 0, 4], "f")).toEqual([2, 6, 9]);
        expect(transform([9, 0, 4], "ff")).toEqual([9, 0, 4]);

        expect(transform([2, 6, 9], "f")).toEqual([9, 0, 4]);
        expect(transform([2, 5, 9], "f")).toEqual([7, 11, 2]);
        expect(transform([10, 2, 5], "f")).toEqual([5, 8, 0]);
        expect(transform([5, 9, 0], "f")).toEqual([0, 3, 7]);
        expect(transform([4, 7, 11], "f")).toEqual([9, 1, 4]);
    })

    it('tonnetzTransformations "n" function to "normal form"', () => {
        expect(transform([0, 4, 7], "n")).toEqual([5, 8, 0]);
        expect(transform([0, 4, 7], "nn")).toEqual([0, 4, 7]);
        expect(transform([0, 3, 7], "n")).toEqual([7, 11, 2]);
        expect(transform([0, 3, 7], "nn")).toEqual([0, 3, 7]);

        expect(transform([7, 11, 2], "n")).toEqual([0, 3, 7]);
        expect(transform([9, 0, 4], "n")).toEqual([4, 8, 11]);
        expect(transform([5, 9, 0], "n")).toEqual([10, 1, 5]);
        expect(transform([2, 6, 9], "n")).toEqual([7, 10, 2]);
        expect(transform([2, 5, 9], "n")).toEqual([9, 1, 4]);
    })

    it('tonnetzTransformations "s" function to "normal form"', () => {
        expect(transform([0, 4, 7], "s")).toEqual([1, 4, 8]);
        expect(transform([0, 4, 7], "ss")).toEqual([0, 4, 7]);
        expect(transform([0, 3, 7], "s")).toEqual([11, 3, 6]);
        expect(transform([0, 3, 7], "ss")).toEqual([0, 3, 7]);

        expect(transform([7, 11, 2], "s")).toEqual([8, 11, 3]);
        expect(transform([9, 0, 4], "s")).toEqual([8, 0, 3]);
        expect(transform([5, 9, 0], "s")).toEqual([6, 9, 1]);
        expect(transform([2, 6, 9], "s")).toEqual([3, 6, 10]);
        expect(transform([2, 5, 9], "s")).toEqual([1, 5, 8]);
    })

    it('tonnetzTransformations "h" function to "normal form"', () => {
        expect(transform([0, 4, 7], "h")).toEqual([8, 11, 3]);
        expect(transform([0, 4, 7], "hh")).toEqual([0, 4, 7]);
        expect(transform([0, 3, 7], "h")).toEqual([4, 8, 11]);
        expect(transform([0, 3, 7], "hh")).toEqual([0, 3, 7]);

        expect(transform([7, 11, 2], "h")).toEqual([3, 6, 10]);
        expect(transform([9, 0, 4], "h")).toEqual([1, 5, 8]);
        expect(transform([5, 9, 0], "h")).toEqual([1, 4, 8]);
        expect(transform([2, 6, 9], "h")).toEqual([10, 1, 5]);
        expect(transform([2, 5, 9], "h")).toEqual([6, 10, 1]);
    })

    it('tonnetzTransformations "t" function to "normal form"', () => {
        expect(transform([0, 4, 7], "t")).toEqual([6, 10, 1]);
        expect(transform([0, 4, 7], "tt")).toEqual([0, 4, 7]);
        expect(transform([0, 3, 7], "t")).toEqual([6, 9, 1]);
        expect(transform([0, 3, 7], "tt")).toEqual([0, 3, 7]);

        expect(transform([7, 11, 2], "t")).toEqual([1, 5, 8]);
        expect(transform([9, 0, 4], "t")).toEqual([3, 6, 10]);
        expect(transform([5, 9, 0], "t")).toEqual([11, 3, 6]);
        expect(transform([2, 6, 9], "t")).toEqual([8, 0, 3]);
        expect(transform([2, 5, 9], "t")).toEqual([8, 11, 3]);
    })

    it('tonnetzTransformations "pt6, lt6, rt6" function to "normal form"', () => {
        expect(transform([0, 4, 7], "pt")).toEqual([6, 9, 1]);
        expect(transform([0, 4, 7], "lt")).toEqual([10, 1, 5]);
        expect(transform([0, 4, 7], "rt")).toEqual([3, 6, 10]);

        expect(transform([0, 3, 7], "pt")).toEqual([6, 10, 1]);
        expect(transform([0, 3, 7], "lt")).toEqual([2, 6, 9]);
        expect(transform([0, 3, 7], "rt")).toEqual([9, 1, 4]);
    })

    it('tonnetzTransformations "compositions" function to "normal form"', () => {
        expect(transform([0, 4, 7], "hsf")).toEqual([2, 5, 9]);
        expect(transform([0, 3, 7], "hsf")).toEqual([10, 2, 5]);
        expect(transform([0, 4, 7], "hsftn")).toEqual([3, 7, 10]);
        expect(transform([0, 3, 7], "hsftn")).toEqual([9, 0, 4]);

        expect(transform([0, 4, 7], "hsftnprpl")).toEqual([2, 6, 9]);
        expect(transform([0, 3, 7], "hsftnprpl")).toEqual([10, 1, 5]);
    })

    it('HexaCycles', () => {
        expect(hexaCycles(0, [3, 4, 5])).toEqual([
            [0, 4, 7], [0, 3, 7],
            [8, 0, 3], [8, 11, 3],
            [4, 8, 11], [4, 7, 11]
        ]);
        expect(hexaCycles(9, [3, 4, 5])).toEqual([
            [9, 1, 4], [9, 0, 4],
            [5, 9, 0], [5, 8, 0],
            [1, 5, 8], [1, 4, 8]
        ]);
    });

    it('OctaCycles', () => {
        expect(octaCycles(2, [3, 4, 5])).toEqual([
            [2, 6, 9], [2, 5, 9],
            [5, 9, 0], [5, 8, 0],
            [8, 0, 3], [8, 11, 3],
            [11, 3, 6], [11, 2, 6]
        ]);
        expect(octaCycles(0, [3, 4, 5])).toEqual([
            [0, 4, 7], [0, 3, 7],
            [3, 7, 10], [3, 6, 10],
            [6, 10, 1], [6, 9, 1],
            [9, 1, 4], [9, 0, 4]
        ]);
    });

    it('EnneaCycles', () => {
        expect(enneaCycles(0, [3, 4, 5])).toEqual([
            [0, 4, 7, 10], [0, 3, 7, 10], [0, 3, 6, 10],
            [8, 0, 3, 6], [8, 11, 3, 6], [8, 11, 2, 6],
            [4, 8, 11, 2], [4, 7, 11, 2], [4, 7, 10, 2]
        ]);
        expect(enneaCycles(9, [3, 4, 5])).toEqual([
            [9, 1, 4, 7], [9, 0, 4, 7], [9, 0, 3, 7],
            [5, 9, 0, 3], [5, 8, 0, 3], [5, 8, 11, 3],
            [1, 5, 8, 11], [1, 4, 8, 11], [1, 4, 7, 11]
        ]);
    });

    it('seventhTransformations to normal form. Returns the same chord if the transformation is not supported.', () => {
        expect(pattern("i7", { scale: "CHROMATIC" }).pitches()).toEqual([[0, 4, 7, 10]]);

        expect(seventhsTransform([0, 4, 7, 10], "p12")).toEqual([0, 3, 7, 10])
        expect(seventhsTransform([0, 4, 7, 10], "p14")).toEqual([0, 4, 7, 11])
        expect(seventhsTransform([0, 4, 7, 10], "r12")).toEqual([9, 0, 4, 7])
        expect(seventhsTransform([0, 4, 7, 10], "l13")).toEqual([4, 7, 10, 2])
        expect(seventhsTransform([0, 4, 7, 10], "l15")).toEqual([4, 7, 10, 1])
        expect(seventhsTransform([0, 4, 7, 10], "q15")).toEqual([1, 4, 7, 10])

        expect(seventhsTransform([0, 4, 7, 10], "l42")).toEqual([0, 4, 7, 10])
        expect(seventhsTransform([0, 3, 7, 10], "q43")).toEqual([0, 3, 7, 10])
        expect(seventhsTransform([0, 4, 7, 11], "rr35")).toEqual([0, 4, 7, 11])
        expect(seventhsTransform([0, 3, 6, 9], "l42")).toEqual([0, 3, 6, 9])
        expect(seventhsTransform([0, 3, 6, 10], "qq51")).toEqual([0, 3, 6, 10])
        expect(seventhsTransform([0, 4, 7, 10], "p35")).toEqual([0, 4, 7, 10])

        expect(seventhsTransform([0, 4, 7, 10], "p14r42")).toEqual([9, 0, 4, 7])
        expect(seventhsTransform([0, 4, 7, 10], "p14r42l42")).toEqual([5, 9, 0, 4])
        expect(seventhsTransform([0, 4, 7, 10], "p14r42l42q43")).toEqual([6, 9, 0, 4])
        expect(seventhsTransform([0, 4, 7, 10], "p14r42l42q43rr35")).toEqual([0, 3, 6, 9])
        expect(seventhsTransform([0, 4, 7, 10], "p14r42l42q43rr35qq51")).toEqual([2, 6, 9, 0])
        expect(seventhsTransform([0, 4, 7, 10], "p14r42l42q43rr35qq51l15")).toEqual([6, 9, 0, 3])
        expect(seventhsTransform([0, 4, 7, 10], "p14r42l42q43rr35qq51l15n51")).toEqual([11, 3, 6, 9])
        expect(seventhsTransform([0, 4, 7, 10], "p14r42l42q43rr35qq51l15n51l13")).toEqual([3, 6, 9, 1])
        expect(seventhsTransform([0, 4, 7, 10], "p14r42l42q43rr35qq51l15n51l13r23")).toEqual([6, 9, 1, 4])


        expect(seventhsTransform([0, 4, 7, 10], "p18")).toEqual([0, 4, 8, 10])
        expect(seventhsTransform([0, 4, 8, 10], "p18")).toEqual([0, 4, 7, 10])
        expect(seventhsTransform([0, 4, 7, 10], "p19")).toEqual([0, 4, 6, 10])
        expect(seventhsTransform([0, 4, 6, 10], "p19")).toEqual([0, 4, 7, 10])
        expect(seventhsTransform([0, 3, 7, 10], "p26")).toEqual([0, 3, 7, 11])
        expect(seventhsTransform([0, 3, 7, 11], "p26")).toEqual([0, 3, 7, 10])
        expect(seventhsTransform([0, 3, 6, 10], "p39")).toEqual([0, 4, 6, 10])
        expect(seventhsTransform([0, 4, 6, 10], "p39")).toEqual([0, 3, 6, 10])
        expect(seventhsTransform([0, 4, 7, 11], "p47")).toEqual([0, 4, 8, 11])
        expect(seventhsTransform([0, 4, 8, 11], "p47")).toEqual([0, 4, 7, 11])
        expect(seventhsTransform([0, 3, 7, 11], "p64")).toEqual([0, 4, 7, 11])
        expect(seventhsTransform([0, 4, 7, 11], "p64")).toEqual([0, 3, 7, 11])
        expect(seventhsTransform([0, 4, 8, 10], "p87")).toEqual([0, 4, 8, 11])
        expect(seventhsTransform([0, 4, 8, 11], "p87")).toEqual([0, 4, 8, 10])
        expect(seventhsTransform([0, 4, 6, 10], "p98")).toEqual([0, 4, 8, 10])
        expect(seventhsTransform([0, 4, 8, 10], "p98")).toEqual([0, 4, 6, 10])

        expect(seventhsTransform([0, 3, 7, 11], "r63")).toEqual([9, 0, 3, 7])
        expect(seventhsTransform([9, 0, 3, 7], "r63")).toEqual([0, 3, 7, 11])
        expect(seventhsTransform([0, 4, 8, 11], "r76")).toEqual([9, 0, 4, 8])
        expect(seventhsTransform([9, 0, 4, 8], "r76")).toEqual([0, 4, 8, 11])
        expect(seventhsTransform([0, 4, 8, 10], "r86")).toEqual([9, 0, 4, 8])
        expect(seventhsTransform([9, 0, 4, 8], "r86")).toEqual([0, 4, 8, 10])

        expect(seventhsTransform([0, 4, 8, 11], "l71")).toEqual([4, 8, 11, 2])
        expect(seventhsTransform([4, 8, 11, 2], "l71")).toEqual([0, 4, 8, 11])
        expect(seventhsTransform([0, 4, 8, 10], "l89")).toEqual([4, 8, 10, 2])
        expect(seventhsTransform([4, 8, 10, 2], "l89")).toEqual([0, 4, 8, 10])

        expect(seventhsTransform([0, 4, 8, 11], "q62")).toEqual([1, 4, 8, 11])
        expect(seventhsTransform([1, 4, 8, 11], "q62")).toEqual([0, 4, 8, 11])
        expect(seventhsTransform([0, 4, 8, 11], "q76")).toEqual([1, 4, 8, 0])
        expect(seventhsTransform([1, 4, 8, 0], "q76")).toEqual([0, 4, 8, 11])

        expect(seventhsTransform([0, 4, 7, 10], "rr19")).toEqual([6, 10, 0, 4])
        expect(seventhsTransform([6, 10, 0, 4], "rr19")).toEqual([0, 4, 7, 10])
        expect(seventhsTransform([0, 4, 6, 10], "rr98")).toEqual([6, 10, 2, 4])
        expect(seventhsTransform([6, 10, 2, 4], "rr98")).toEqual([0, 4, 6, 10])

        expect(seventhsTransform([0, 3, 6, 10], "qq38")).toEqual([2, 6, 10, 0])
        expect(seventhsTransform([2, 6, 10, 0], "qq38")).toEqual([0, 3, 6, 10])
        expect(seventhsTransform([0, 4, 6, 10], "qq98")).toEqual([2, 6, 10, 0])
        expect(seventhsTransform([2, 6, 10, 0], "qq98")).toEqual([0, 4, 6, 10])
    })

    it('octaTower', () => {
        expect(octaTower(0)).toEqual([
            [0, 3, 6, 10], [0, 3, 7, 10], [3, 7, 10, 1],
            [9, 0, 3, 7], [9, 0, 4, 7], [0, 4, 7, 10],
            [6, 9, 0, 4], [6, 9, 1, 4], [9, 1, 4, 7],
            [3, 6, 9, 1], [3, 6, 10, 1], [6, 10, 1, 4]
        ]);
        expect(octaTower(2)).toEqual([
            [2, 5, 8, 0], [2, 5, 9, 0], [5, 9, 0, 3],
            [11, 2, 5, 9], [11, 2, 6, 9], [2, 6, 9, 0],
            [8, 11, 2, 6], [8, 11, 3, 6], [11, 3, 6, 9],
            [5, 8, 11, 3], [5, 8, 0, 3], [8, 0, 3, 6]
        ]);
    })

    it('octaTowers left and right', () => {
        expect(octaTowerLeft(0)).toEqual([
            [0, 3, 6, 10], [0, 3, 7, 10], [0, 4, 7, 10],
            [9, 0, 3, 7], [9, 0, 4, 7], [9, 1, 4, 7],
            [6, 9, 0, 4], [6, 9, 1, 4], [6, 10, 1, 4],
            [3, 6, 9, 1], [3, 6, 10, 1], [3, 7, 10, 1]
        ]);
        expect(octaTowerLeft(2)).toEqual([
            [2, 5, 8, 0], [2, 5, 9, 0], [2, 6, 9, 0],
            [11, 2, 5, 9], [11, 2, 6, 9], [11, 3, 6, 9],
            [8, 11, 2, 6], [8, 11, 3, 6], [8, 0, 3, 6],
            [5, 8, 11, 3], [5, 8, 0, 3], [5, 9, 0, 3]
        ]);
        expect(octaTowerRight(0)).toEqual([
            [0, 4, 7, 10], [0, 3, 7, 10], [0, 3, 6, 10],
            [9, 1, 4, 7], [9, 0, 4, 7], [9, 0, 3, 7],
            [6, 10, 1, 4], [6, 9, 1, 4], [6, 9, 0, 4],
            [3, 7, 10, 1], [3, 6, 10, 1], [3, 6, 9, 1]
        ]);
        expect(octaTowerRight(2)).toEqual([
            [2, 6, 9, 0], [2, 5, 9, 0], [2, 5, 8, 0],
            [11, 3, 6, 9], [11, 2, 6, 9], [11, 2, 5, 9],
            [8, 0, 3, 6], [8, 11, 3, 6], [8, 11, 2, 6],
            [5, 9, 0, 3], [5, 8, 0, 3], [5, 8, 11, 3]
        ]);
    })

    it('Weitzmann Regions', () => {
        expect(weitzmannRegions(0)).toEqual([
            [0, 4, 8],
            [1, 4, 8], [5, 8, 0], [9, 0, 4],
            [0, 4, 7], [8, 0, 3], [4, 8, 11]
        ]);
        expect(weitzmannRegions(2)).toEqual([
            [2, 6, 10],
            [3, 6, 10], [7, 10, 2], [11, 2, 6],
            [2, 6, 9], [10, 2, 5], [6, 10, 1]
        ]);
    });

    it('Boretz Regions', () => {
        expect(boretzRegions(0)).toEqual([
            [0, 3, 6, 9], [11, 3, 6, 9], [3, 6, 9, 1],
            [2, 6, 9, 0], [6, 9, 0, 4], [5, 9, 0, 3],
            [9, 0, 3, 7], [8, 0, 3, 6], [0, 3, 6, 10]
        ]);

        expect(boretzRegions(2)).toEqual([
            [2, 5, 8, 11], [1, 5, 8, 11], [5, 8, 11, 3],
            [4, 8, 11, 2], [8, 11, 2, 6], [7, 11, 2, 5],
            [11, 2, 5, 9], [10, 2, 5, 8], [2, 5, 8, 0]
        ]);
    });

    it('Random transformtion', () => {
        expect(randomSeventhTransformation([0, 4, 7, 10])).toEqual(expect.arrayContaining([expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number)]));
    });

    it('Get available transformations', () => {
        expect(getAvailableSeventhsTransformations([0, 4, 7, 10])["l"]).toEqual(expect.arrayContaining(["l13","l15","l71"]));
        expect(getAvailableSeventhsTransformations([ 4, 7, 10, 2 ])["l"]).toEqual(expect.arrayContaining(["l13"]));
    })

    it('Explorative seventh transforms', () => {
        expect(explorativeSeventhsTransform([0, 4, 7, 10], "l")).toEqual([4, 7, 10, 2]);
        expect(explorativeSeventhsTransform([0, 4, 7, 10], "ll")).toEqual([0, 4, 7, 10]);
        expect(explorativeSeventhsTransform([0, 4, 7, 10], "lp")).toEqual([ 4, 7, 11, 2 ]);
        expect(explorativeSeventhsTransform([0, 4, 7, 10], "lpr")).toEqual([ 7, 11, 2, 5 ]);
        expect(explorativeSeventhsTransform([0, 4, 7, 10], "lpr2")).toEqual([ 1, 4, 7, 11 ]);
        expect(explorativeSeventhsTransform([0, 4, 7, 10], "p")).toEqual([0, 3, 7, 10]);
        expect(explorativeSeventhsTransform([0, 4, 7, 10], "pr")).toEqual([ 3, 7, 10, 1 ]);
        expect(explorativeSeventhsTransform([0, 4, 7, 10], "prl")).toEqual([ 7, 10, 1, 5 ]);
    })

});
