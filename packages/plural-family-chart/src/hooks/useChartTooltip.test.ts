import { renderHook, act } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { useChartTooltip } from "./useChartTooltip"

describe("useChartTooltip", () => {
    it("starts with no tooltip", () => {
        const { result } = renderHook(() => useChartTooltip<string>())
        expect(result.current.tooltip).toBeNull()
    })

    describe("showTooltip", () => {
        it("sets x, y, and data", () => {
            const { result } = renderHook(() => useChartTooltip<string>())
            act(() => result.current.showTooltip(10, 20, "hello"))
            expect(result.current.tooltip).toEqual({ x: 10, y: 20, data: "hello" })
        })

        it("replaces an existing tooltip", () => {
            const { result } = renderHook(() => useChartTooltip<number>())
            act(() => result.current.showTooltip(1, 2, 100))
            act(() => result.current.showTooltip(3, 4, 200))
            expect(result.current.tooltip).toEqual({ x: 3, y: 4, data: 200 })
        })

        it("works with object data", () => {
            const { result } = renderHook(() => useChartTooltip<{ x0: number; x1: number }>())
            act(() => result.current.showTooltip(5, 15, { x0: 10, x1: 20 }))
            expect(result.current.tooltip?.data).toEqual({ x0: 10, x1: 20 })
        })
    })

    describe("hideTooltip", () => {
        it("clears the tooltip", () => {
            const { result } = renderHook(() => useChartTooltip<string>())
            act(() => result.current.showTooltip(10, 20, "hi"))
            act(() => result.current.hideTooltip())
            expect(result.current.tooltip).toBeNull()
        })

        it("is a no-op when already null", () => {
            const { result } = renderHook(() => useChartTooltip<string>())
            act(() => result.current.hideTooltip())
            expect(result.current.tooltip).toBeNull()
        })
    })

    describe("tooltipHandlers", () => {
        it("onMouseEnter shows the tooltip", () => {
            const { result } = renderHook(() => useChartTooltip<string>())
            const handlers = result.current.tooltipHandlers(8, 16, "data")
            act(() => handlers.onMouseEnter())
            expect(result.current.tooltip).toEqual({ x: 8, y: 16, data: "data" })
        })

        it("onMouseLeave hides the tooltip", () => {
            const { result } = renderHook(() => useChartTooltip<string>())
            act(() => result.current.showTooltip(8, 16, "data"))
            const handlers = result.current.tooltipHandlers(8, 16, "data")
            act(() => handlers.onMouseLeave())
            expect(result.current.tooltip).toBeNull()
        })

        it("onTouchStart calls preventDefault and shows the tooltip", () => {
            const { result } = renderHook(() => useChartTooltip<string>())
            const handlers = result.current.tooltipHandlers(5, 10, "touch")
            const fakeEvent = { preventDefault: vi.fn() } as unknown as React.TouchEvent
            act(() => handlers.onTouchStart(fakeEvent))
            expect(fakeEvent.preventDefault).toHaveBeenCalledOnce()
            expect(result.current.tooltip).toEqual({ x: 5, y: 10, data: "touch" })
        })

        it("onTouchEnd hides the tooltip", () => {
            const { result } = renderHook(() => useChartTooltip<string>())
            act(() => result.current.showTooltip(5, 10, "touch"))
            const handlers = result.current.tooltipHandlers(5, 10, "touch")
            act(() => handlers.onTouchEnd())
            expect(result.current.tooltip).toBeNull()
        })

        it("captures x, y, data at call time", () => {
            const { result } = renderHook(() => useChartTooltip<number>())
            // handlers are created with 1, 2, 42 but we don't fire them yet
            const handlers = result.current.tooltipHandlers(1, 2, 42)
            // fire with original captured values
            act(() => handlers.onMouseEnter())
            expect(result.current.tooltip).toEqual({ x: 1, y: 2, data: 42 })
        })
    })
})
