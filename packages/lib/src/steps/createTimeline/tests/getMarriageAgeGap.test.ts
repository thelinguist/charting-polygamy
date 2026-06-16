import { describe, it, expect, beforeEach } from "vitest"
import { getMarriageAgeGap } from "../getMarriageAgeGap"
import { UserIntervention } from "../../../util"
import { PersonDetails } from "../../../types"

// mid-year dates avoid UTC timezone edge cases (midnight Jan 1 → Dec 31 in UTC- zones)
const d = (year: number) => new Date(`${year}-07-01`)

const makePerson = (
    name: string,
    birthYear: number | null,
    deathYear: number,
    marriages: Record<string, { date: Date | null; person: string }>
): PersonDetails => ({
    name,
    birth: birthYear !== null ? { date: d(birthYear) } : undefined,
    death: { date: d(deathYear) },
    marriages: Object.fromEntries(
        Object.entries(marriages).map(([k, v]) => [k, { person: v.person, ...(v.date ? { date: v.date } : {}) }])
    ),
    divorces: {},
})

beforeEach(() => {
    UserIntervention.reset()
})

describe("getMarriageAgeGap", () => {
    describe("when all dates are present", () => {
        it("returns the correct age at marriage", () => {
            const patriarch = makePerson("John", 1820, 1880, {
                Mary: { date: d(1845), person: "Mary" },
            })
            const spouse = makePerson("Mary", 1825, 1870, {})
            const result = getMarriageAgeGap(patriarch, spouse)
            expect(result.age).toBe(25)
        })

        it("returns the correct age gap between patriarch and spouse", () => {
            const patriarch = makePerson("John", 1820, 1880, {
                Mary: { date: d(1845), person: "Mary" },
            })
            const spouse = makePerson("Mary", 1825, 1870, {})
            const result = getMarriageAgeGap(patriarch, spouse)
            expect(result.gap).toBe(5)
        })

        it("returns the marriage start date", () => {
            const marriageDate = d(1845)
            const patriarch = makePerson("John", 1820, 1880, {
                Mary: { date: marriageDate, person: "Mary" },
            })
            const spouse = makePerson("Mary", 1825, 1870, {})
            const result = getMarriageAgeGap(patriarch, spouse)
            expect(result.start).toBe(marriageDate)
        })

        it("records no UserIntervention issues", () => {
            const patriarch = makePerson("John", 1820, 1880, {
                Mary: { date: d(1845), person: "Mary" },
            })
            const spouse = makePerson("Mary", 1825, 1870, {})
            getMarriageAgeGap(patriarch, spouse)
            expect(UserIntervention.getIssues()).toHaveLength(0)
        })
    })

    describe("when dates are missing", () => {
        it("records an issue naming the missing patriarch birth date", () => {
            const patriarch = makePerson("John", null, 1880, {
                Mary: { date: d(1845), person: "Mary" },
            })
            const spouse = makePerson("Mary", 1825, 1870, {})
            getMarriageAgeGap(patriarch, spouse)
            const issues = UserIntervention.getIssues()
            expect(issues).toHaveLength(1)
            expect(issues[0].reason).toContain("John's birth date")
        })

        it("records an issue naming the missing spouse birth date", () => {
            const patriarch = makePerson("John", 1820, 1880, {
                Mary: { date: d(1845), person: "Mary" },
            })
            const spouse = makePerson("Mary", null, 1870, {})
            getMarriageAgeGap(patriarch, spouse)
            const issues = UserIntervention.getIssues()
            expect(issues).toHaveLength(1)
            expect(issues[0].reason).toContain("Mary's birth date")
        })

        it("records an issue naming the missing marriage date", () => {
            const patriarch = makePerson("John", 1820, 1880, {
                Mary: { date: null, person: "Mary" },
            })
            const spouse = makePerson("Mary", 1825, 1870, {})
            getMarriageAgeGap(patriarch, spouse)
            const issues = UserIntervention.getIssues()
            expect(issues).toHaveLength(1)
            expect(issues[0].reason).toContain("marriage date for John & Mary")
        })

        it("lists all missing items in a single issue when all three dates are absent", () => {
            const patriarch = makePerson("John", null, 1880, {
                Mary: { date: null, person: "Mary" },
            })
            const spouse = makePerson("Mary", null, 1870, {})
            getMarriageAgeGap(patriarch, spouse)
            const issues = UserIntervention.getIssues()
            expect(issues).toHaveLength(1)
            expect(issues[0].reason).toContain("John's birth date")
            expect(issues[0].reason).toContain("Mary's birth date")
            expect(issues[0].reason).toContain("marriage date for John & Mary")
        })

        it("sets issueWith to Date", () => {
            const patriarch = makePerson("John", null, 1880, {
                Mary: { date: d(1845), person: "Mary" },
            })
            const spouse = makePerson("Mary", 1825, 1870, {})
            getMarriageAgeGap(patriarch, spouse)
            expect(UserIntervention.getIssues()[0].issueWith).toBe("Date")
        })
    })

    describe("duplicate suppression for patriarch birth date", () => {
        it("does not add a second issue for the patriarch's birth date when already reported", () => {
            const patriarch = makePerson("John", null, 1880, {
                Mary: { date: d(1845), person: "Mary" },
                Jane: { date: d(1855), person: "Jane" },
            })
            const wife1 = makePerson("Mary", 1825, 1870, {})
            const wife2 = makePerson("Jane", 1830, 1890, {})

            getMarriageAgeGap(patriarch, wife1)
            getMarriageAgeGap(patriarch, wife2)

            const issues = UserIntervention.getIssues()
            const birthIssues = issues.filter(i => i.reason?.includes("John's birth date"))
            expect(birthIssues).toHaveLength(1)
        })

        it("still records the spouse-specific missing items on subsequent calls", () => {
            const patriarch = makePerson("John", null, 1880, {
                Mary: { date: d(1845), person: "Mary" },
                Jane: { date: null, person: "Jane" },
            })
            const wife1 = makePerson("Mary", 1825, 1870, {})
            const wife2 = makePerson("Jane", 1830, 1890, {})

            getMarriageAgeGap(patriarch, wife1) // adds: patriarch birth
            getMarriageAgeGap(patriarch, wife2) // adds: marriage date for John & Jane (patriarch birth suppressed)

            const issues = UserIntervention.getIssues()
            expect(issues).toHaveLength(2)
            expect(issues[1].reason).toContain("marriage date for John & Jane")
            expect(issues[1].reason).not.toContain("John's birth date")
        })

        it("adds no issue at all when only the patriarch birth is missing and already reported", () => {
            const patriarch = makePerson("John", null, 1880, {
                Mary: { date: d(1845), person: "Mary" },
                Jane: { date: d(1855), person: "Jane" },
            })
            const wife1 = makePerson("Mary", 1825, 1870, {})
            const wife2 = makePerson("Jane", 1830, 1890, {})

            getMarriageAgeGap(patriarch, wife1) // 1 issue: patriarch birth
            const countAfterFirst = UserIntervention.getIssues().length

            getMarriageAgeGap(patriarch, wife2) // patriarch birth suppressed; no other missing → no issue
            expect(UserIntervention.getIssues()).toHaveLength(countAfterFirst)
        })
    })
})
