import { assumptions } from "lib/src"

interface Props {
    xScale: (date: Date) => number
    marginTop: number
    mainHeight: number
}

export function EraShading({ xScale, marginTop, mainHeight }: Props) {
    const x = xScale(assumptions.polygamyStart)
    const w = xScale(assumptions.polygamyEnd) - x
    if (w <= 0) return null
    return (
        <rect x={x} y={-marginTop} width={w} height={mainHeight} fill="rgba(180, 140, 70, 0.10)" pointerEvents="none" />
    )
}
