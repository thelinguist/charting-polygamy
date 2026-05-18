import { spouseColor, strokeColor } from "../../constants"

export const MiniPersonTimelines = ({ people, xScale, rowHeight, barH }) => (
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
    </>
)
