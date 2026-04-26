import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import { Timelines } from "./Timelines"
import { Statistics } from "lib/src/types"
import { example3WivesChartData } from "../constants/sample"

// eslint-disable-next-line react/display-name
vi.mock("./Timeline2", () => ({ Timeline2: ({ name }) => <div>{name}</div> }))

describe("Timelines", () => {
    it("should render placeholder when no chartData", () => {
        const { getByText } = render(<Timelines chartData={{}} />)
        expect(getByText("graphs will go here")).toBeTruthy()
    })

    it("should render timelines from chartData", () => {
        const { getByText } = render(<Timelines chartData={example3WivesChartData} />)
        expect(getByText("Patriarch")).toBeTruthy()
    })

    it.skip("should render stats", () => {
        const stats: Statistics = {
            polygamousFamilies: 1,
            eligiblePatriarchs: 1,
            illegallyMarriedPatriarchs: 0,
            patriarchCount: 1,
        }
        const { getByText } = render(<Timelines chartData={{}} stats={stats} />)
        expect(getByText("Statistics")).toBeTruthy()
        expect(getByText("Number of polygamous families: 1")).toBeTruthy()
    })
})
