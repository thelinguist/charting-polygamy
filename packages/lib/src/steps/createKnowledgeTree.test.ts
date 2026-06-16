import { describe, it, expect, beforeEach } from "vitest"
import { createKnowledgeTree } from "./createKnowledgeTree"
import { UserIntervention } from "../util"
import { FactRecord, LifeEventEnum } from "../types"

beforeEach(() => {
    UserIntervention.reset()
})

describe("createKnowledgeTree", () => {
    it("builds correct tree shape from valid birth/death/marriage/divorce facts", () => {
        const facts: FactRecord[] = [
            { Name: "Alice", Event: LifeEventEnum.Birth, Date: "1850-01-01" },
            { Name: "Bob", Event: LifeEventEnum.Birth, Date: "1845-03-15" },
            { Name: "Alice", Event: LifeEventEnum.Marriage, Date: "1870-06-10", "Second Party": "Bob" },
            { Name: "Alice", Event: LifeEventEnum.Divorce, Date: "1880-09-01", "Second Party": "Bob" },
            { Name: "Alice", Event: LifeEventEnum.Death, Date: "1920-12-31" },
            { Name: "Bob", Event: LifeEventEnum.Death, Date: "1915-05-20" },
        ]

        const tree = createKnowledgeTree(facts)

        // Both people are in the tree
        expect(tree).toHaveProperty("Alice")
        expect(tree).toHaveProperty("Bob")

        // Birth and death dates are set
        expect(tree["Alice"].birth).toBeDefined()
        expect(tree["Alice"].birth?.date).toBeInstanceOf(Date)
        expect(tree["Alice"].death).toBeDefined()
        expect(tree["Alice"].death?.date).toBeInstanceOf(Date)

        // Marriage is recorded symmetrically
        expect(tree["Alice"].marriages["Bob"]).toBeDefined()
        expect(tree["Bob"].marriages["Alice"]).toBeDefined()
        expect(tree["Alice"].marriages["Bob"].date).toBeInstanceOf(Date)

        // Divorce is recorded symmetrically
        expect(tree["Alice"].divorces["Bob"]).toBeDefined()
        expect(tree["Bob"].divorces["Alice"]).toBeDefined()
        expect(tree["Alice"].divorces["Bob"].date).toBeInstanceOf(Date)

        // Cross-party references are correct
        expect(tree["Alice"].marriages["Bob"].person).toBe("Bob")
        expect(tree["Bob"].marriages["Alice"].person).toBe("Alice")

        // No UserIntervention issues for valid data (only canMakeAssumption issues at most from year parsing — but all dates here are full)
        const issues = UserIntervention.getIssues()
        expect(issues).toHaveLength(0)
    })

    it("does not throw when a date string cannot be parsed and returns undefined for that date", () => {
        const facts: FactRecord[] = [
            { Name: "Carol", Event: LifeEventEnum.Birth, Date: "not-a-date" },
        ]

        let tree: ReturnType<typeof createKnowledgeTree> | undefined
        expect(() => {
            tree = createKnowledgeTree(facts)
        }).not.toThrow()

        expect(tree).toBeDefined()
        expect(tree!["Carol"].birth).toBeDefined()
        expect(tree!["Carol"].birth?.date).toBeUndefined()
    })

    it("records a UserIntervention issue when a date string cannot be parsed", () => {
        const facts: FactRecord[] = [
            { Name: "Carol", Event: LifeEventEnum.Birth, Date: "not-a-date" },
        ]

        createKnowledgeTree(facts)

        const issues = UserIntervention.getIssues()
        expect(issues.length).toBeGreaterThan(0)

        const dateIssue = issues.find(i => i.issueWith === "Date")
        expect(dateIssue).toBeDefined()
        expect(dateIssue?.reason).toContain("not-a-date")
        expect(dateIssue?.fact).toMatchObject({ Name: "Carol", Event: LifeEventEnum.Birth })
    })

    it("does not record a UserIntervention issue when the date string is empty/absent", () => {
        const facts: FactRecord[] = [
            { Name: "Dave", Event: LifeEventEnum.Birth },
            { Name: "Dave", Event: LifeEventEnum.Death, Date: "" },
        ]

        createKnowledgeTree(facts)

        // Empty/missing date means date is unknown — not a parse failure
        const issues = UserIntervention.getIssues()
        const parseFailures = issues.filter(i => i.reason?.includes("Could not parse date string"))
        expect(parseFailures).toHaveLength(0)
    })

    it("throws with a useful message when a Marriage fact is missing Second Party", () => {
        const facts: FactRecord[] = [
            { Name: "Eve", Event: LifeEventEnum.Marriage, Date: "1870-01-01" },
        ]

        expect(() => createKnowledgeTree(facts)).toThrowError(/marriage.*one party.*Eve/i)
    })

    it("throws with a useful message when a Divorce fact is missing Second Party", () => {
        const facts: FactRecord[] = [
            { Name: "Frank", Event: LifeEventEnum.Divorce, Date: "1880-06-15" },
        ]

        expect(() => createKnowledgeTree(facts)).toThrowError(/divorce.*one party.*Frank/i)
    })
})