import { AXIS_COLOR } from "../shared/colors"

export const Legend = ({ legendItems, innerWidth }) => (
    <g transform={`translate(${innerWidth - 200}, 6)`}>
        {legendItems.map((item, i) => (
            <g key={item.label} transform={`translate(0, ${i * 16})`}>
                <circle r={4} cx={4} cy={4} fill={item.color} fillOpacity={0.8} />
                <text x={12} y={8} fill={AXIS_COLOR} fontSize={10} fontFamily="monospace">
                    {item.label}
                </text>
            </g>
        ))}
    </g>
)
