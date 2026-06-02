import { useState } from "react"

export interface TooltipState<T> {
    x: number
    y: number
    data: T
}

export function useChartTooltip<T>() {
    const [tooltip, setTooltip] = useState<TooltipState<T> | null>(null)

    function showTooltip(x: number, y: number, data: T) {
        setTooltip({ x, y, data })
    }

    function hideTooltip() {
        setTooltip(null)
    }

    function tooltipHandlers(x: number, y: number, data: T) {
        return {
            onMouseEnter: () => showTooltip(x, y, data),
            onMouseLeave: hideTooltip,
            onTouchStart: (e: React.TouchEvent) => {
                e.preventDefault()
                showTooltip(x, y, data)
            },
            onTouchEnd: hideTooltip,
        }
    }

    return { tooltip, showTooltip, hideTooltip, tooltipHandlers }
}
