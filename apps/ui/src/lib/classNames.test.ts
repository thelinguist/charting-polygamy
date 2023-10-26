import classNames from "./classNames"
import { describe, it, expect } from "vitest"

describe("classNames", function () {
    it("accepts strings", () => {
        expect(classNames("these things")).toBe("these things")
        expect(classNames("these things", "work")).toBe("these things work")
    })

    it("accepts objects", () => {
        expect(
            classNames({
                working: true,
                failure: false,
                happiness: true,
            })
        ).toBe("working happiness")
        expect(classNames({ working: true, failure: false, happiness: true }, { something: true, else: true })).toBe(
            "working happiness something else"
        )
    })

    it("accepts both", () => {
        expect(
            classNames({ working: true, failure: false, happiness: true }, { something: true, else: true }, "things")
        ).toBe("working happiness something else things")
    })
})
