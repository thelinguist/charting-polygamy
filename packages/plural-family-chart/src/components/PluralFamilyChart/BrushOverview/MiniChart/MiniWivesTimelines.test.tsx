import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MiniWivesTimelines } from "./MiniWivesTimelines"
import { scaleUtc } from "@visx/scale"

const chartStart = new Date("1820-07-01")
const chartEnd = new Date("1900-07-01")
const xScale = scaleUtc({ domain: [chartStart, chartEnd], range: [0, 600] })

const patriarchDeath = new Date("1900-07-01")
const patriarchDeathMs = patriarchDeath.getTime()

const rowHeight = 10
const barH = 6

const wrap = (ui: React.ReactElement) => render(<svg>{ui}</svg>)

describe("MiniWivesTimelines", () => {
    it("renders a rect when linkedMarriage has no end date and wife has no death date", () => {
        const timelines = [
            {
                name: "Wife One",
                linkedMarriage: { start: new Date("1845-07-01") },
            },
        ]
        const { container } = wrap(
            <MiniWivesTimelines
                timelines={timelines}
                patriarchDeathMs={patriarchDeathMs}
                rowHeight={rowHeight}
                barH={barH}
                xScale={xScale}
            />
        )
        expect(container.querySelectorAll("rect")).toHaveLength(1)
    })

    it("uses patriarch death as the end when linkedMarriage.end and wife death are both absent", () => {
        const marriageStart = new Date("1845-07-01")
        const timelines = [
            {
                name: "Wife One",
                linkedMarriage: { start: marriageStart },
            },
        ]
        const { container } = wrap(
            <MiniWivesTimelines
                timelines={timelines}
                patriarchDeathMs={patriarchDeathMs}
                rowHeight={rowHeight}
                barH={barH}
                xScale={xScale}
            />
        )
        const rect = container.querySelector("rect")!
        const expectedX = xScale(marriageStart) as number
        const expectedW = (xScale(patriarchDeath) as number) - expectedX
        expect(Number(rect.getAttribute("x"))).toBeCloseTo(expectedX)
        expect(Number(rect.getAttribute("width"))).toBeCloseTo(expectedW)
    })

    it("uses wife death as the end when it precedes patriarch death and linkedMarriage.end is absent", () => {
        const wifeDeath = new Date("1870-07-01")
        const marriageStart = new Date("1845-07-01")
        const timelines = [
            {
                name: "Wife One",
                death: wifeDeath,
                linkedMarriage: { start: marriageStart },
            },
        ]
        const { container } = wrap(
            <MiniWivesTimelines
                timelines={timelines}
                patriarchDeathMs={patriarchDeathMs}
                rowHeight={rowHeight}
                barH={barH}
                xScale={xScale}
            />
        )
        const rect = container.querySelector("rect")!
        const expectedW = (xScale(wifeDeath) as number) - (xScale(marriageStart) as number)
        expect(Number(rect.getAttribute("width"))).toBeCloseTo(expectedW)
    })

    it("renders nothing and does not produce NaN when linkedMarriage.start is undefined", () => {
        const timelines = [
            {
                name: "Wife One",
                linkedMarriage: { start: undefined as unknown as Date },
            },
        ]
        const { container } = wrap(
            <MiniWivesTimelines
                timelines={timelines}
                patriarchDeathMs={patriarchDeathMs}
                rowHeight={rowHeight}
                barH={barH}
                xScale={xScale}
            />
        )
        expect(container.querySelectorAll("rect")).toHaveLength(0)
    })

    it("renders nothing for a timeline whose end cannot be determined (no end, no death, no patriarch death)", () => {
        // Simulates a hypothetical case where patriarchDeathMs is Infinity
        const timelines = [
            {
                name: "Wife One",
                linkedMarriage: { start: new Date("1845-07-01") },
            },
        ]
        const { container } = wrap(
            <MiniWivesTimelines
                timelines={timelines}
                patriarchDeathMs={Infinity}
                rowHeight={rowHeight}
                barH={barH}
                xScale={xScale}
            />
        )
        expect(container.querySelectorAll("rect")).toHaveLength(0)
    })
})