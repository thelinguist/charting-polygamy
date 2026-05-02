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

// Returns only the spouse-row dim wrappers (not patriarch marriage dim wrappers)
const getSpouseWrappers = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<SVGGElement>('g[style*="transition"]')).filter(g =>
        g.querySelector('[id^="spouse-"]')
    )

// Returns patriarch marriage dim wrappers (g[style*=transition] that don't contain a spouse element)
const getPatriarchMarriageDimWrappers = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<SVGGElement>('g[style*="transition"]')).filter(
        g => !g.querySelector('[id^="spouse-"]')
    )

// Marriage year text appears in both the patriarch row and spouse rows.
// Patriarch marriage groups live inside [id^="patriarch-"], so we scope the search there.
const getPatriarchMarriageGroup = (container: HTMLElement, year: string) => {
    const patriarchEl = container.querySelector("[id^='patriarch-']")
    if (!patriarchEl) return null
    // patriarch-* is now a <g> itself, so go up to its parent to reach the full PersonTimeline container
    const patriarchContainer = patriarchEl.parentElement
    if (!patriarchContainer) return null
    const candidates = Array.from(patriarchContainer.querySelectorAll("text, tspan")).filter(
        el => el.textContent === year
    )
    return candidates.map(el => el.closest<SVGGElement>("g[id]")).find(g => g !== null) ?? null
}

// Returns the linked-marriage <g id> for the named spouse (skips the whisker group whose id is "spouse-*")
const getSpouseLinkedMarriageGroup = (container: HTMLElement, spouseName: string) => {
    const wrapper = getSpouseWrappers(container).find(w => w.querySelector(`[id="spouse-${spouseName}"]`))
    const candidates = Array.from(wrapper?.querySelectorAll<SVGGElement>("g[id]") ?? [])
    return candidates.find(g => !g.id.startsWith("spouse-")) ?? null
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

describe("background click releases pin", () => {
    it("restores all spouses to full opacity when the background is clicked after a patriarch marriage is pinned", () => {
        const { container } = render(
            <PluralFamilyChart width={800} patriarchTimeline={patriarch} timelines={timelines} />
        )

        const marriageGroup = getPatriarchMarriageGroup(container, "1845")!
        fireEvent.click(marriageGroup)
        // confirm it's pinned
        expect(getSpouseWrappers(container)[1].getAttribute("opacity")).toBe("0.15")

        const bg = container.querySelector("svg")!
        fireEvent.click(bg)

        for (const w of getSpouseWrappers(container)) {
            expect(w.getAttribute("opacity")).toBe("1")
        }
    })

    it("restores all spouses when the background is clicked after a spouse marriage is pinned", () => {
        const { container } = render(
            <PluralFamilyChart width={800} patriarchTimeline={patriarch} timelines={timelines} />
        )

        fireEvent.click(getSpouseLinkedMarriageGroup(container, "Wife One")!)
        expect(getSpouseWrappers(container)[1].getAttribute("opacity")).toBe("0.15")

        const bg = container.querySelector("svg")!
        fireEvent.click(bg)

        for (const w of getSpouseWrappers(container)) {
            expect(w.getAttribute("opacity")).toBe("1")
        }
    })
})

describe("spouse linkedMarriage hover behaviour", () => {
    it("dims sibling spouses when Wife One's linked marriage is hovered", () => {
        const { container } = render(
            <PluralFamilyChart width={800} patriarchTimeline={patriarch} timelines={timelines} />
        )
        fireEvent.mouseEnter(getSpouseLinkedMarriageGroup(container, "Wife One")!)
        const [wrapperOne, wrapperTwo] = getSpouseWrappers(container)
        expect(wrapperOne.getAttribute("opacity")).toBe("1")
        expect(wrapperTwo.getAttribute("opacity")).toBe("0.15")
    })

    it("dims sibling spouses when Wife Two's linked marriage is hovered", () => {
        const { container } = render(
            <PluralFamilyChart width={800} patriarchTimeline={patriarch} timelines={timelines} />
        )
        fireEvent.mouseEnter(getSpouseLinkedMarriageGroup(container, "Wife Two")!)
        const [wrapperOne, wrapperTwo] = getSpouseWrappers(container)
        expect(wrapperOne.getAttribute("opacity")).toBe("0.15")
        expect(wrapperTwo.getAttribute("opacity")).toBe("1")
    })

    it("restores all spouses on mouseLeave", () => {
        const { container } = render(
            <PluralFamilyChart width={800} patriarchTimeline={patriarch} timelines={timelines} />
        )
        const group = getSpouseLinkedMarriageGroup(container, "Wife One")!
        fireEvent.mouseEnter(group)
        fireEvent.mouseLeave(group)
        for (const w of getSpouseWrappers(container)) expect(w.getAttribute("opacity")).toBe("1")
    })

    it("dims the patriarch's non-matching marriage when Wife One is hovered", () => {
        const { container } = render(
            <PluralFamilyChart width={800} patriarchTimeline={patriarch} timelines={timelines} />
        )
        fireEvent.mouseEnter(getSpouseLinkedMarriageGroup(container, "Wife One")!)
        const [dimWrapper1845, dimWrapper1860] = getPatriarchMarriageDimWrappers(container)
        expect(dimWrapper1845.getAttribute("opacity")).toBe("1") // Wife One's marriage — stays bright
        expect(dimWrapper1860.getAttribute("opacity")).toBe("0.15") // unrelated marriage — dimmed
    })

    it("dims the patriarch's non-matching marriage when Wife Two is hovered", () => {
        const { container } = render(
            <PluralFamilyChart width={800} patriarchTimeline={patriarch} timelines={timelines} />
        )
        fireEvent.mouseEnter(getSpouseLinkedMarriageGroup(container, "Wife Two")!)
        const [dimWrapper1845, dimWrapper1860] = getPatriarchMarriageDimWrappers(container)
        expect(dimWrapper1845.getAttribute("opacity")).toBe("0.15")
        expect(dimWrapper1860.getAttribute("opacity")).toBe("1")
    })

    it("restores patriarch marriages on mouseLeave", () => {
        const { container } = render(
            <PluralFamilyChart width={800} patriarchTimeline={patriarch} timelines={timelines} />
        )
        const group = getSpouseLinkedMarriageGroup(container, "Wife One")!
        fireEvent.mouseEnter(group)
        fireEvent.mouseLeave(group)
        for (const w of getPatriarchMarriageDimWrappers(container)) expect(w.getAttribute("opacity")).toBe("1")
    })
})
