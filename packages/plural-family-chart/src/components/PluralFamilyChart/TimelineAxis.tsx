import { axisColor, tickLabelProps } from "./constants.ts"
import { AxisScale, AxisTop } from "@visx/axis"
import React from "react"
import { listDecades } from "../../utils"
import { TickFormatter } from "@visx/axis/lib/types"
import { timeFormat } from "@visx/vendor/d3-time-format"

interface Props {
    xScale: AxisScale
    chartWidth: number
    timeValues: [Date, Date]
}

export const TimelineAxis: React.FC<Props> = ({ xScale, chartWidth, timeValues }) => {
    const xTickValues = listDecades(timeValues[0], timeValues[1])
    const tickFormat: TickFormatter<Date> = (v: Date, i: number) =>
        chartWidth > 400 || i % 2 === 0 ? timeFormat("%Y")(v) : ""

    return (
        <AxisTop
            scale={xScale}
            tickFormat={tickFormat}
            stroke={axisColor}
            tickStroke={axisColor}
            tickLabelProps={tickLabelProps}
            tickValues={xTickValues}
            // animationTrajectory={animationTrajectory}
        />
    )
}
