import { describe, expect, it } from 'vitest'
import { SCALES, SCALE_NAMES, getScale } from '../defaults.ts'
import { getAllScaleNotes, getPrimes, midiToPitchClass, midiToTpc, nearScales, normalForm, numberToScale, safeScale, scaleToNumber, scaleToSteps, stepsToScale } from '../scale.ts'
import { parse as parseScale } from '../parser/scalaParser.ts'
import { pattern } from '../ziffers.ts'

const f = String.raw;

describe('scale-tests', () => {

  it('getters', () => {
    expect(getScale("chromatic")).toEqual([1,1,1,1,1,1,1,1,1,1,1,1]);
    expect(SCALES["MAJOR"]).toEqual([2,2,1,2,2,2,1]);
  })

  it('primes', () => {
    expect(getPrimes(2)).toEqual([2,3]);
    expect(getPrimes(5)).toEqual([2,3,5,7,11]);
  })

  it('parser', () => {
    // TODO: Better tests
    expect(parseScale("100.0 200.0 400.0 612.0")).toEqual([1,1,2,2.12]);
    expect(parseScale("9/8 5/4")).toEqual([2.0391000173077485,1.8240371213406]);
    expect(parseScale('[-1 1 0> [2 -1 0>')).toEqual([7.019550008653875,-2.0391000173077494]);
    expect(parseScale(f`5\29 9\29 14\29`)).toEqual([2.0689655172413803,1.6551724137931019,2.0689655172413794])
    expect(parseScale("9/8 32/27 4/3 3/2 5/3 16/9 2/1")).toEqual([2.0391000173077485,0.902249956730628,2.0391000173077485,2.0391000173077494,1.8240371213406001,1.1173128526977758,2.03910001730775,])
  })

  it('patterns', () => {
    expect(pattern("s (0 4 3 5)+(0 3)",{scale: '9/8 32/27 4/3 3/2 5/3 16/9 2/1'}).notes()).toEqual([60.0, 67.01955000865388, 64.98044999134612, 68.84358712999448, 64.98044999134612, 72.0, 69.96089998269225, 74.03910001730775])
  })

  it('evals', () => {
    expect(parseScale(`100.0 + 0.3
    200.0 + 12.43`)).toEqual([1,-0.97,1.97,-1.88,0.31]);
  })

  it('tpc', () => {
    expect(midiToTpc(60,"C4")).toEqual(14); 
    expect(midiToTpc(50,"D3")).toEqual(16); 
  })

  it('allScaleNotes', () => {
    // From 21 to 108
    expect(getAllScaleNotes("major", "C")).toEqual([21,23,24,26,28,29,31,33,35,36,38,40,41,43,45,47,48,50,52,53,55,57,59,60,62,64,65,67,69,71,72,74,76,77,79,81,83,84,86,88,89,91,93,95,96,98,100,101,103,105,107,108]) 
    expect(getAllScaleNotes("minor", "C")).toEqual([22, 24, 26, 27, 29, 31, 32, 34, 36, 38, 39, 41, 43, 44, 46, 48, 50, 51, 53, 55, 56, 58, 60, 62, 63, 65, 67, 68, 70, 72, 74, 75, 77, 79, 80, 82, 84, 86, 87, 89, 91, 92, 94, 96, 98, 99, 101, 103, 104, 106, 108])
    expect(getAllScaleNotes("minor pentatonic", "D")).toEqual([21, 24, 26, 29, 31, 33, 36, 38, 41, 43, 45, 48, 50, 53, 55, 57, 60, 62, 65, 67, 69, 72, 74, 77, 79, 81, 84, 86, 89, 91, 93, 96, 98, 101, 103, 105, 108])
    expect(getAllScaleNotes("dorian", "E")).toEqual([21, 23, 25, 26, 28, 30, 31, 33, 35, 37, 38, 40, 42, 43, 45, 47, 49, 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74, 76, 78, 79, 81, 83, 85, 86, 88, 90, 91, 93, 95, 97, 98, 100, 102, 103, 105, 107])
    expect(getAllScaleNotes("dorian", "C")).toEqual([21, 22, 24, 26, 27, 29, 31, 33, 34, 36, 38, 39, 41, 43, 45, 46, 48, 50, 51, 53, 55, 57, 58, 60, 62, 63, 65, 67, 69, 70, 72, 74, 75, 77, 79, 81, 82, 84, 86, 87, 89, 91, 93, 94, 96, 98, 99, 101, 103, 105, 106, 108])
  })

  it('normalForm', () => {
    expect(pattern("2647").notes()).toEqual([[64, 71, 67, 72]]);
    expect(normalForm(pattern("2647").notes()[0] as number[])).toEqual([72,64,67,71]);
    expect(normalForm((pattern("{11}723", {scale: "chromatic"}).pitches()[0]) as number[])).toEqual([11,2,3,7]);
  })

  it('numberToScale', () => {
    expect(scaleToSteps(numberToScale(2741))).toEqual(SCALES["MAJOR"]);
    expect(safeScale(2741)).toEqual(safeScale("major"));
    expect(numberToScale(349)).toEqual([0,2,3,4,6,8]);
    expect(scaleToNumber(numberToScale(349))).toEqual(349);
    expect(stepsToScale([3, 2, 2, 3, 2])).toEqual([0, 3, 5, 7, 10, 12]);
    expect(numberToScale(1193)).toEqual([0, 3, 5, 7, 10]);
    expect(scaleToNumber(stepsToScale([3, 2, 2, 3, 2]))).toEqual(1193);
    expect((SCALE_NAMES[scaleToNumber(stepsToScale([3, 2, 2, 3, 2])).toString()][0])).toEqual("Minor Pentatonic");
  })

  it('nearScales', () => {
    expect(nearScales(349)).toEqual([351, 345, 347, 341, 333, 365, 381, 285, 317, 413, 477, 93, 221, 605, 861, 1373, 2397]);
  })

  it('midiToPc', () => {
    expect(midiToPitchClass(60).pc).toEqual(0);
    expect(midiToPitchClass(60, "D4").pc).toEqual(5);
    expect(midiToPitchClass(3, "C4").pc).toEqual(2);
  })

})