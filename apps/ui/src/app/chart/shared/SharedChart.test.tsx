import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { SharedChart } from "./SharedChart"
import { DecodeStatus } from "../../../hooks/useDecodeData"

vi.mock("next/link", () => ({
    default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
        <a href={href} className={className}>
            {children}
        </a>
    ),
}))

vi.mock("../../../components/Timelines/TimelineComponent", () => ({
    TimelineComponent: ({ name }: { name: string }) => <div data-testid="timeline">{name}</div>,
}))

vi.mock("../../../hooks/useDecodeData")

import { useDecodeData } from "../../../hooks/useDecodeData"
const mockUseDecodeData = vi.mocked(useDecodeData)

afterEach(cleanup)
beforeEach(() => {
    vi.clearAllMocks()
})

describe("SharedChart", () => {
    it("renders a loading placeholder while decoding", () => {
        mockUseDecodeData.mockReturnValue({ state: { status: DecodeStatus.LOADING } })
        render(<SharedChart encoded="somedata" />)
        expect(screen.getByText("Loading chart...")).toBeTruthy()
    })

    it("shows a corrupted-link error when encoded data is present but fails", () => {
        mockUseDecodeData.mockReturnValue({ state: { status: DecodeStatus.ERROR } })
        render(<SharedChart encoded="baddata" />)
        expect(screen.getByText("This chart link is invalid or corrupted.")).toBeTruthy()
    })

    it("shows a no-data error when no encoded string is provided", () => {
        mockUseDecodeData.mockReturnValue({ state: { status: DecodeStatus.ERROR } })
        render(<SharedChart encoded={null} />)
        expect(screen.getByText("No chart data found in this link.")).toBeTruthy()
    })

    it("renders the TimelineComponent with the decoded name when ready", () => {
        const mockData = {
            patriarchTimeline: {
                name: "Brigham Young",
                birth: new Date(1801, 5, 1),
                death: new Date(1877, 7, 29),
                marriages: [],
            },
            timelines: [],
        }
        mockUseDecodeData.mockReturnValue({
            state: {
                status: DecodeStatus.READY,
                name: "Brigham Young",
                data: mockData,
            },
        })
        render(<SharedChart encoded="validdata" />)
        expect(screen.getByText("Brigham Young")).toBeTruthy()
    })

    it("renders the CTA section with upload links when data is ready", () => {
        const mockData = {
            patriarchTimeline: {
                name: "Brigham Young",
                birth: new Date(1801, 5, 1),
                death: new Date(1877, 7, 29),
                marriages: [],
            },
            timelines: [],
        }
        mockUseDecodeData.mockReturnValue({
            state: {
                status: DecodeStatus.READY,
                name: "Brigham Young",
                data: mockData,
            },
        })
        render(<SharedChart encoded="validdata" />)
        expect(screen.getByText("This chart was generated with Charting Polygamy.")).toBeTruthy()
        const links = screen.getAllByRole("link")
        expect(links.length).toBeGreaterThan(0)
    })

    it("renders an upload link in the error state", () => {
        mockUseDecodeData.mockReturnValue({ state: { status: DecodeStatus.ERROR } })
        render(<SharedChart encoded="baddata" />)
        expect(screen.getByRole("link", { name: /create your own chart/i })).toBeTruthy()
    })
})