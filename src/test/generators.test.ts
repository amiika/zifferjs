import { describe, expect, it } from 'vitest'
import { Ziffers, collect } from '../ziffers';

function* collatz(n: number): Generator<number, void, void> {
    while (n !== 1) {
      yield n;
      if (n % 2 === 0) {
        n /= 2;
      } else {
        n = 3 * n + 1;
      }
    }
    yield 1;
  }


describe('generator-tests', () => {

  it('generators', () => {
    expect(collatz(106).next().value).toEqual(106);
    expect(collect(10,collatz,4)).toEqual([ 4, 2, 1, 4, 2, 1, 4, 2 ])
    let test = collatz(1);
    let ztest = Ziffers.fromGenerator(test);
    expect(ztest.input).toEqual("1");
  })

})