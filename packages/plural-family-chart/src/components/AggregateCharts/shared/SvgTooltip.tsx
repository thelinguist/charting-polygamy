import { TOOLTIP_BG } from "./colors"

interface Line {
    text: string
    dim?: boolean
}

interface SvgTooltipProps {
    x: number
    y: number
    lines: Line[]
    width?: number
}

const PAD = 7
const LINE_H = 14

export function SvgTooltip({ x, y, lines, width = 110 }: SvgTooltipProps) {
    const height = lines.length * LINE_H + PAD * 2
    return (
        <g transform={`translate(${x}, ${y - height - 8})`} style={{ pointerEvents: "none" }}>
            <rect x={-width / 2} y={0} width={width} height={height} rx={3} fill={TOOLTIP_BG} fillOpacity={0.92} />
            {lines.map((line, i) => (
                <text
                    key={i}
                    x={0}
                    y={PAD + (i + 1) * LINE_H - 2}
                    fill={line.dim ? "#9a9082" : "#f1ead8"}
                    fontSize={10}
                    fontFamily="monospace"
                    textAnchor="middle"
                >
                    {line.text}
                </text>
            ))}
        </g>
    )
}
