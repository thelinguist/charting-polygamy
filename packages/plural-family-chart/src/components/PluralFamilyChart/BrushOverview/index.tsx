import React, { useCallback } from "react"
import { Brush } from "@visx/brush"
import type { Bounds } from "@visx/brush/lib/types"
import { scaleLinear, scaleUtc } from "@visx/scale"
import { PatriarchTimeline, Timeline } from "lib/src/types"
import { patriarchColor, spouseColor } from "../constants"

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
            {people.map((person, i) => {
                if (!person.birth || !person.death) return null
                const x = xScale(person.birth)
                const w = Math.max(0, xScale(person.death) - x)
                const y = i * rowHeight + (rowHeight - barH) / 2
                return (
                    <rect
                        key={person.name}
                        x={x}
                        y={y}
                        width={w}
                        height={barH}
                        fill={i === 0 ? patriarchColor : spouseColor}
                        rx={1}
                    />
                )
            })}
            <Brush
                xScale={xScale}
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
                useWindowMoveEvents
            />
        </>
    )
}