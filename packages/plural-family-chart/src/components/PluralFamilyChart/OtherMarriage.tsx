import { Area } from "@visx/shape"
import { otherMarriageColor, strokeColor, strokeWidth } from "./constants.ts"
import { OtherMarriageLabel } from "./OtherMarriageLabel.tsx"

export const OtherMarriage = ({ bounds, yStart, otherMarriage }) => {
    // TODO this should become a component, calculate the width and clip the Text element (expand if hovering or tapped)

    const xStart = bounds[0].x
    const xEnd = bounds[1].x
    const year = otherMarriage.start.getFullYear()
    const name = otherMarriage.spouse

    return (
        <>
            <Area
                data={bounds}
                x0={xStart}
                x1={xEnd}
                y={d => (d as any).y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill={otherMarriageColor}
            />

            <OtherMarriageLabel
                xStart={xStart}
                xEnd={xEnd}
                yStart={yStart}
                year={year}
                name={name}
            />
        </>
    )
}
