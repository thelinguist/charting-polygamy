"use client"

import { classNames } from "../../lib"
import styles from "../../app/chart/upload/components/TimelinesViewer.module.css"
import React from "react"
import { PatriarchData } from "lib"
import { Statistics } from "lib/src/types"
import { TimelineComponent } from "./TimelineComponent"

interface Props {
    chartData: Record<string, PatriarchData>
    stats?: Statistics
}
export const Timelines = ({ chartData, stats }: Props) => {
    return (
        <div>
            {!Object.keys(chartData).length && (
                <div className={classNames(styles.chart, styles.placeholder)}>graphs will go here</div>
            )}
            {Object.keys(chartData).map(name => (
                <TimelineComponent
                    key={name}
                    name={name}
                    patriarchTimeline={chartData[name].patriarchTimeline}
                    timelines={chartData[name].timelines}
                />
            ))}
            {stats ? (
                <div className={classNames(styles.chart, styles.timeline)}>
                    <h2>Statistics</h2>
                    <pre>{JSON.stringify(stats, null, 2)}</pre>
                    <p>Number of polygamous families: {stats.polygamousFamilies}</p>
                    {/*<p>*/}
                    {/*    Percent of eligible men who practiced polygamy:{" "}*/}
                    {/*    {Math.round((stats.polygamousFamilies / stats.eligiblePatriarchs) * 100)}%*/}
                    {/*</p>*/}
                </div>
            ) : null}
        </div>
    )
}
