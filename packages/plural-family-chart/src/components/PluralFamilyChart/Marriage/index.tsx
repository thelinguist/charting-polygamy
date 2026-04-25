import { Area } from "@visx/shape"
import { barHeight, strokeColor, strokeWidth } from "../constants"
import { Group } from "@visx/group"
import { ClippedText } from "../ClippedText"

interface Props {
    onClick?: () => void
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    isExpanded?: boolean
    fillOpacity?: number
    bounds: { x: number; y: number }[]
    fillColor?: string
    text1: string
    text2: string
}

export const Marriage: React.FC<Props> = ({
    isExpanded,
    fillOpacity,
    onClick,
    onMouseEnter,
    onMouseLeave,
    bounds,
    fillColor,
    text1,
    text2,
}) => {
    return (
        <Group
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{ cursor: "pointer" }}
            id={bounds[0].x}
        >
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
            <ClippedText
                disableClip={isExpanded}
                xStart={bounds[0].x}
                xEnd={bounds[1].x}
                y={bounds[0].y + barHeight / 3}
            >
                {text1}
            </ClippedText>
            <ClippedText
                disableClip={isExpanded}
                xStart={bounds[0].x}
                xEnd={bounds[1].x}
                y={bounds[0].y + (barHeight * 2) / 3}
            >
                {text2}
            </ClippedText>
        </Group>
    )
}
