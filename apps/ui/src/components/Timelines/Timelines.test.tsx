import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { Timelines } from "./Timelines"
import { example3WivesChartData } from "../../app/chart/upload/constants/sample"

vi.mock("../../hooks/useIsMobile.ts", () => ({ useIsMobile: () => false }))
describe("Timelines", () => {
    it("should render placeholder when no chartData", () => {
        render(<Timelines chartData={{}} />)
        expect(screen.getByText("graphs will go here")).toBeTruthy()
    })

    it("should render timelines from chartData", () => {
        render(<Timelines chartData={example3WivesChartData} />)
        expect(screen.getAllByText("Patriarch")).toBeTruthy()
    })
})
