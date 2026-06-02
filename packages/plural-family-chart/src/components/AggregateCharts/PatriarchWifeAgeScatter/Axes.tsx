import { AxisBottom, AxisLeft } from "@visx/axis"
import { AXIS_COLOR } from "../shared/colors"
import { MARGIN, TICK_LABEL_PROPS, TICK_LABEL_PROPS_LEFT } from "../shared/chartConstants"

export const Axes = ({ xScale, yScale, innerWidth, innerHeight }) => (
    <>
        <AxisBottom
            scale={xScale}
            top={innerHeight}
            stroke={AXIS_COLOR}
            tickStroke={AXIS_COLOR}
            tickLabelProps={TICK_LABEL_PROPS}
            numTicks={7}
        />
        <AxisLeft
            scale={yScale}
            stroke={AXIS_COLOR}
            tickStroke={AXIS_COLOR}
            tickLabelProps={TICK_LABEL_PROPS_LEFT}
            numTicks={6}
        />

        {/* Axis labels */}
        <text
            x={innerWidth / 2}
            y={innerHeight + MARGIN.bottom - 6}
            fill={AXIS_COLOR}
            fontSize={10}
            fontFamily="monospace"
            textAnchor="middle"
        >
            patriarch's age at marriage
        </text>
        <text
            transform={`translate(${-MARGIN.left + 12}, ${innerHeight / 2}) rotate(-90)`}
            fill={AXIS_COLOR}
            fontSize={10}
            fontFamily="monospace"
            textAnchor="middle"
        >
            wife's age at marriage
        </text>
    </>
)
