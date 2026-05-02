import { spouseColor, strokeColor, wifeColors, MarriageKind } from "../constants"
import { getConcurrentCounts } from "../Patriarch/getConcurrentCounts"
import { pickFillColor } from "../Marriage/pickFillColor"

export const MiniChart = ({ people, xScale, rowHeight, barH, patriarchTimeline, timelines }) => {
    const patriarchDeathMs = patriarchTimeline.death.getTime()
    const concurrentCounts = getConcurrentCounts(patriarchTimeline, timelines)

    return (
        <>
            {people.map((person, i) => {
                if (!person.birth || !person.death) return null
                const x = xScale(person.birth) as number
                const w = Math.max(0, (xScale(person.death) as number) - x)
                const y = i * rowHeight + (rowHeight - barH) / 2
                return (
                    <rect
                        key={person.name}
                        x={x}
                        y={y}
                        width={w}
                        height={barH}
                        fill={i === 0 ? strokeColor : spouseColor}
                        rx={1}
                    />
                )
            })}
            {patriarchTimeline.marriages.map((m, i) => {
                if (!m.start) return null
                const endMs = Math.min(m.end?.getTime() ?? Infinity, patriarchDeathMs)
                if (endMs === Infinity) return null
                const y = (rowHeight - barH) / 2
                const x = xScale(m.start) as number
                const w = Math.max(0, (xScale(new Date(endMs)) as number) - x)
                const { fill } = pickFillColor(MarriageKind.Patriarch, concurrentCounts[i])
                return <rect key={i} x={x} y={y} width={w} height={barH} fill={fill} rx={1} />
            })}
            {timelines.map((timeline, i) => {
                const { start, end } = timeline.linkedMarriage
                const endMs = Math.min(
                    end?.getTime() ?? Infinity,
                    timeline.death?.getTime() ?? Infinity,
                    patriarchDeathMs
                )
                if (endMs === Infinity) return null
                const y = (i + 1) * rowHeight + (rowHeight - barH) / 2
                const x = xScale(start) as number
                const w = Math.max(0, (xScale(new Date(endMs)) as number) - x)
                return (
                    <rect
                        key={timeline.name}
                        x={x}
                        y={y}
                        width={w}
                        height={barH}
                        fill={wifeColors[i % wifeColors.length]}
                        rx={1}
                    />
                )
            })}
        </>
    )
}
