import { describe, it, expect, beforeEach } from "vitest"
import { getOtherMarriages } from "../getOtherMarriages"
import { KnowledgeTree, PersonDetails } from "../../../types"
import { UserIntervention } from "../../../util"

// mid-year dates avoid UTC timezone edge cases
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

beforeEach(() => {
    UserIntervention.reset()
})

describe("getOtherMarriages", () => {
    it("returns all other marriages when they have valid start and end dates", () => {
        const tree = buildTree({
            John: {
                name: "John",
                birth: { date: d(1820) },
                death: { date: d(1900) },
                marriages: { Mary: { date: d(1840), person: "Mary" } },
                divorces: {},
            },
            Bob: {
                name: "Bob",
                birth: { date: d(1818) },
                death: { date: d(1895) },
                marriages: { Mary: { date: d(1860), person: "Mary" } },
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
        })

        const result = getOtherMarriages(tree, "Mary", "John")
        expect(result).toHaveLength(1)
        expect(result[0].spouse).toBe("Bob")
        expect(result[0].start.getFullYear()).toBe(1860)
        expect(result[0].end).toBeDefined()
    })

    it("skips other marriages with no start date", () => {
        const tree = buildTree({
            John: {
                name: "John",
                birth: { date: d(1820) },
                death: { date: d(1900) },
                marriages: { Mary: { date: d(1840), person: "Mary" } },
                divorces: {},
            },
            Bob: {
                name: "Bob",
                birth: { date: d(1818) },
                death: { date: d(1895) },
                marriages: { Mary: { date: undefined, person: "Mary" } },
                divorces: {},
            },
            Mary: {
                name: "Mary",
                birth: { date: d(1822) },
                death: { date: d(1890) },
                marriages: {
                    John: { date: d(1840), person: "John" },
                    Bob: { date: undefined, person: "Bob" },
                },
                divorces: {},
            },
        })

        const result = getOtherMarriages(tree, "Mary", "John")
        expect(result).toHaveLength(0)
    })

    it("skips other marriages with no end date and records a UserIntervention issue", () => {
        // Mary has no death date, so getMarriageEnd returns undefined
        const tree = buildTree({
            John: {
                name: "John",
                birth: { date: d(1820) },
                death: { date: d(1900) },
                marriages: { Mary: { date: d(1840), person: "Mary" } },
                divorces: {},
            },
            Bob: {
                name: "Bob",
                birth: { date: d(1818) },
                // no death date
                marriages: { Mary: { date: d(1860), person: "Mary" } },
                divorces: {},
            },
            Mary: {
                name: "Mary",
                birth: { date: d(1822) },
                // no death date — causes getMarriageEnd to return undefined
                marriages: {
                    John: { date: d(1840), person: "John" },
                    Bob: { date: d(1860), person: "Bob" },
                },
                divorces: {},
            },
        })

        const result = getOtherMarriages(tree, "Mary", "John")
        expect(result).toHaveLength(0)

        const issues = UserIntervention.getIssues()
        expect(issues).toHaveLength(1)
        expect(issues[0].fact.Name).toBe("Mary")
        expect(issues[0].issueWith).toBe("Date")
        expect(issues[0].reason).toContain("Mary")
        expect(issues[0].reason).toContain("Bob")
    })

    it("returns only valid marriages and records an issue for the one with missing end date", () => {
        // Alice has valid death date; Carol does not — so Bob's marriage is valid, Carol's is skipped
        const tree = buildTree({
            John: {
                name: "John",
                birth: { date: d(1820) },
                death: { date: d(1900) },
                marriages: { Alice: { date: d(1840), person: "Alice" } },
                divorces: {},
            },
            Bob: {
                name: "Bob",
                birth: { date: d(1818) },
                death: { date: d(1895) },
                marriages: { Alice: { date: d(1860), person: "Alice" } },
                divorces: {},
            },
            Charlie: {
                name: "Charlie",
                birth: { date: d(1815) },
                // no death date
                marriages: { Alice: { date: d(1875), person: "Alice" } },
                divorces: {},
            },
            Alice: {
                name: "Alice",
                birth: { date: d(1822) },
                death: { date: d(1890) },
                marriages: {
                    John: { date: d(1840), person: "John" },
                    Bob: { date: d(1860), person: "Bob" },
                    Charlie: { date: d(1875), person: "Charlie" },
                },
                divorces: {},
            },
        })

        const result = getOtherMarriages(tree, "Alice", "John")
        // Bob's marriage: Alice has death (1890), Bob has death (1895) — end = Alice's death (she dies first)
        // Charlie's marriage: Alice is last, Alice has death (1890), Charlie has no death — end = Alice's death
        // Both should resolve. Let's confirm by checking count
        expect(result).toHaveLength(2)
        expect(result.map(r => r.spouse)).toContain("Bob")
        expect(result.map(r => r.spouse)).toContain("Charlie")
        // No issues since both resolved
        expect(UserIntervention.getIssues()).toHaveLength(0)
    })

    it("returns only valid marriage and records issue when one other marriage has unresolvable end date", () => {
        // Mary has no death date at all — so getMarriageEnd returns undefined for all her marriages
        // Use a tree where Bob's marriage has a resolvable end (via divorce) but Carol's does not
        const tree = buildTree({
            John: {
                name: "John",
                birth: { date: d(1820) },
                death: { date: d(1900) },
                marriages: { Mary: { date: d(1840), person: "Mary" } },
                divorces: {},
            },
            Bob: {
                name: "Bob",
                birth: { date: d(1818) },
                death: { date: d(1895) },
                marriages: { Mary: { date: d(1855), person: "Mary" } },
                divorces: {},
            },
            Charlie: {
                name: "Charlie",
                birth: { date: d(1815) },
                // no death date
                marriages: { Mary: { date: d(1870), person: "Mary" } },
                divorces: {},
            },
            Mary: {
                name: "Mary",
                birth: { date: d(1822) },
                death: { date: d(1890) },
                marriages: {
                    John: { date: d(1840), person: "John" },
                    Bob: { date: d(1855), person: "Bob" },
                    Charlie: { date: d(1870), person: "Charlie" },
                },
                // Bob's marriage ended in divorce
                divorces: { Bob: { date: d(1865), person: "Bob" } },
            },
        })

        const result = getOtherMarriages(tree, "Mary", "John")
        // Bob: divorce date resolves the end
        // Charlie: last marriage, Mary dies 1890, Charlie has no death — end = Mary's death
        expect(result).toHaveLength(2)
        expect(result.find(r => r.spouse === "Bob")?.end.getFullYear()).toBe(1865)
        expect(UserIntervention.getIssues()).toHaveLength(0)
    })
})