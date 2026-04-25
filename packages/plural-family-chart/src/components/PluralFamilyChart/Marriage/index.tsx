import { Area } from "@visx/shape"
import { strokeColor, strokeWidth } from "../constants"
import { Group } from "@visx/group"
import { Label } from "./Label"

interface Props {
    onClick?: () => void
    isHiding?: boolean
    isExpanded?: boolean
    labelOnly?: boolean
    fillOpacity?: number
    bounds: { x; y }[]
    fillColor?: string
    text1: string
    text2: string
}

export const Marriage: React.FC<Props> = ({ isHiding, isExpanded, labelOnly, fillOpacity, onClick, bounds, fillColor, text1, text2 }) => {
    return (
        <Group onClick={onClick} style={{ cursor: onClick ? "pointer" : undefined }} id={bounds[0].x}>
            {!labelOnly && (
                <Area
                    data={bounds}
                    x0={bounds[0].x}
                    x1={bounds[1].x}
                    y={d => (d as any).y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    fill={fillColor}
                    fillOpacity={fillOpacity}
                />
            )}
            {!isHiding && (
                <Label
                    fill={fillColor}
                    xStart={bounds[0].x}
                    xEnd={bounds[1].x}
                    yStart={bounds[0].y}
                    text1={text1}
                    text2={text2}
                    disableClip={isExpanded}
                />
            )}
        </Group>
    )
}
