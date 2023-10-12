import { describe, it, expect } from 'vitest'
import {getMarriageEnd} from './get-marriage-end'
import {KnowledgeTree} from '../types'

const manSheLeft = "Taylor Swift's ex"
const manSheSwooned = "Mr. Handsome"
const silverFoxSheMarried = "Mr. Moneybags"
const wife = "Gal Gadot"
const newMarriageDate = '1840-01-01'
const wifeDeath = '1895-01-01'
const silverFoxDeath = '1900-01-01'

const tree: KnowledgeTree = {
    [manSheLeft]: {
        name: manSheLeft,
        birth: {
            date: new Date('1800-01-01')
        },
        death: {
            date: new Date('1890-01-01')
        },
        marriages: {},
        divorces: {},
    },
    [manSheSwooned]: {
        name: manSheSwooned,
        birth: {
            date: new Date('1800-01-01')
        },
        death: {
            date: new Date('1890-01-01')
        },
        marriages: {},
        divorces: {},
    },
    [silverFoxSheMarried]: {
        name: silverFoxSheMarried,
        birth: {
            date: new Date('1800-01-01'),
        },
        death: {
            date: new Date(silverFoxDeath) // lived 10 years longer than her
        },
        marriages: {},
        divorces: {},
    },
    [wife]: {
        name: wife,
        birth: {
            date: new Date('1800-01-01')
        },
        death: {
            date: new Date(wifeDeath)
        },
        marriages: {
            [manSheSwooned]: {
                date: new Date(newMarriageDate),      // 2nd
                person: manSheSwooned,
            },
            [manSheLeft]: {
                date: new Date('1825-01-01'),   // 1st
                person: manSheLeft,
            },
            [silverFoxSheMarried]: {
                date: new Date('1855-01-01'),   // 3rd
                person: silverFoxSheMarried
            }
        },
        divorces: {},
    }
}

describe('getMarriageEnd', () => {
    it('marriage ended when other marriage began', () => {
        expect(getMarriageEnd(tree, wife, manSheLeft)).toEqual(new Date(newMarriageDate))
    })

    it('marriage ended when she passed away', () => {
        expect(getMarriageEnd(tree, wife, silverFoxSheMarried)).toEqual(new Date(wifeDeath))
    })

    it('marriage ended when HE passed away', () => {
        const newTree = { ...tree }
        newTree[silverFoxSheMarried].death!.date = new Date('1890-01-01')
        expect(getMarriageEnd(newTree, wife, silverFoxSheMarried)).toEqual(new Date('1890-01-01'))
    })
})
