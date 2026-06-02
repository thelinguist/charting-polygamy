const DOT_RADIUS = 3
const DOT_HIT_RADIUS = 7
const DOT_OPACITY = 0.55

export const DataPoint = ({ xScale, yScale, point, fill, generateTooltipHandler }) => {
    const cx = xScale(point.patriarchAge) ?? 0
    const cy = yScale(point.wifeAge) ?? 0
    return (
        <g>
            <circle
                cx={cx}
                cy={cy}
                r={DOT_RADIUS}
                fill={fill}
                fillOpacity={DOT_OPACITY}
                style={{ pointerEvents: "none" }}
            />
            <circle
                cx={cx}
                cy={cy}
                r={DOT_HIT_RADIUS}
                fill="transparent"
                style={{ cursor: "default" }}
                {...generateTooltipHandler(cx, cy, point)}
            />
        </g>
    )
}
