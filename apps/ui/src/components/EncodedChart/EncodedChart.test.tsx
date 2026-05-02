import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { EncodedChart } from "./EncodedChart"
import * as shareUrl from "../../lib/shareUrl"
import { PatriarchData } from "lib"

vi.mock("../../hooks/useIsMobile.ts", () => ({ useIsMobile: () => false }))

vi.mock("plural-family-chart", () => ({
    PluralFamilyChart: ({ patriarchTimeline }: { patriarchTimeline: { name: string } }) => (
        <figure aria-label={patriarchTimeline.name}>{patriarchTimeline.name}</figure>
    ),
}))

const mockData: PatriarchData = {
    patriarchTimeline: {
        name: "Thomas Harlow",
        birth: new Date(1822, 0, 1),
        death: new Date(1891, 0, 1),
        marriages: [{ start: new Date(1845, 0, 1) }],
    },
    timelines: [],
}

beforeEach(() => {
    vi.restoreAllMocks()
})

describe("EncodedChart", () => {
    it("shows loading state initially", () => {
        vi.spyOn(shareUrl, "decodePatriarchData").mockResolvedValue({ name: "Thomas Harlow", data: mockData })

        render(<EncodedChart encodedData="someencoded" />)

        expect(screen.getByText("Loading…")).toBeTruthy()
    })

    it("shows error state when decoding fails", async () => {
        vi.spyOn(shareUrl, "decodePatriarchData").mockRejectedValue(new Error("corrupt"))

        render(<EncodedChart encodedData="baddata" />)

        await waitFor(() => expect(screen.getByText("Chart data could not be loaded.")).toBeTruthy())
    })

    it("renders the chart after successful decode", async () => {
        vi.spyOn(shareUrl, "decodePatriarchData").mockResolvedValue({ name: "Thomas Harlow", data: mockData })

        render(<EncodedChart encodedData="someencoded" />)

        await waitFor(() => expect(screen.getByRole("figure", { name: "Thomas Harlow" })).toBeTruthy())
    })

    it("shows loading text before decode resolves", () => {
        vi.spyOn(shareUrl, "decodePatriarchData").mockResolvedValue({ name: "Thomas Harlow", data: mockData })

        const { getByText } = render(<EncodedChart encodedData="someencoded" />)

        expect(getByText("Loading…")).toBeTruthy()
    })
})
