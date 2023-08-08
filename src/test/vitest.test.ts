import { assert, describe, expect, it } from 'vitest'
import { zparse } from '../ziffers.ts'

describe('main-tests', () => {
  it('parse', () => {
    expect(zparse('1',{scale: "minor"}).values.length).toEqual(1);
    expect(zparse('12 3 4 5').values.length).toEqual(4);
    expect(1 + 1).toEqual(2);
    expect(true).to.be.true;
  })

  it('durations', () => {
    expect(zparse('e 1').values[0].duration).toEqual(0.125);
    //assert.equal(Math.sqrt(4), 2)
  })

  it('snapshot', () => {
    expect({ foo: 'bar' }).toMatchSnapshot()
  })

  it('print', () => {
    const list = [
      '1 2 3',
      '0.3 ((1):2):2 q4:5 q1 (1 2(3 4)):2']
    list.forEach((z) => {
      console.log(zparse(z,{}));
    })
  })
})