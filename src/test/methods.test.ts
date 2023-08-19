// @ts-nocheck
import { describe, expect, it } from 'vitest'
import { pattern, cachedEvent, cachedEventTest, get, pitch, freq, clear } from '../ziffers.ts'
import { Pitch } from '../types.ts'

describe('main-tests', () => {

    it('retrograde', () => {
        clear('1 2 3 4');
        // First call should be Start item
        expect(cachedEvent('1 2 3 4').retrograde().type).toEqual("Start");
        expect(cachedEvent('1 2 3 4').retrograde().collect('pitch')).toEqual(4);
    })

})