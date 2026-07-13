import { describe, it, expect } from "vitest"
import { parse } from "parse-gedcom"
import { GedcomTree } from "../../types"
import { mapDatabase } from "./database"
import { getChildrenForFamily } from "./getChildren"

const gedcom = (...lines: string[]) => ["0 HEAD", ...lines, "0 TRLR"].join("\n")

const makeDatabase = (content: string) => {
    const records = parse(content) as GedcomTree
    return mapDatabase(records.children)
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/** Family with two children */
const WITH_CHILDREN = gedcom(
    "0 @I1@ INDI",
    "1 NAME John Doe",
    "1 SEX M",
    "1 BIRT",
    "2 DATE 1 JAN 1820",
    "1 DEAT",
    "2 DATE 1 JAN 1880",
    "1 FAMS @F1@",
    "1 FAMS @F2@",
    "0 @I2@ INDI",
    "1 NAME Mary Smith",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1825",
    "1 DEAT",
    "2 DATE 1 JAN 1870",
    "1 FAMS @F1@",
    "0 @I3@ INDI",
    "1 NAME Alice Doe",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1847",
    "1 FAMC @F1@",
    "0 @I4@ INDI",
    "1 NAME Robert Doe",
    "1 SEX M",
    "1 BIRT",
    "2 DATE 1 JAN 1849",
    "1 FAMC @F1@",
    "0 @F1@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I2@",
    "1 MARR",
    "2 DATE 1 JAN 1845",
    "1 CHIL @I3@",
    "1 CHIL @I4@",
    "0 @F2@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I5@",
    "1 MARR",
    "2 DATE 1 JAN 1855",
    "0 @I5@ INDI",
    "1 NAME Jane Brown",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1830",
    "1 DEAT",
    "2 DATE 1 JAN 1895",
    "1 FAMS @F2@"
)

/** Family with a child who has their own family (grandchildren) */
const WITH_GRANDCHILDREN = gedcom(
    "0 @I1@ INDI",
    "1 NAME John Doe",
    "1 SEX M",
    "1 BIRT",
    "2 DATE 1 JAN 1820",
    "1 DEAT",
    "2 DATE 1 JAN 1890",
    "1 FAMS @F1@",
    "1 FAMS @F2@",
    "0 @I2@ INDI",
    "1 NAME Mary Smith",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1825",
    "1 DEAT",
    "2 DATE 1 JAN 1885",
    "1 FAMS @F1@",
    // Child Alice
    "0 @I3@ INDI",
    "1 NAME Alice Doe",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1847",
    "1 FAMC @F1@",
    "1 FAMS @F3@",
    // Alice's husband
    "0 @I4@ INDI",
    "1 NAME Thomas Clark",
    "1 SEX M",
    "1 BIRT",
    "2 DATE 1 JAN 1843",
    "1 FAMS @F3@",
    // Alice's child (grandchild of John & Mary)
    "0 @I5@ INDI",
    "1 NAME Emma Clark",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1870",
    "1 FAMC @F3@",
    // Alice's family
    "0 @F3@ FAM",
    "1 HUSB @I4@",
    "1 WIFE @I3@",
    "1 MARR",
    "2 DATE 1 JAN 1867",
    "1 CHIL @I5@",
    // John's family 1 (Mary's)
    "0 @F1@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I2@",
    "1 MARR",
    "2 DATE 1 JAN 1845",
    "1 CHIL @I3@",
    // John's family 2
    "0 @I6@ INDI",
    "1 NAME Jane Brown",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1830",
    "1 DEAT",
    "2 DATE 1 JAN 1895",
    "1 FAMS @F2@",
    "0 @F2@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I6@",
    "1 MARR",
    "2 DATE 1 JAN 1855"
)

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("getChildrenForFamily", () => {
    describe("basic child extraction", () => {
        it("returns a ChildRecord for each CHIL entry in the family", () => {
            const db = makeDatabase(WITH_CHILDREN)
            const family = db.families["@F1@"]
            const children = getChildrenForFamily(db, family)
            expect(children).toHaveLength(2)
        })

        it("includes the child's name", () => {
            const db = makeDatabase(WITH_CHILDREN)
            const family = db.families["@F1@"]
            const children = getChildrenForFamily(db, family)
            const names = children.map(c => c.name)
            expect(names).toContain("Alice Doe")
            expect(names).toContain("Robert Doe")
        })

        it("includes the child's birth date when present", () => {
            const db = makeDatabase(WITH_CHILDREN)
            const family = db.families["@F1@"]
            const children = getChildrenForFamily(db, family)
            const alice = children.find(c => c.name === "Alice Doe")!
            expect(alice.birth?.getFullYear()).toBe(1847)
        })

        it("returns empty array for a family with no children", () => {
            const db = makeDatabase(WITH_CHILDREN)
            const family = db.families["@F2@"]
            const children = getChildrenForFamily(db, family)
            expect(children).toHaveLength(0)
        })
    })

    describe("grandchildren", () => {
        it("populates the children field with grandchildren when a child has their own family", () => {
            const db = makeDatabase(WITH_GRANDCHILDREN)
            const family = db.families["@F1@"]
            const children = getChildrenForFamily(db, family)
            const alice = children.find(c => c.name === "Alice Doe")!
            expect(alice.children).toBeDefined()
            expect(alice.children).toHaveLength(1)
            expect(alice.children![0].name).toBe("Emma Clark")
        })

        it("leaves children field undefined when a child has no family of their own", () => {
            const db = makeDatabase(WITH_CHILDREN)
            const family = db.families["@F1@"]
            const children = getChildrenForFamily(db, family)
            for (const child of children) {
                expect(child.children).toBeUndefined()
            }
        })
    })
})
