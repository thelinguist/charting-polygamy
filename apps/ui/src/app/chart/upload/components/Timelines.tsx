"use client"

import { classNames } from "../../../../lib"
import styles from "./TimelineRendering.module.css"
import React from "react"
import { Statistics } from "lib/src/types"
import { Timeline } from "./Timeline"

interface Props {
    timelines: Record<string, string>
    stats?: Statistics
}
export const Timelines = ({ timelines, stats }: Props) => {
    return (
        <div>
            {!Object.keys(timelines).length && (
                <div className={classNames(styles.chart, styles.placeholder)}>graphs will go here</div>
            )}
            {Object.keys(timelines).map(name => (
                <Timeline key={name} name={name} timeline={timelines[name]} />
            ))}
            {stats ? (
                <div className={classNames(styles.chart, styles.timeline)}>
                    <h2>Statistics</h2>
                    <pre>{JSON.stringify(stats, null, 2)}</pre>
                    <p>Number of polygamous families: {stats.polygamousFamilies}</p>
                    <p>
                        Percent of eligible men who practiced polygamy:{" "}
                        {Math.round((stats.polygamousFamilies / stats.eligiblePatriarchs) * 100)}%
                    </p>
                </div>
            ) : null}
        </div>
    )
}
