import { charWidthRatio, labelPadding, timelineAnnotationProps } from "../constants"

export function getExpandedXEnd(xStart: number, text1: string, text2: string, originalXEnd: number): number {
    const charWidth = timelineAnnotationProps.fontSize * charWidthRatio
    const textXEnd = xStart + Math.max(text1.length, text2.length) * charWidth + labelPadding
    return Math.max(textXEnd, originalXEnd)
}
