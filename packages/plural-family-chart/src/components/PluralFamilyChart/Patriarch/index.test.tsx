import { render, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Patriarch } from "."
import { PatriarchTimeline, Timeline } from "lib/src/types"
import { scaleOrdinal } from "@visx/scale"

const wrap = (ui: React.ReactElement) => render(<svg>{ui}</svg>)

const xScale = (date: Date) => date.getFullYear() - 1800

// AreaClosed (used inside PersonTimeline for the patriarch) requires a real scale with .range()
const makeYScale = (names: string[]) => scaleOrdinal({ domain: names, range: names.map((_, i) => i * 30) })

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

const names = [patriarch.name, ...timelines.map(t => t.name)]
const yScale = makeYScale(names)

const defaultProps = {
    patriarchTimeline: patriarch,
    timelines,
    xScale,
    yScale,
    expandedIndex: null as number | null,
    handleClick: vi.fn(),
    setHoveredIndex: vi.fn(),
}

const getMarriageDimWrappers = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<SVGGElement>('g[style*="transition"]'))

describe("Patriarch", () => {
    it("renders a marriage bar for each marriage with a start date", () => {
        const { getByText } = wrap(<Patriarch {...defaultProps} />)
        expect(getByText("1845")).toBeTruthy()
        expect(getByText("1860")).toBeTruthy()
    })

    describe("handleClick", () => {
        it("calls handleClick with index 0 when the first marriage is clicked", () => {
            const handleClick = vi.fn()
            const { getByText } = wrap(<Patriarch {...defaultProps} handleClick={handleClick} />)
            const group = getByText("1845").closest("g[id]")!
            fireEvent.click(group)
            expect(handleClick).toHaveBeenCalledWith(0)
        })

        it("calls handleClick with index 1 when the second marriage is clicked", () => {
            const handleClick = vi.fn()
            const { getByText } = wrap(<Patriarch {...defaultProps} handleClick={handleClick} />)
            const group = getByText("1860").closest("g[id]")!
            fireEvent.click(group)
            expect(handleClick).toHaveBeenCalledWith(1)
        })
    })

    describe("highlightedMarriageStart", () => {
        it("all marriages at full opacity when prop is not set", () => {
            const { container } = wrap(<Patriarch {...defaultProps} />)
            const wrappers = getMarriageDimWrappers(container)
            expect(wrappers).toHaveLength(2)
            for (const w of wrappers) expect(w.getAttribute("opacity")).toBe("1")
        })

        it("dims the non-matching marriage when the first marriage start is highlighted", () => {
            const { container } = wrap(
                <Patriarch {...{ ...defaultProps, highlightedMarriageStart: new Date("1845-07-01") }} />
            )
            const [first, second] = getMarriageDimWrappers(container)
            expect(first.getAttribute("opacity")).toBe("1")
            expect(second.getAttribute("opacity")).toBe("0.15")
        })

        it("dims the non-matching marriage when the second marriage start is highlighted", () => {
            const { container } = wrap(
                <Patriarch {...{ ...defaultProps, highlightedMarriageStart: new Date("1860-07-01") }} />
            )
            const [first, second] = getMarriageDimWrappers(container)
            expect(first.getAttribute("opacity")).toBe("0.15")
            expect(second.getAttribute("opacity")).toBe("1")
        })
    })

    describe("setHoveredIndex", () => {
        it("calls setHoveredIndex with index 0 on mouseEnter of the first marriage", () => {
            const setHoveredIndex = vi.fn()
            const { getByText } = wrap(<Patriarch {...defaultProps} setHoveredIndex={setHoveredIndex} />)
            const group = getByText("1845").closest("g[id]")!
            fireEvent.mouseEnter(group)
            expect(setHoveredIndex).toHaveBeenCalledWith(0)
        })

        it("calls setHoveredIndex with index 1 on mouseEnter of the second marriage", () => {
            const setHoveredIndex = vi.fn()
            const { getByText } = wrap(<Patriarch {...defaultProps} setHoveredIndex={setHoveredIndex} />)
            const group = getByText("1860").closest("g[id]")!
            fireEvent.mouseEnter(group)
            expect(setHoveredIndex).toHaveBeenCalledWith(1)
        })

        it("calls setHoveredIndex with null on mouseLeave", () => {
            const setHoveredIndex = vi.fn()
            const { getByText } = wrap(<Patriarch {...defaultProps} setHoveredIndex={setHoveredIndex} />)
            const group = getByText("1845").closest("g[id]")!
            fireEvent.mouseLeave(group)
            expect(setHoveredIndex).toHaveBeenCalledWith(null)
        })
    })
})
