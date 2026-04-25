"use client"

import { classNames } from "../../../../lib"
import styles from "./TimelineRendering.module.css"
import React from "react"
import { PatriarchTimeline, Statistics, Timeline as TimelineType } from "lib/src/types"
import { Timeline } from "./Timeline"
import { Timeline2 } from "./Timeline2"

interface Props {
    timelines: Record<string, string>
    chartData?: Record<string, { patriarchTimeline: PatriarchTimeline; timelines: TimelineType[] }>
    stats?: Statistics
}
export const Timelines = ({ timelines, chartData, stats }: Props) => {
    return (
        <div>
            {!Object.keys(timelines).length && (
                <div className={classNames(styles.chart, styles.placeholder)}>graphs will go here</div>
            )}
            {Object.keys(timelines).map(name =>
                chartData?.[name] ? (
                    <Timeline2
                        key={name}
                        name={name}
                        patriarchTimeline={chartData[name].patriarchTimeline}
                        timelines={chartData[name].timelines}
                        timelineFallback={timelines[name]}
                    />
                ) : (
                    <Timeline key={name} name={name} timeline={timelines[name]} />
                )
            )}
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
