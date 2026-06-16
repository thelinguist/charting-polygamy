import { describe, expect, it } from "vitest"
import { KnowledgeTree } from "../types"
import { getMarriageEnd } from "./get-marriage-end"
import { addYears } from "date-fns"
import { setConfig } from "./config"

const manSheLeft = "Taylor Swift's ex"
const manSheSwooned = "Mr. Handsome"
const silverFoxSheMarried = "Mr. Moneybags"
const wife = "Gal Gadot"
const newMarriageDate = "1840-01-01"
const wifeDeath = "1895-01-01"
const manSheSwoonedDeath = "1890-01-01"

const tree: KnowledgeTree = {
    [manSheLeft]: {
        name: manSheLeft,
        birth: {
            date: new Date("1800-01-01"),
        },
        death: {
            date: new Date("1890-01-01"),
        },
        marriages: {},
        divorces: {},
    },
    [manSheSwooned]: {
        name: manSheSwooned,
        birth: {
            date: new Date("1800-01-01"),
        },
        death: {
            date: new Date(manSheSwoonedDeath),
        },
        marriages: {},
        divorces: {},
    },
    [silverFoxSheMarried]: {
        name: silverFoxSheMarried,
        birth: {
            date: new Date("1800-01-01"),
        },
        death: {
            date: new Date("1900-01-01"), // lived 10 years longer than her
        },
        marriages: {},
        divorces: {},
    },
    [wife]: {
        name: wife,
        birth: {
            date: new Date("1800-01-01"),
        },
        death: {
            date: new Date(wifeDeath),
        },
        marriages: {
            [manSheSwooned]: {
                date: new Date(newMarriageDate), // 2nd
                person: manSheSwooned,
            },
            [manSheLeft]: {
                date: new Date("1825-01-01"), // 1st
                person: manSheLeft,
            },
            [silverFoxSheMarried]: {
                date: new Date("1855-01-01"), // 3rd
                person: silverFoxSheMarried,
            },
        },
        divorces: {},
    },
}

describe("getMarriageEnd", () => {
    it("marriage ended when other marriage began", () => {
        expect(getMarriageEnd(tree, wife, manSheLeft)).toEqual(new Date(newMarriageDate))
    })

    it("marriage ended when HE passed away", () => {
        const newTree = {
            ...tree,
            [silverFoxSheMarried]: { ...tree[silverFoxSheMarried] },
        }
        newTree[silverFoxSheMarried].death!.date = addYears(tree[wife].death!.date!, -1)
        expect(getMarriageEnd(newTree, wife, silverFoxSheMarried)).toEqual(tree[silverFoxSheMarried].death!.date)
    })

    it("marriage ended when she passed away", () => {
        const newTree = {
            ...tree,
            [silverFoxSheMarried]: { ...tree[silverFoxSheMarried] },
        }
        newTree[silverFoxSheMarried].death!.date = addYears(tree[wife].death!.date!, 1)
        expect(getMarriageEnd(tree, wife, silverFoxSheMarried)).toEqual(new Date(wifeDeath))
    })

    it("marriage ended when divorce happened", () => {
        const newTree = {
            ...tree,
            [silverFoxSheMarried]: { ...tree[silverFoxSheMarried] },
        }
        const divorce = addYears(newTree[wife].marriages[silverFoxSheMarried].date, 1)
        newTree[wife].divorces[silverFoxSheMarried] = {
            date: divorce,
        }
        expect(getMarriageEnd(tree, wife, silverFoxSheMarried)).toEqual(divorce)
    })

    it("allows for subsequent marriages", () => {
        setConfig({ allowFemaleConcurrentMarriages: true })
        // in the tree he dies well after she marries again
        expect(getMarriageEnd(tree, wife, manSheSwooned)).toEqual(new Date(manSheSwoonedDeath))
    })

    it("returns undefined without throwing when both husband and wife have no death date (last marriage)", () => {
        const noDeathWife = "No Death Wife"
        const noDeathHusband = "No Death Husband"
        const noDeathTree: KnowledgeTree = {
            [noDeathHusband]: {
                name: noDeathHusband,
                birth: { date: new Date("1800-01-01") },
                marriages: {},
                divorces: {},
            },
            [noDeathWife]: {
                name: noDeathWife,
                birth: { date: new Date("1800-01-01") },
                marriages: {
                    [noDeathHusband]: {
                        date: new Date("1820-01-01"),
                        person: noDeathHusband,
                    },
                },
                divorces: {},
            },
        }
        expect(() => getMarriageEnd(noDeathTree, noDeathWife, noDeathHusband)).not.toThrow()
        expect(getMarriageEnd(noDeathTree, noDeathWife, noDeathHusband)).toBeUndefined()
    })

    it("returns undefined without throwing when both husband and wife have no death date (allowFemaleConcurrentMarriages: true)", () => {
        setConfig({ allowFemaleConcurrentMarriages: true })
        const noDeathWife = "No Death Wife"
        const noDeathHusband1 = "No Death Husband 1"
        const noDeathHusband2 = "No Death Husband 2"
        const noDeathTree: KnowledgeTree = {
            [noDeathHusband1]: {
                name: noDeathHusband1,
                birth: { date: new Date("1800-01-01") },
                marriages: {},
                divorces: {},
            },
            [noDeathHusband2]: {
                name: noDeathHusband2,
                birth: { date: new Date("1800-01-01") },
                marriages: {},
                divorces: {},
            },
            [noDeathWife]: {
                name: noDeathWife,
                birth: { date: new Date("1800-01-01") },
                marriages: {
                    [noDeathHusband1]: {
                        date: new Date("1820-01-01"),
                        person: noDeathHusband1,
                    },
                    [noDeathHusband2]: {
                        date: new Date("1830-01-01"),
                        person: noDeathHusband2,
                    },
                },
                divorces: {},
            },
        }
        expect(() => getMarriageEnd(noDeathTree, noDeathWife, noDeathHusband1)).not.toThrow()
        expect(getMarriageEnd(noDeathTree, noDeathWife, noDeathHusband1)).toBeUndefined()
    })
})
