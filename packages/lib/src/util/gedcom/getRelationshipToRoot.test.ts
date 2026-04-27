import { describe, it, expect } from "vitest"
import { findRootPersonId, getRelationshipToRoot } from "./getRelationshipToRoot"
import { GedcomDatabase } from "./database"
import { GedcomType } from "../../types"

// Helpers to build minimal fake GEDCOM records
const makeIndividual = (id: string, famcIds: string[] = [], famsIds: string[] = []) => ({
    type: GedcomType.Individual,
    data: { formal_name: "INDIVIDUAL", xref_id: id },
    children: [
        ...famcIds.map(fid => ({
            type: GedcomType.FamilyChildRelation,
            data: { formal_name: "FAMILY_CHILD", pointer: fid },
            children: [],
        })),
        ...famsIds.map(fid => ({
            type: GedcomType.FamilySpouseRelation,
            data: { formal_name: "FAMILY_SPOUSE", pointer: fid },
            children: [],
        })),
    ],
})

const makeStepIndividual = (id: string, famcId: string, famsIds: string[] = []) => ({
    type: GedcomType.Individual,
    data: { formal_name: "INDIVIDUAL", xref_id: id },
    children: [
        {
            type: GedcomType.FamilyChildRelation,
            data: { formal_name: "FAMILY_CHILD", pointer: famcId },
            children: [{ type: "PEDI", data: {}, value: "step", children: [] }],
        },
        ...famsIds.map(fid => ({
            type: GedcomType.FamilySpouseRelation,
            data: { formal_name: "FAMILY_SPOUSE", pointer: fid },
            children: [],
        })),
    ],
})

const makeFamily = (id: string, husbId?: string, wifeId?: string, childIds: string[] = []) => ({
    type: GedcomType.Family,
    data: { formal_name: "FAMILY", xref_id: id },
    children: [
        ...(husbId ? [{ type: GedcomType.Husband, data: { pointer: husbId }, children: [] }] : []),
        ...(wifeId ? [{ type: GedcomType.Wife, data: { pointer: wifeId }, children: [] }] : []),
        ...childIds.map(cid => ({ type: GedcomType.Child, data: { pointer: cid }, children: [] })),
    ],
})

/**
 * Tree: GGF → GF → Father → Root → Child
 *       (@I5) (@I4)  (@I3)  (@I1)  (@I2)
 * Families: F1(GGF+wife→GF), F2(GF+wife→Father), F3(Father+wife→Root), F4(Root+wife→Child)
 */
const buildDatabase = (): GedcomDatabase => {
    const ggf = makeIndividual("@I5@", [], ["@F1@"])
    const gf = makeIndividual("@I4@", ["@F1@"], ["@F2@"])
    const father = makeIndividual("@I3@", ["@F2@"], ["@F3@"])
    const root = makeIndividual("@I1@", ["@F3@"], ["@F4@"])
    const child = makeIndividual("@I2@", ["@F4@"])

    // Step-grandfather: root's other FAMC family
    const stepGf = makeStepIndividual("@I6@", "@F5@")
    const stepParent = makeIndividual("@I7@", [], ["@F5@"])

    return {
        families: {
            "@F1@": makeFamily("@F1@", "@I5@", undefined, ["@I4@"]) as any,
            "@F2@": makeFamily("@F2@", "@I4@", undefined, ["@I3@"]) as any,
            "@F3@": makeFamily("@F3@", "@I3@", undefined, ["@I1@"]) as any,
            "@F4@": makeFamily("@F4@", "@I1@", undefined, ["@I2@"]) as any,
            "@F5@": makeFamily("@F5@", "@I7@", undefined, ["@I6@"]) as any,
        },
        individual: {
            "@I1@": root as any,
            "@I2@": child as any,
            "@I3@": father as any,
            "@I4@": gf as any,
            "@I5@": ggf as any,
            "@I6@": stepGf as any,
            "@I7@": stepParent as any,
        },
        sources: {},
    }
}

describe("findRootPersonId", () => {
    it("returns undefined when tree is empty", () => {
        expect(findRootPersonId([])).toBeUndefined()
    })

    it("returns xref_id of first INDI when no HEAD tag", () => {
        const tree = [
            { type: GedcomType.Individual, data: { xref_id: "@I1@" }, children: [] },
            { type: GedcomType.Individual, data: { xref_id: "@I2@" }, children: [] },
        ]
        expect(findRootPersonId(tree as any)).toBe("@I1@")
    })

    it("prefers _ROOT pointer in HEAD over first INDI", () => {
        const tree = [
            {
                type: GedcomType.Head,
                data: {},
                children: [{ type: "_ROOT", data: { pointer: "@I5@" }, children: [] }],
            },
            { type: GedcomType.Individual, data: { xref_id: "@I1@" }, children: [] },
        ]
        expect(findRootPersonId(tree as any)).toBe("@I5@")
    })

    it("prefers _HME pointer in HEAD over first INDI", () => {
        const tree = [
            {
                type: GedcomType.Head,
                data: {},
                children: [{ type: "_HME", data: { pointer: "@I99@" }, children: [] }],
            },
            { type: GedcomType.Individual, data: { xref_id: "@I1@" }, children: [] },
        ]
        expect(findRootPersonId(tree as any)).toBe("@I99@")
    })
})

describe("getRelationshipToRoot", () => {
    const db = buildDatabase()

    it("returns 'Root' when root equals target", () => {
        expect(getRelationshipToRoot(db, "@I1@", "@I1@")).toBe("Root")
    })

    it("returns 'Father' for direct parent", () => {
        expect(getRelationshipToRoot(db, "@I1@", "@I3@")).toBe("Father")
    })

    it("returns 'Grandfather' for grandparent", () => {
        expect(getRelationshipToRoot(db, "@I1@", "@I4@")).toBe("Grandfather")
    })

    it("returns 'Great-Grandfather' for great-grandparent", () => {
        expect(getRelationshipToRoot(db, "@I1@", "@I5@")).toBe("Great-Grandfather")
    })

    it("returns undefined for unrelated individual", () => {
        expect(getRelationshipToRoot(db, "@I1@", "@UNKNOWN@")).toBeUndefined()
    })

    it("returns undefined for an empty database target", () => {
        const emptyDb: GedcomDatabase = { families: {}, individual: {}, sources: {} }
        expect(getRelationshipToRoot(emptyDb, "@I1@", "@I2@")).toBeUndefined()
    })
})

describe("stepsToRelationshipLabel — collateral", () => {
    const db = buildDatabase()

    it("returns 'Brother' for sibling (up 1, down 1)", () => {
        // child @I2@ is root @I1@'s child; @I1@ is root → child is "Brother" from root perspective via sibling detection
        // Actually let's test uncle: root's father's sibling
        // For uncle we'd need: root → FAMC→F3 → father @I3@ → FAMS→F3 → children...
        // The current test DB doesn't have a brother/uncle. Let's build a minimal one.
        const uncle = makeIndividual("@UNCLE@", ["@F2@"])
        const dbWithUncle: GedcomDatabase = {
            ...db,
            individual: { ...db.individual, "@UNCLE@": uncle as any },
            families: {
                ...db.families,
                "@F2@": makeFamily("@F2@", "@I4@", undefined, ["@I3@", "@UNCLE@"]) as any,
            },
        }
        expect(getRelationshipToRoot(dbWithUncle, "@I1@", "@UNCLE@")).toBe("Uncle")
    })
})
