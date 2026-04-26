import { render, fireEvent } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { PluralFamilyChart } from "."
import { PatriarchTimeline, Timeline } from "lib/src/types"

const patriarch: PatriarchTimeline = {
    name: "John Doe",
    birth: new Date("1820-07-01"),
    death: new Date("1900-07-01"),
    marriages: [{ start: new Date("1845-07-01") }, { start: new Date("1860-07-01") }],
}

const timelines: Timeline[] = [
    {
        name: "Wife One",
        birth: new Date("1825-07-01"),
        death: new Date("1870-07-01"),
        linkedMarriage: { start: new Date("1845-07-01") },
        otherMarriages: [],
    },
    {
        name: "Wife Two",
        birth: new Date("1835-07-01"),
        death: new Date("1910-07-01"),
        linkedMarriage: { start: new Date("1860-07-01") },
        otherMarriages: [],
    },
]

// Returns the outermost dim-wrapper <g> for each spouse, in render order
const getSpouseWrappers = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<SVGGElement>('g[style*="transition"]'))

// Marriage year text appears in both the patriarch row and the spouse row.
// The patriarch's marriage <g id="..."> is NOT nested inside a dim-wrapper.
const getPatriarchMarriageGroup = (container: HTMLElement, year: string) => {
    const candidates = Array.from(container.querySelectorAll("text, tspan")).filter(el => el.textContent === year)
    return (
        candidates.map(el => el.closest<SVGGElement>("g[id]")).find(g => g && !g.closest('g[style*="transition"]')) ??
        null
    )
}

describe("PluralFamilyChart dim behaviour", () => {
    it("all spouse wrappers start at full opacity", () => {
        const { container } = render(
            <PluralFamilyChart width={800} patriarchTimeline={patriarch} timelines={timelines} />
        )
        const wrappers = getSpouseWrappers(container)
        expect(wrappers).toHaveLength(2)
        for (const w of wrappers) {
            expect(w.getAttribute("opacity")).toBe("1")
        }
    })

    it("dims non-selected spouses when a patriarch marriage is hovered", () => {
        const { container } = render(
            <PluralFamilyChart width={800} patriarchTimeline={patriarch} timelines={timelines} />
        )

        // hover the first patriarch marriage (1845 = Wife One)
        const marriageGroup = getPatriarchMarriageGroup(container, "1845")!
        fireEvent.mouseEnter(marriageGroup)

        const [wrapperOne, wrapperTwo] = getSpouseWrappers(container)
        expect(wrapperOne.getAttribute("opacity")).toBe("1") // Wife One is active
        expect(wrapperTwo.getAttribute("opacity")).toBe("0.15") // Wife Two is dimmed
    })

    it("dims the correct spouse when the second marriage is hovered", () => {
        const { container } = render(
            <PluralFamilyChart width={800} patriarchTimeline={patriarch} timelines={timelines} />
        )

        const marriageGroup = getPatriarchMarriageGroup(container, "1860")!
        fireEvent.mouseEnter(marriageGroup)

        const [wrapperOne, wrapperTwo] = getSpouseWrappers(container)
        expect(wrapperOne.getAttribute("opacity")).toBe("0.15") // Wife One is dimmed
        expect(wrapperTwo.getAttribute("opacity")).toBe("1") // Wife Two is active
    })

    it("restores all spouses to full opacity on mouseLeave", () => {
        const { container } = render(
            <PluralFamilyChart width={800} patriarchTimeline={patriarch} timelines={timelines} />
        )

        const marriageGroup = getPatriarchMarriageGroup(container, "1845")!
        fireEvent.mouseEnter(marriageGroup)
        fireEvent.mouseLeave(marriageGroup)

        const wrappers = getSpouseWrappers(container)
        for (const w of wrappers) {
            expect(w.getAttribute("opacity")).toBe("1")
        }
    })

    it("keeps the selected spouse active after a click, even without hover", () => {
        const { container } = render(
            <PluralFamilyChart width={800} patriarchTimeline={patriarch} timelines={timelines} />
        )

        const marriageGroup = getPatriarchMarriageGroup(container, "1845")!
        fireEvent.click(marriageGroup)
        fireEvent.mouseLeave(marriageGroup)

        const [wrapperOne, wrapperTwo] = getSpouseWrappers(container)
        expect(wrapperOne.getAttribute("opacity")).toBe("1") // pinned active
        expect(wrapperTwo.getAttribute("opacity")).toBe("0.15")
    })

    it("unpins on second click and restores all to full opacity", () => {
        const { container } = render(
            <PluralFamilyChart width={800} patriarchTimeline={patriarch} timelines={timelines} />
        )

        const marriageGroup = getPatriarchMarriageGroup(container, "1845")!
        fireEvent.click(marriageGroup)
        fireEvent.click(marriageGroup)

        const wrappers = getSpouseWrappers(container)
        for (const w of wrappers) {
            expect(w.getAttribute("opacity")).toBe("1")
        }
    })
})
