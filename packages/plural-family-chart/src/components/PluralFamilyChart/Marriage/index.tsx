import { Area } from "@visx/shape"
import { strokeColor, strokeWidth } from "../constants"
import { useHoverContext } from "../../../hooks/useHoverContext.tsx"
import { Group } from "@visx/group"
import { Label } from "./Label.tsx"

export const Marriage = ({ bounds, fillColor, text1, text2 }) => {
    const { handlers } = useHoverContext()
    return (
        <Group {...handlers} id={bounds[0].x}>
            <Area
                data={bounds}
                x0={bounds[0].x}
                x1={bounds[1].x}
                y={d => (d as any).y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill={fillColor}
            />
            <Label
                xStart={bounds[0].x}
                xEnd={bounds[1].x}
                yStart={bounds[0].y}
                text1={text1}
                text2={text2}
            />
        </Group>
    )
}
