import { describe, it, expect, afterAll } from 'vitest'
import {dedupeFacts} from './dedupe'

describe('dedupe', () => {
    // silence logs for a moment
    const old = console.info
    console.info = () => {}

    afterAll(() => {
        console.info = old
    })
    it('dedupes based on one key', () => {
        const listWithDuplicates = [{
            happy: 'face'
        }, {
            sad: 'face'
        }, {
            happy: 'lace'
        }, {
            happy: 'face'
        }, {
            happy: undefined
        }]

        const expected = [...listWithDuplicates]
        expected.splice(3, 1)
        expect(dedupeFacts(listWithDuplicates)).toStrictEqual(expected)
    })

    it('dedupes based on multi key', () => {
        const listWithDuplicates = [{
            happy: 'face',
            rich: 'money'
        }, {
            sad: 'face',
            rich: 'money',
        }, {
            happy: 'lace',
            rich: 'money '
        }, {
            happy: 'face',
            rich: 'money'
        }, {
            happy: undefined
        }]

        const expected = [...listWithDuplicates]
        expected.splice(3, 1)
        expect(dedupeFacts(listWithDuplicates)).toStrictEqual(expected)
    })

    it('does not dedupe based on missing key', () => {
        const listWithDuplicates = [{
            happy: 'face',
            sad: 'face',
        }, {
            sad: 'face'
        }, {
            happy: 'lace'
        }]

        const expected = [...listWithDuplicates]
        expect(dedupeFacts(listWithDuplicates)).toStrictEqual(expected)
    })

    it('does not dedupe based on previously missing key', () => {
        const listWithDuplicates = [{
            sad: 'face',
        }, {
            happy: 'face',
            sad: 'face'
        }, {
            happy: 'lace'
        }]


        const expected = [...listWithDuplicates]
        expect(dedupeFacts(listWithDuplicates)).toStrictEqual(expected)
    })
})
