import { wifeColors } from "../../constants"

export const MiniWivesTimelines = ({ timelines, patriarchDeathMs, rowHeight, barH, xScale }) => (
    <>
        {timelines.map((timeline, i) => {
            const { start, end } = timeline.linkedMarriage
            const endMs = Math.min(end?.getTime() ?? Infinity, timeline.death?.getTime() ?? Infinity, patriarchDeathMs)
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
