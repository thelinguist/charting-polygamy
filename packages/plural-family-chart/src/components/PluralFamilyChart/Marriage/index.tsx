import { FC } from "react"
import { Area } from "@visx/shape"
import { Group } from "@visx/group"
import { barHeight, MarriageKind, strokeColor, strokeWidth } from "../constants"
import { ClippedText } from "../ClippedText"
import { pickFillColor } from "./pickFillColor.ts"

interface Props {
    kind: MarriageKind
    colorIndex?: number
    onClick?: () => void
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    isExpanded?: boolean
    fillOpacity?: number
    bounds: { x: number; y: number }[]
    text1: string
    text2: string
}

export const Marriage: FC<Props> = ({
    kind,
    colorIndex = 0,
    isExpanded,
    fillOpacity,
    onClick,
    onMouseEnter,
    onMouseLeave,
    bounds,
    text1,
    text2,
}) => {
    const { fill, dasharray, textColor } = pickFillColor(kind, colorIndex)

    const overlayWidth = bounds[1].x - bounds[0].x
    const overlayHeight = bounds[3] ? bounds[3].y - bounds[0].y : barHeight

    return (
        <Group
            onClick={e => {
                e.stopPropagation()
                onClick?.()
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{ cursor: "pointer" }}
            id={bounds[0].x.toString()}
        >
            <Area
                data={bounds}
                x0={bounds[0].x}
                x1={bounds[1].x}
                y={d => (d as any).y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill={fill}
                fillOpacity={fillOpacity}
                strokeDasharray={dasharray}
            />
            {kind === MarriageKind.Other && isExpanded && (
                <rect
                    x={bounds[0].x}
                    y={bounds[0].y}
                    width={overlayWidth}
                    height={overlayHeight}
                    fill="rgba(255,255,255,0.75)"
                    style={{ pointerEvents: "none" }}
                />
            )}
            <ClippedText
                disableClip={isExpanded}
                xStart={bounds[0].x}
                xEnd={bounds[1].x}
                y={bounds[0].y + barHeight / 3}
                fill={textColor}
            >
                {text1}
            </ClippedText>
            <ClippedText
                disableClip={isExpanded}
                xStart={bounds[0].x}
                xEnd={bounds[1].x}
                y={bounds[0].y + (barHeight * 2) / 3}
                fill={textColor}
            >
                {text2}
            </ClippedText>
        </Group>
    )
}
