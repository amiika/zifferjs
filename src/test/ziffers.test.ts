import { describe, expect, it } from 'vitest'
import { zparse, next, get, clear, pitch, freq, clearCache } from '../ziffers.ts'

describe('main-tests', () => {
  it('parse', () => {
    expect(zparse('1',{scale: "minor"}).values.length).toEqual(1);
    expect(zparse('12 3 4 5').values.length).toEqual(4);
    expect(1 + 1).toEqual(2);
    expect(true).to.be.true;
  })

  it('durations', () => {
    expect(zparse('e 1').values[0].duration).toEqual(0.125);
  })

  it('cache', () => {
    clearCache();
    expect(next('1 2').pitch).toEqual(1);
    expect(next('1 2').pitch).toEqual(2);
    expect(next('1 2').pitch).toEqual(1);
    expect(get('2 4 1',{key: "C"}).pitch).toEqual(2);
    expect(get('2 4 1',{key: "C"}).pitch).toEqual(4);
    expect(get('2 4 1',{key: "C"}).pitch).toEqual(1);
    expect(get('2 4 1',{key: "C"}).pitch).toEqual(2);
    expect(get('2 4 1',{key: "C", index: 2}).pitch).toEqual(1);
    expect(next('2 4 1',{key: "C"}).pitch).toEqual(2);
    expect(freq('0')).toEqual(261.6255653005986);
    expect(pitch('1 4')).toEqual(1);
    expect(pitch('1 4')).toEqual(4);
  })
})