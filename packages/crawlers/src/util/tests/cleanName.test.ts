import { describe, it, expect } from "vitest"
import { cleanName } from "../cleanName"

describe("cleanName", () => {
    it("cleans former name", () => {
        expect(cleanName("Miriam Angeline (Works) Young", "Young")).toEqual("Miriam Angeline Works")
    })
})
