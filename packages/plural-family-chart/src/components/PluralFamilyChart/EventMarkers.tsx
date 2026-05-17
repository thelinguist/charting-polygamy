import { HistoricalEvent } from "./constants"

interface Props {
    events: HistoricalEvent[]
    xScale: (date: Date) => number
    marginTop: number
    mainHeight: number
}

export function EventMarkers({ events, xScale, marginTop, mainHeight }: Props) {
    return (
        <>
            {events.map(event => {
                const x = xScale(event.date)
                const labelY = -marginTop + 6
                return (
                    <g key={event.label} pointerEvents="none">
                        <line
                            x1={x}
                            x2={x}
                            y1={-marginTop}
                            y2={mainHeight - marginTop}
                            stroke="#5a5446"
                            strokeWidth={1}
                            strokeDasharray="3 3"
                            strokeOpacity={0.45}
                        />
                        <text
                            x={x + 3}
                            y={labelY + 3}
                            fontSize={9}
                            fontFamily="var(--font-mono, monospace)"
                            fill="#5a5446"
                            fillOpacity={0.65}
                        >
                            {event.label}
                        </text>
                    </g>
                )
            })}
        </>
    )
}
