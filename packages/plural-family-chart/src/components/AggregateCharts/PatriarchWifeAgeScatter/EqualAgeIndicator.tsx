import { AXIS_COLOR } from "../shared/colors"

export const EqualAgeIndicator = ({ xScale, yScale, xDomain, yDomain }) => {
    // ── Equal-age diagonal: y = x from domain start to end ───────────────────
    const diagonalStart = Math.max(xDomain[0], yDomain[0])
    const diagonalEnd = Math.min(xDomain[1], yDomain[1])

    return (
        <>
            <line
                x1={xScale(diagonalStart) ?? 0}
                y1={yScale(diagonalStart) ?? 0}
                x2={xScale(diagonalEnd) ?? 0}
                y2={yScale(diagonalEnd) ?? 0}
                stroke={AXIS_COLOR}
                strokeWidth={1}
                strokeDasharray="5 3"
                opacity={0.35}
            />
            <text
                x={(xScale(diagonalEnd) ?? 0) + 4}
                y={(yScale(diagonalEnd) ?? 0) - 4}
                fill={AXIS_COLOR}
                fontSize={9}
                fontFamily="monospace"
                opacity={0.5}
            >
                equal age
            </text>
        </>
    )
}
