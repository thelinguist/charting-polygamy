import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import { Timelines } from "./Timelines"
import { Statistics } from "lib/src/types"

// eslint-disable-next-line react/display-name
vi.mock("./Mermaid", () => ({ Mermaid: () => <div>mermaid</div> }))

describe("Timelines", () => {
    it("should render placeholder", () => {
        const timelines = {}
        const stats = {} as Statistics
        const { getByText } = render(<Timelines timelines={timelines} stats={stats} />)
        expect(getByText("graphs will go here")).toBeTruthy()
    })

    it("should render timelines", () => {
        const timelines = { test: "test" }
        const stats = {} as Statistics
        const { getByText } = render(<Timelines timelines={timelines} stats={stats} />)
        expect(getByText("test")).toBeTruthy()
    })

    // TODO this is not working
    it.skip("should render stats", () => {
        const timelines = {}
        const stats = {
            polygamousFamilies: 1,
            eligiblePatriarchs: 1,
            illegallyMarriedPatriarchs: 0,
            patriarchCount: 1,
        }
        const { getByText } = render(<Timelines timelines={timelines} stats={stats} />)
        expect(getByText("Statistics")).toBeTruthy()
        expect(getByText("Number of polygamous families: 1")).toBeTruthy()
    })
})
