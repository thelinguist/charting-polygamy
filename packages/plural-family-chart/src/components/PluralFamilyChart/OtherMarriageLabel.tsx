import { barHeight } from "./constants.ts"
import { Group } from "@visx/group"
import React from "react"
import { ClippedText } from "./ClippedText.tsx"

interface Props {
    xStart: number
    xEnd: number
    yStart: number
    year: number
    name: string
}

export const OtherMarriageLabel: React.FC<Props> = ({ xStart, yStart, xEnd, year, name }) => {
    const yearTextY = yStart + barHeight / 3
    const nameTextY = yStart + (barHeight * 2) / 3

    return (
        <Group>
            <ClippedText xStart={xStart} xEnd={xEnd} y={yearTextY}>
                {year}
            </ClippedText>
            <ClippedText xStart={xStart} xEnd={xEnd} y={nameTextY}>
                {name}
            </ClippedText>
        </Group>
    )
}
