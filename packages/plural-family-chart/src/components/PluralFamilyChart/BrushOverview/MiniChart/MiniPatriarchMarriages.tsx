import { pickFillColor } from "../../Marriage/pickFillColor"
import { MarriageKind } from "../../constants"

export const MiniPatriarchMarriages = ({ marriages, timelines, patriarchDeathMs, rowHeight, barH, xScale }) => {
    const { fill: patriarchFill } = pickFillColor(MarriageKind.Patriarch, 1)
    return (
        <>
            <g style={{ isolation: "isolate" }}>
                {marriages.map((m, i) => {
                    if (!m.start) return null
                    const timeline = timelines.find(t => t.linkedMarriage.start?.getTime() === m.start?.getTime())
                    const endMs = Math.min(
                        m.end?.getTime() ?? Infinity,
                        timeline?.death?.getTime() ?? Infinity,
                        patriarchDeathMs
                    )
                    if (endMs === Infinity) return null
                    const y = (rowHeight - barH) / 2
                    const x = xScale(m.start) as number
                    const w = Math.max(0, (xScale(new Date(endMs)) as number) - x)
                    return (
                        <rect
                            key={i}
                            x={x}
                            y={y}
                            width={w}
                            height={barH}
                            fill={patriarchFill}
                            rx={1}
                            style={{ mixBlendMode: "multiply" }}
                        />
                    )
                })}
            </g>
        </>
    )
}
