import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { BrushOverview } from "."
import { scaleUtc } from "@visx/scale"
import { PatriarchTimeline, Timeline } from "lib/src/types"

const patriarch: PatriarchTimeline = {
    name: "John",
    birth: new Date("1820-07-01"),
    death: new Date("1900-07-01"),
    marriages: [
        { start: new Date("1845-07-01"), end: new Date("1870-07-01") },
        { start: new Date("1860-07-01"), end: new Date("1900-07-01") },
    ],
}

const timelines: Timeline[] = [
    {
        name: "Wife One",
        birth: new Date("1825-07-01"),
        death: new Date("1875-07-01"),
        linkedMarriage: { start: new Date("1845-07-01"), end: new Date("1870-07-01") },
        otherMarriages: [],
    },
    {
        name: "Wife Two",
        birth: new Date("1835-07-01"),
        death: new Date("1905-07-01"),
        linkedMarriage: { start: new Date("1860-07-01"), end: new Date("1900-07-01") },
        otherMarriages: [],
    },
]

const chartStart = new Date("1820-07-01")
const chartEnd = new Date("1905-07-01")
const width = 600

const xScale = scaleUtc({ domain: [chartStart, chartEnd], range: [0, width] })

const defaultProps = {
    xScale,
    width,
    height: 40,
    patriarchTimeline: patriarch,
    timelines,
    onChange: vi.fn(),
}

describe("BrushOverview", () => {
    it("renders without crashing when initialDomain is omitted", () => {
        const { container } = render(
            <svg>
                <BrushOverview {...defaultProps} />
            </svg>
        )
        expect(container.querySelector("svg")).toBeTruthy()
    })

    it("renders without crashing when initialDomain is provided", () => {
        const initialDomain: [Date, Date] = [new Date("1840-07-01"), new Date("1890-07-01")]
        const { container } = render(
            <svg>
                <BrushOverview {...defaultProps} initialDomain={initialDomain} />
            </svg>
        )
        expect(container.querySelector("svg")).toBeTruthy()
    })

    it("renders without crashing when initialDomain is null", () => {
        const { container } = render(
            <svg>
                <BrushOverview {...defaultProps} initialDomain={null} />
            </svg>
        )
        expect(container.querySelector("svg")).toBeTruthy()
    })

    it("renders a rect for each person's life span in the mini chart", () => {
        const { container } = render(
            <svg>
                <BrushOverview {...defaultProps} />
            </svg>
        )
        // patriarch + 2 wives = 3 life-span rects; plus marriage overlay rects on top
        const rects = container.querySelectorAll("rect")
        expect(rects.length).toBeGreaterThanOrEqual(3)
    })
})
