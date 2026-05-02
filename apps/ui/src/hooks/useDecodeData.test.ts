import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useDecodeData, DecodeStatus } from "./useDecodeData"
import * as shareUrl from "../lib/shareUrl"
import { PatriarchData } from "lib"

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

describe("useDecodeData", () => {
    it("starts in LOADING state when encoded string is provided", () => {
        vi.spyOn(shareUrl, "decodePatriarchData").mockResolvedValue({ name: "Thomas Harlow", data: mockData })

        const { result } = renderHook(() => useDecodeData("someencoded"))

        expect(result.current.state.status).toBe(DecodeStatus.LOADING)
    })

    it("starts in ERROR state when no encoded string is provided", () => {
        const { result } = renderHook(() => useDecodeData(null))

        expect(result.current.state.status).toBe(DecodeStatus.ERROR)
    })

    it("transitions to READY state with decoded name and data on success", async () => {
        vi.spyOn(shareUrl, "decodePatriarchData").mockResolvedValue({ name: "Thomas Harlow", data: mockData })

        const { result } = renderHook(() => useDecodeData("someencoded"))

        await waitFor(() => expect(result.current.state.status).toBe(DecodeStatus.READY))

        const state = result.current.state
        if (state.status !== DecodeStatus.READY) throw new Error("Expected READY")
        expect(state.name).toBe("Thomas Harlow")
        expect(state.data).toBe(mockData)
    })

    it("transitions to ERROR state when decoding fails", async () => {
        vi.spyOn(shareUrl, "decodePatriarchData").mockRejectedValue(new Error("corrupt"))

        const { result } = renderHook(() => useDecodeData("baddata"))

        await waitFor(() => expect(result.current.state.status).toBe(DecodeStatus.ERROR))
    })

    it("calls decodePatriarchData with the provided encoded string", async () => {
        const spy = vi
            .spyOn(shareUrl, "decodePatriarchData")
            .mockResolvedValue({ name: "Thomas Harlow", data: mockData })

        renderHook(() => useDecodeData("abc123"))

        await waitFor(() => expect(spy).toHaveBeenCalledWith("abc123"))
    })

    it("does not call decodePatriarchData when encoded is null", () => {
        const spy = vi.spyOn(shareUrl, "decodePatriarchData")

        renderHook(() => useDecodeData(null))

        expect(spy).not.toHaveBeenCalled()
    })
})
