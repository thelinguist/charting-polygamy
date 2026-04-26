import { describe, it, expect } from "vitest"
import { getWives } from "../getWives"
import { KnowledgeTree, PersonDetails } from "../../../types"

// mid-year dates avoid UTC timezone edge cases (midnight Jan 1 → Dec 31 in UTC- zones)
const d = (year: number) => new Date(`${year}-07-01`)

const buildTree = (people: Record<string, Partial<PersonDetails> & { name: string }>): KnowledgeTree => {
    const tree: KnowledgeTree = {}
    for (const [key, details] of Object.entries(people)) {
        tree[key] = {
            marriages: {},
            divorces: {},
            ...details,
        }
    }
    return tree
}

describe("getWives", () => {
    describe("basic output", () => {
        it("returns one timeline per wife", () => {
            const tree = buildTree({
                John: {
                    name: "John",
                    birth: { date: d(1820) },
                    death: { date: d(1890) },
                    marriages: {
                        Mary: { date: d(1845), person: "Mary" },
                        Jane: { date: d(1855), person: "Jane" },
                    },
                    divorces: {},
                },
                Mary: {
                    name: "Mary",
                    birth: { date: d(1822) },
                    death: { date: d(1888) },
                    marriages: { John: { date: d(1845), person: "John" } },
                    divorces: {},
                },
                Jane: {
                    name: "Jane",
                    birth: { date: d(1830) },
                    death: { date: d(1870) },
                    marriages: { John: { date: d(1855), person: "John" } },
                    divorces: {},
                },
            })

            const result = getWives(tree, "John")
            expect(result).toHaveLength(2)
            expect(result.map(t => t.name)).toContain("Mary")
            expect(result.map(t => t.name)).toContain("Jane")
        })

        it("sets birth and death from the wife's record", () => {
            const tree = buildTree({
                John: {
                    name: "John",
                    birth: { date: d(1820) },
                    death: { date: d(1890) },
                    marriages: { Mary: { date: d(1845), person: "Mary" } },
                    divorces: {},
                },
                Mary: {
                    name: "Mary",
                    birth: { date: d(1822) },
                    death: { date: d(1888) },
                    marriages: { John: { date: d(1845), person: "John" } },
                    divorces: {},
                },
            })

            const [mary] = getWives(tree, "John")
            expect(mary.birth.getFullYear()).toBe(1822)
            expect(mary.death.getFullYear()).toBe(1888)
        })

        it("sets linkedMarriage.start from the patriarch's marriages record", () => {
            const tree = buildTree({
                John: {
                    name: "John",
                    birth: { date: d(1820) },
                    death: { date: d(1890) },
                    marriages: { Mary: { date: d(1845), person: "Mary" } },
                    divorces: {},
                },
                Mary: {
                    name: "Mary",
                    birth: { date: d(1822) },
                    death: { date: d(1888) },
                    marriages: { John: { date: d(1845), person: "John" } },
                    divorces: {},
                },
            })

            const [mary] = getWives(tree, "John")
            expect(mary.linkedMarriage.start?.getFullYear()).toBe(1845)
        })
    })

    describe("linkedMarriage.end", () => {
        it("is the husband's death when he dies before her next marriage", () => {
            // John dies 1850, Mary remarries Bob in 1860 — marriage ends at John's death
            const tree = buildTree({
                John: {
                    name: "John",
                    birth: { date: d(1820) },
                    death: { date: d(1850) },
                    marriages: {
                        Mary: { date: d(1840), person: "Mary" },
                        Jane: { date: d(1843), person: "Jane" },
                    },
                    divorces: {},
                },
                Mary: {
                    name: "Mary",
                    birth: { date: d(1822) },
                    death: { date: d(1890) },
                    marriages: {
                        John: { date: d(1840), person: "John" },
                        Bob: { date: d(1860), person: "Bob" },
                    },
                    divorces: {},
                },
                Jane: {
                    name: "Jane",
                    birth: { date: d(1825) },
                    death: { date: d(1895) },
                    marriages: { John: { date: d(1843), person: "John" } },
                    divorces: {},
                },
                Bob: {
                    name: "Bob",
                    birth: { date: d(1818) },
                    death: { date: d(1880) },
                    marriages: { Mary: { date: d(1860), person: "Mary" } },
                    divorces: {},
                },
            })

            const timelines = getWives(tree, "John")
            const mary = timelines.find(t => t.name === "Mary")!
            expect(mary.linkedMarriage.end?.getFullYear()).toBe(1850)
        })

        it("is the wife's next marriage when her husband outlives it", () => {
            // John lives until 1900, Mary remarries Bob in 1860 — marriage ends at remarriage
            const tree = buildTree({
                John: {
                    name: "John",
                    birth: { date: d(1820) },
                    death: { date: d(1900) },
                    marriages: {
                        Mary: { date: d(1840), person: "Mary" },
                        Jane: { date: d(1843), person: "Jane" },
                    },
                    divorces: {},
                },
                Mary: {
                    name: "Mary",
                    birth: { date: d(1822) },
                    death: { date: d(1890) },
                    marriages: {
                        John: { date: d(1840), person: "John" },
                        Bob: { date: d(1860), person: "Bob" },
                    },
                    divorces: {},
                },
                Jane: {
                    name: "Jane",
                    birth: { date: d(1825) },
                    death: { date: d(1895) },
                    marriages: { John: { date: d(1843), person: "John" } },
                    divorces: {},
                },
                Bob: {
                    name: "Bob",
                    birth: { date: d(1818) },
                    death: { date: d(1880) },
                    marriages: { Mary: { date: d(1860), person: "Mary" } },
                    divorces: {},
                },
            })

            const timelines = getWives(tree, "John")
            const mary = timelines.find(t => t.name === "Mary")!
            expect(mary.linkedMarriage.end?.getFullYear()).toBe(1860)
        })

        it("is the wife's death when she dies first and has no subsequent marriage", () => {
            const tree = buildTree({
                John: {
                    name: "John",
                    birth: { date: d(1820) },
                    death: { date: d(1900) },
                    marriages: {
                        Mary: { date: d(1840), person: "Mary" },
                        Jane: { date: d(1845), person: "Jane" },
                    },
                    divorces: {},
                },
                Mary: {
                    name: "Mary",
                    birth: { date: d(1822) },
                    death: { date: d(1870) },
                    marriages: { John: { date: d(1840), person: "John" } },
                    divorces: {},
                },
                Jane: {
                    name: "Jane",
                    birth: { date: d(1825) },
                    death: { date: d(1895) },
                    marriages: { John: { date: d(1845), person: "John" } },
                    divorces: {},
                },
            })

            const timelines = getWives(tree, "John")
            const mary = timelines.find(t => t.name === "Mary")!
            expect(mary.linkedMarriage.end?.getFullYear()).toBe(1870)
        })

        it("is the husband's death when he dies first and wife has no subsequent marriage", () => {
            const tree = buildTree({
                John: {
                    name: "John",
                    birth: { date: d(1820) },
                    death: { date: d(1860) },
                    marriages: {
                        Mary: { date: d(1840), person: "Mary" },
                        Jane: { date: d(1845), person: "Jane" },
                    },
                    divorces: {},
                },
                Mary: {
                    name: "Mary",
                    birth: { date: d(1822) },
                    death: { date: d(1890) },
                    marriages: { John: { date: d(1840), person: "John" } },
                    divorces: {},
                },
                Jane: {
                    name: "Jane",
                    birth: { date: d(1825) },
                    death: { date: d(1895) },
                    marriages: { John: { date: d(1845), person: "John" } },
                    divorces: {},
                },
            })

            const timelines = getWives(tree, "John")
            const mary = timelines.find(t => t.name === "Mary")!
            expect(mary.linkedMarriage.end?.getFullYear()).toBe(1860)
        })

        it("is the divorce date when a divorce is recorded", () => {
            const tree = buildTree({
                John: {
                    name: "John",
                    birth: { date: d(1820) },
                    death: { date: d(1900) },
                    marriages: {
                        Mary: { date: d(1840), person: "Mary" },
                        Jane: { date: d(1845), person: "Jane" },
                    },
                    divorces: {},
                },
                Mary: {
                    name: "Mary",
                    birth: { date: d(1822) },
                    death: { date: d(1895) },
                    marriages: { John: { date: d(1840), person: "John" } },
                    divorces: { John: { date: d(1855), person: "John" } },
                },
                Jane: {
                    name: "Jane",
                    birth: { date: d(1825) },
                    death: { date: d(1895) },
                    marriages: { John: { date: d(1845), person: "John" } },
                    divorces: {},
                },
            })

            const timelines = getWives(tree, "John")
            const mary = timelines.find(t => t.name === "Mary")!
            expect(mary.linkedMarriage.end?.getFullYear()).toBe(1855)
        })
    })

    describe("filtering", () => {
        it("skips a wife who has no birth date", () => {
            const tree = buildTree({
                John: {
                    name: "John",
                    birth: { date: d(1820) },
                    death: { date: d(1890) },
                    marriages: {
                        Mary: { date: d(1845), person: "Mary" },
                        Jane: { date: d(1855), person: "Jane" },
                    },
                    divorces: {},
                },
                Mary: {
                    name: "Mary",
                    birth: undefined,
                    death: { date: d(1888) },
                    marriages: { John: { date: d(1845), person: "John" } },
                    divorces: {},
                },
                Jane: {
                    name: "Jane",
                    birth: { date: d(1830) },
                    death: { date: d(1870) },
                    marriages: { John: { date: d(1855), person: "John" } },
                    divorces: {},
                },
            })

            const result = getWives(tree, "John")
            expect(result.map(t => t.name)).not.toContain("Mary")
            expect(result.map(t => t.name)).toContain("Jane")
        })

        it("skips a wife who has no death date", () => {
            const tree = buildTree({
                John: {
                    name: "John",
                    birth: { date: d(1820) },
                    death: { date: d(1890) },
                    marriages: {
                        Mary: { date: d(1845), person: "Mary" },
                        Jane: { date: d(1855), person: "Jane" },
                    },
                    divorces: {},
                },
                Mary: {
                    name: "Mary",
                    birth: { date: d(1822) },
                    death: undefined,
                    marriages: { John: { date: d(1845), person: "John" } },
                    divorces: {},
                },
                Jane: {
                    name: "Jane",
                    birth: { date: d(1830) },
                    death: { date: d(1870) },
                    marriages: { John: { date: d(1855), person: "John" } },
                    divorces: {},
                },
            })

            const result = getWives(tree, "John")
            expect(result.map(t => t.name)).not.toContain("Mary")
        })
    })

    describe("otherMarriages", () => {
        it("populates otherMarriages for a wife who married someone else", () => {
            const tree = buildTree({
                John: {
                    name: "John",
                    birth: { date: d(1820) },
                    death: { date: d(1900) },
                    marriages: {
                        Mary: { date: d(1840), person: "Mary" },
                        Jane: { date: d(1845), person: "Jane" },
                    },
                    divorces: {},
                },
                Mary: {
                    name: "Mary",
                    birth: { date: d(1822) },
                    death: { date: d(1895) },
                    marriages: {
                        John: { date: d(1840), person: "John" },
                        Bob: { date: d(1870), person: "Bob" },
                    },
                    divorces: {},
                },
                Jane: {
                    name: "Jane",
                    birth: { date: d(1825) },
                    death: { date: d(1895) },
                    marriages: { John: { date: d(1845), person: "John" } },
                    divorces: {},
                },
                Bob: {
                    name: "Bob",
                    birth: { date: d(1818) },
                    death: { date: d(1885) },
                    marriages: { Mary: { date: d(1870), person: "Mary" } },
                    divorces: {},
                },
            })

            const timelines = getWives(tree, "John")
            const mary = timelines.find(t => t.name === "Mary")!
            expect(mary.otherMarriages).toHaveLength(1)
            expect(mary.otherMarriages[0].spouse).toBe("Bob")
            expect(mary.otherMarriages[0].start.getFullYear()).toBe(1870)
        })

        it("returns empty otherMarriages for a wife with only one husband", () => {
            const tree = buildTree({
                John: {
                    name: "John",
                    birth: { date: d(1820) },
                    death: { date: d(1890) },
                    marriages: {
                        Mary: { date: d(1845), person: "Mary" },
                        Jane: { date: d(1850), person: "Jane" },
                    },
                    divorces: {},
                },
                Mary: {
                    name: "Mary",
                    birth: { date: d(1822) },
                    death: { date: d(1888) },
                    marriages: { John: { date: d(1845), person: "John" } },
                    divorces: {},
                },
                Jane: {
                    name: "Jane",
                    birth: { date: d(1825) },
                    death: { date: d(1895) },
                    marriages: { John: { date: d(1850), person: "John" } },
                    divorces: {},
                },
            })

            const [mary] = getWives(tree, "John")
            expect(mary.otherMarriages).toHaveLength(0)
        })
    })

    describe("age and gap", () => {
        it("calculates age at marriage and age gap between spouses", () => {
            // John born 1820-07-01, Mary born 1825-07-01, married 1845-07-01
            // age = 25, gap = 5 (Mary is 5 years younger)
            const tree = buildTree({
                John: {
                    name: "John",
                    birth: { date: new Date("1820-07-01") },
                    death: { date: d(1890) },
                    marriages: {
                        Mary: { date: new Date("1845-07-01"), person: "Mary" },
                        Jane: { date: d(1850), person: "Jane" },
                    },
                    divorces: {},
                },
                Mary: {
                    name: "Mary",
                    birth: { date: new Date("1825-07-01") },
                    death: { date: d(1888) },
                    marriages: { John: { date: new Date("1845-07-01"), person: "John" } },
                    divorces: {},
                },
                Jane: {
                    name: "Jane",
                    birth: { date: d(1826) },
                    death: { date: d(1895) },
                    marriages: { John: { date: d(1850), person: "John" } },
                    divorces: {},
                },
            })

            const timelines = getWives(tree, "John")
            const mary = timelines.find(t => t.name === "Mary")!
            // age of Mary at marriage = 20
            expect(mary.age).toBe(20)
            // gap = differenceInYears(patriarchBirth, wifeBirth) = 1820 - 1825 = -5
            // negative means the patriarch is older than the wife
            expect(mary.gap).toBe(-5)
        })
    })
})
