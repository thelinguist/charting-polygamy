import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Spouse } from "."
import { PatriarchTimeline, Timeline } from "lib/src/types"
import { PositionScale } from "@visx/shape/lib/types"

const wrap = (ui: React.ReactElement) => render(<svg>{ui}</svg>)

const xScale = (date: Date) => date.getFullYear() - 1800
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const yScale = (_name: string) => 50

const patriarch: PatriarchTimeline = {
    name: "Patriarch",
    birth: new Date("1817-05-03"),
    death: new Date("1881-07-09"),
    marriages: [{ start: new Date("1841-02-23") }],
}

const wife: Timeline = {
    name: "Jane Doe",
    birth: new Date("1826-01-14"),
    death: new Date("1891-03-10"),
    linkedMarriage: {
        start: new Date("1841-02-23"),
        end: new Date("1881-06-01"),
    },
    otherMarriages: [],
}

describe("Spouse", () => {
    it("renders the life bar", () => {
        const { container } = wrap(
            <Spouse patriarchTimeline={patriarch} timeline={wife} xScale={xScale} yScale={yScale as PositionScale} />
        )
        expect(container.querySelector("#spouse-Jane\\ Doe")).toBeTruthy()
    })

    it("renders the birth year label", () => {
        const { getByText } = wrap(
            <Spouse patriarchTimeline={patriarch} timeline={wife} xScale={xScale} yScale={yScale as PositionScale} />
        )
        expect(getByText("1826")).toBeTruthy()
    })

    it("renders the marriage start year when linkedStart is present", () => {
        const { getByText } = wrap(
            <Spouse patriarchTimeline={patriarch} timeline={wife} xScale={xScale} yScale={yScale as PositionScale} />
        )
        expect(getByText("1841")).toBeTruthy()
    })

    it("renders the marriage age text", () => {
        const { getByText } = wrap(
            <Spouse patriarchTimeline={patriarch} timeline={wife} xScale={xScale} yScale={yScale as PositionScale} />
        )
        expect(getByText("15 years old")).toBeTruthy()
    })

    it("renders the life bar even when linkedStart is missing", () => {
        const noStartWife: Timeline = {
            ...wife,
            linkedMarriage: { end: new Date("1853-03-07") } as any,
        }
        const { container } = wrap(
            <Spouse
                patriarchTimeline={patriarch}
                timeline={noStartWife}
                xScale={xScale}
                yScale={yScale as PositionScale}
            />
        )
        expect(container.querySelector("#spouse-Jane\\ Doe")).toBeTruthy()
    })

    it("does not render a marriage bar when linkedStart is missing", () => {
        const noStartWife: Timeline = {
            ...wife,
            linkedMarriage: { end: new Date("1853-03-07") } as any,
        }
        const { queryByText } = wrap(
            <Spouse
                patriarchTimeline={patriarch}
                timeline={noStartWife}
                xScale={xScale}
                yScale={yScale as PositionScale}
            />
        )
        expect(queryByText("1841")).toBeNull()
    })

    describe("dim prop", () => {
        it("renders at full opacity when dim is false", () => {
            const { container } = wrap(
                <Spouse
                    patriarchTimeline={patriarch}
                    timeline={wife}
                    xScale={xScale}
                    yScale={yScale as PositionScale}
                    dim={false}
                />
            )
            const wrapper = container.querySelector('g[style*="transition"]')
            expect(wrapper?.getAttribute("opacity")).toBe("1")
        })

        it("renders at full opacity when dim is omitted", () => {
            const { container } = wrap(
                <Spouse
                    patriarchTimeline={patriarch}
                    timeline={wife}
                    xScale={xScale}
                    yScale={yScale as PositionScale}
                />
            )
            const wrapper = container.querySelector('g[style*="transition"]')
            expect(wrapper?.getAttribute("opacity")).toBe("1")
        })

        it("renders at reduced opacity when dim is true", () => {
            const { container } = wrap(
                <Spouse
                    patriarchTimeline={patriarch}
                    timeline={wife}
                    xScale={xScale}
                    yScale={yScale as PositionScale}
                    dim={true}
                />
            )
            const wrapper = container.querySelector('g[style*="transition"]')
            expect(wrapper?.getAttribute("opacity")).toBe("0.15")
        })
    })

    it("renders other marriages", () => {
        const wifeWithOther: Timeline = {
            ...wife,
            otherMarriages: [{ start: new Date("1900-07-01"), end: new Date("1910-07-01"), spouse: "Other Male" }],
        }
        const { getByText } = wrap(
            <Spouse
                patriarchTimeline={patriarch}
                timeline={wifeWithOther}
                xScale={xScale}
                yScale={yScale as PositionScale}
            />
        )
        expect(getByText("1900")).toBeTruthy()
        expect(getByText("Other Male")).toBeTruthy()
    })
})
