import React, { useCallback } from "react"
import { Brush } from "@visx/brush"
import type { Bounds, Scale } from "@visx/brush/lib/types"
import { scaleLinear, scaleUtc } from "@visx/scale"
import { PatriarchTimeline, Timeline } from "lib/src/types"
import { MiniChart } from "./MiniChart"

const brushStyle = {
    fill: "#7986cb",
    fillOpacity: 0.2,
    stroke: "#7986cb",
    strokeWidth: 1,
}

interface Props {
    xScale: ReturnType<typeof scaleUtc>
    width: number
    height: number
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
    onChange: (domain: [Date, Date] | null) => void
}

export const BrushOverview: React.FC<Props> = ({ xScale, width, height, patriarchTimeline, timelines, onChange }) => {
    const people = [patriarchTimeline, ...timelines]
    const rowHeight = height / people.length
    const barH = Math.max(3, rowHeight - 4)
    const yScale = scaleLinear({ domain: [0, 1], range: [0, height] })

    const handleChange = useCallback(
        (bounds: Bounds | null) => {
            if (!bounds) {
                onChange(null)
                return
            }
            onChange([new Date(bounds.x0), new Date(bounds.x1)])
        },
        [onChange]
    )

    return (
        <>
            <MiniChart
                xScale={xScale as Scale}
                patriarchTimeline={patriarchTimeline}
                barH={barH}
                timelines={timelines}
                people={people}
                rowHeight={rowHeight}
            />
            <Brush
                xScale={xScale as Scale}
                yScale={yScale}
                width={width}
                height={height}
                handleSize={8}
                resizeTriggerAreas={["left", "right"]}
                brushDirection="horizontal"
                initialBrushPosition={{ start: { x: 0 }, end: { x: width } }}
                onChange={handleChange}
                onClick={() => onChange(null)}
                selectedBoxStyle={brushStyle}
                renderBrushHandle={({ x, height: h }) => (
                    <rect
                        x={x}
                        y={(h - 20) / 2}
                        width={8}
                        height={20}
                        fill="#7986cb"
                        rx={3}
                        style={{ cursor: "ew-resize" }}
                    />
                )}
                useWindowMoveEvents
            />
        </>
    )
}
