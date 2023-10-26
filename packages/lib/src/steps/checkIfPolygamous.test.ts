import { describe, it, expect } from "vitest"
import { checkIfPolygamous } from "./checkIfPolygamous"
import { Timeline } from "../types"
import { addYears } from "date-fns"

describe("checkIfPolygamous", () => {
    it("ignores lists of one", () => {
        expect(
            checkIfPolygamous([
                {
                    linkedMarriage: {
                        start: new Date(),
                        end: addYears(new Date(), 20),
                    },
                } as Timeline,
            ])
        ).toBeFalsy()
    })

    it("ignores incomplete marriage records", () => {
        expect(
            checkIfPolygamous([
                {
                    linkedMarriage: {
                        start: new Date(),
                    },
                } as Timeline,
                {
                    linkedMarriage: {
                        end: new Date(),
                    },
                } as Timeline,
            ])
        ).toBeFalsy()
    })

    it("reports false for marriages that did not overlap", () => {
        expect(
            checkIfPolygamous([
                {
                    linkedMarriage: {
                        start: addYears(new Date(), -50),
                        end: addYears(new Date(), -30),
                    },
                } as Timeline,
                {
                    linkedMarriage: {
                        start: addYears(new Date(), -20),
                        end: addYears(new Date(), -10),
                    },
                } as Timeline,
                {
                    linkedMarriage: {
                        start: addYears(new Date(), -9),
                        end: addYears(new Date(), -5),
                    },
                } as Timeline,
            ])
        ).toBeFalsy()
    })

    it("reports true when one marriage overlaps partially", () => {
        expect(
            checkIfPolygamous([
                {
                    linkedMarriage: {
                        start: addYears(new Date(), -50),
                        end: addYears(new Date(), -30),
                    },
                } as Timeline,
                {
                    linkedMarriage: {
                        start: addYears(new Date(), -20),
                        end: addYears(new Date(), -10),
                    },
                } as Timeline,
                {
                    linkedMarriage: {
                        start: addYears(new Date(), -12),
                        end: addYears(new Date(), -5),
                    },
                } as Timeline,
            ])
        ).toBeTruthy()
    })

    it("reports true when one marriage starts and ends inside of another marriage", () => {
        expect(
            checkIfPolygamous([
                {
                    linkedMarriage: {
                        start: addYears(new Date(), -50),
                        end: addYears(new Date(), -30),
                    },
                } as Timeline,
                {
                    linkedMarriage: {
                        start: addYears(new Date(), -20),
                        end: addYears(new Date(), -1),
                    },
                } as Timeline,
                {
                    linkedMarriage: {
                        start: addYears(new Date(), -12),
                        end: addYears(new Date(), -5),
                    },
                } as Timeline,
            ])
        ).toBeTruthy()
    })
})
