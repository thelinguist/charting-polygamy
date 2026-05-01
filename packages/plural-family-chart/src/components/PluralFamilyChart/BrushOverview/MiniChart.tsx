import { patriarchColor, patriarchMarriedColor, spouseColor, spouseMarriedColor } from "../constants"

export const MiniChart = ({ people, xScale, rowHeight, barH, patriarchTimeline, timelines }) => {
    const patriarchDeathMs = patriarchTimeline.death.getTime()

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
                        fill={i === 0 ? patriarchColor : spouseColor}
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
                return <rect key={i} x={x} y={y} width={w} height={barH} fill={patriarchMarriedColor} rx={1} />
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
                return <rect key={timeline.name} x={x} y={y} width={w} height={barH} fill={spouseMarriedColor} rx={1} />
            })}
        </>
    )
}
