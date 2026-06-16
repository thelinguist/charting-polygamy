import { describe, it, expect } from "vitest"
import { GedcomIndividual, GedcomType } from "../../../types"
import { getIndividualName } from "./index"

// Minimal helper to construct a GedcomIndividual with the given NAME record value.
// Pass `undefined` for nameValue to omit the NAME record entirely.
// Pass `null` to include a NAME record with a null value.
const makeIndividual = (nameValue: string | null | undefined, includeNameRecord = true): GedcomIndividual =>
    ({
        type: GedcomType.Individual,
        data: { formal_name: "INDIVIDUAL", value: undefined, xref_id: "@I1@" },
        value: undefined,
        children: includeNameRecord
            ? [
                  {
                      type: GedcomType.Name,
                      data: { formal_name: "NAME" },
                      value: nameValue,
                      children: [],
                  },
              ]
            : [],
    }) as unknown as GedcomIndividual

describe("getIndividualName", () => {
    it("strips slashes and returns the name for a well-formed name record", () => {
        const individual = makeIndividual("John /Doe/")
        expect(getIndividualName(individual)).toBe("John Doe")
    })

    it("returns undefined when the name value is only slashes", () => {
        const individual = makeIndividual("//")
        expect(getIndividualName(individual)).toBeUndefined()
    })

    it("returns undefined when the name value is an empty string", () => {
        const individual = makeIndividual("")
        expect(getIndividualName(individual)).toBeUndefined()
    })

    it("returns undefined when there is no NAME record at all", () => {
        const individual = makeIndividual(undefined, false)
        expect(getIndividualName(individual)).toBeUndefined()
    })

    it("returns undefined when the name record value is null", () => {
        const individual = makeIndividual(null)
        expect(getIndividualName(individual)).toBeUndefined()
    })
})