import { describe, expect, it } from 'vitest'
import { stringRewrite, rsystem  } from '../rules.ts'
import { pattern } from '../ziffers.ts'

describe('transform-tests', () => {

  it('rsystem', () => {
    expect(stringRewrite("1 2 3",{1: 2})).toEqual("2 2 3")
    expect(stringRewrite("1 4 1 5",{1: 3, 2: 5})).toEqual("3 4 3 5")
    expect(stringRewrite("1 4 2 5",{"[1-2]": 2, 2: 8})).toEqual("2 4 2 5")
    expect(rsystem("1",{"[1-9]": a=>a+a},6)).toEqual("424")
    expect(rsystem("0 1 2", {"[0-9]*": (a)=>a+a+2}, 2)).toEqual("462 862 1262")
    expect(rsystem("0 1 2 3", {"[0-9]*": (a)=>a+a}, 4)).toEqual("0 16 32 48")
    expect(rsystem("1 1 2 3", {"(1) (1)": (a,b)=>a+b}, 1)).toEqual("2 2 3")
    expect(rsystem("1 1 2 3", {"(1) (1) (2)": (a,b,c)=>`${a+b} ${c-1}`}, 1)).toEqual("2 1 3")
    expect(pattern("0 1 2 3").rules({"[0-3]": (a)=>a+a}).toString()).toEqual("0 2 4 6")
    expect(pattern("0 1 2 3").rules({"[0-9]": (a)=>a+a}, 3).toString()).toEqual("0 8 16 24") 
  })

})