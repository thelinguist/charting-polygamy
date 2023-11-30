import { describe, it, expect } from "vitest"
import { patriarchIsEligible } from "./patriarchIsEligible"
import { PersonDetails } from "../types"

describe("patriarchIsEligible", () => {
    it("should return TRUE if the patriarch was born BEFORE polygamy started and died AFTER it started", () => {
        const patriarch = {
            birth: {
                date: new Date("1830-01-01"),
            },
            death: {
                date: new Date("1900-01-01"),
            },
        } as PersonDetails
        expect(patriarchIsEligible(patriarch)).toBe(true)
    })

    it("should return FALSE if the patriarch died BEFORE polygamy started", () => {
        const patriarch = {
            birth: {
                date: new Date("1790-01-01"),
            },
            death: {
                date: new Date("1829-01-01"),
            },
        } as PersonDetails
        expect(patriarchIsEligible(patriarch)).toBe(false)
    })

    it("should return FALSE if the patriarch was born AFTER polygamy ended", () => {
        const patriarch = {
            birth: {
                date: new Date("1900-01-01"),
            },
            death: {
                date: new Date("1950-01-01"),
            },
        } as PersonDetails
        expect(patriarchIsEligible(patriarch)).toBe(false)
    })

    it("should return FALSE if the patriarch was not of age when polygamy ended", () => {
        const patriarch = {
            birth: {
                date: new Date("1872-01-01"),
            },
            death: {
                date: new Date("1950-01-01"),
            },
        } as PersonDetails
        expect(patriarchIsEligible(patriarch)).toBe(false)
    })
})
