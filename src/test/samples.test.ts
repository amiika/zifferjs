import { describe, expect, it } from 'vitest'
import { pattern } from '../ziffers.ts'

describe('sounds-tests', () => {
    it('sample names', () => {
        expect(pattern('bd').sounds()).toEqual(["bd"]);
        expect(pattern('wt_foo bar foo_2 foo2').sounds()).toEqual(["wt_foo","bar", "foo_2", "foo2"]);
    })

    it('sound syntax', () => {
        expect(pattern('bd 4@bd bd:3 e3@bd bd!2').sounds()).toEqual(["bd","bd","bd","bd","bd","bd"]);
        expect(pattern('4@bd e bd:3 w3@bd 5@bd').durations()).toEqual([0.25,0.125,1.0,0.125]);
        expect(pattern('bd bd:0 bd:1 bd:2 bd:3 4@bd:2').indices()).toEqual([undefined,0,1,2,3,2]);
        expect(pattern('bd [hh hh]').durations()).toEqual([0.25,0.125,0.125]);
        expect(pattern('w [bd bd] [hh [hh hh]]').durations()).toEqual([0.5,0.5,0.5,0.25,0.25]);
        expect(pattern('w [bd bd] [hh [hh hh]]').sounds()).toEqual(["bd","bd","hh","hh","hh"]);
        expect(pattern('(1 2 3)@<bd hh>').sounds()).toEqual(["bd","hh","bd"]);
        expect(pattern('(1 2 3 4)@<bd <hh cp>>').sounds()).toEqual(["bd","hh","bd","cp"]);
        expect(pattern('[1 2 3]@<bd hh cp>').sounds()).toEqual(["bd","hh","cp"]);
        expect(pattern('(1 2 3)+(0 3)@<bd <hh cp>>').sounds()).toEqual(['hh','bd','cp','bd','hh','bd']);
        expect(pattern('<foo bar>').sounds()).toEqual(["foo"]);

        const cpat = pattern('bd <hh <cp hh>>');
        expect(cpat.next().sound).toEqual("bd");
        expect(cpat.next().sound).toEqual("hh");
        expect(cpat.next().sound).toEqual("bd");
        expect(cpat.next().sound).toEqual("cp");
        expect(cpat.next().sound).toEqual("bd");
        expect(cpat.next().sound).toEqual("hh");
        expect(cpat.next().sound).toEqual("bd");
        expect(cpat.next().sound).toEqual("hh");
    })

    it('sample subdivision', () => {
        let spat = pattern('[bd arp]');
        expect(spat.next().sound).toEqual("bd");
        expect(spat.next().sound).toEqual("arp");
        
        spat = pattern('[bd <hh <cp bd>>]');
        expect(spat.next().sound).toEqual("bd");
        expect(spat.next().sound).toEqual("hh");
        expect(spat.next().sound).toEqual("bd");
        expect(spat.next().sound).toEqual("cp");

        spat = pattern('cp [bd <hh <cp bd>>]');
        expect(spat.next().sound).toEqual("cp");
        expect(spat.next().sound).toEqual("bd");
        expect(spat.next().sound).toEqual("hh");
        expect(spat.next().sound).toEqual("cp");
        expect(spat.next().sound).toEqual("bd");
        expect(spat.next().sound).toEqual("cp");
        expect(spat.next().sound).toEqual("cp");
        expect(spat.next().sound).toEqual("bd");
        expect(spat.next().sound).toEqual("hh");
        expect(spat.next().sound).toEqual("cp");
        expect(spat.next().sound).toEqual("bd");
        expect(spat.next().sound).toEqual("bd");
    })

    it('indices syntax', ()=> {
        expect(pattern('1:3 2:4 3:2').indices()).toEqual([3,4,2]);
        expect(pattern('1:3 2:4!2 3:2').indices()).toEqual([3,4,4,2]);
        expect(pattern('(1 2 3):3').indices()).toEqual([3,3,3]);
        expect(pattern('<1 2 3>:3').indices()).toEqual([3]);
        expect(pattern('[1 [2 3]]:3').indices()).toEqual([3,3,3]);
        expect(pattern('[1 [2 3]]:<1 <4 2>>').indices()).toEqual([1,4,1]);

        const pat = pattern('[1 2]:<1 2 3>');
        expect(pat.next().soundIndex).toEqual(1);
        expect(pat.next().soundIndex).toEqual(2);
        expect(pat.next().soundIndex).toEqual(3);
        expect(pat.next().soundIndex).toEqual(1);
    })

})