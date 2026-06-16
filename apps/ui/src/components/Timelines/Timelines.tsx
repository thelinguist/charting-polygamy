"use client"

import { classNames } from "../../lib"
import styles from "../../app/chart/upload/components/TimelinesViewer.module.css"
import React from "react"
import { MissingFact, PatriarchData } from "lib"
import { Statistics } from "lib/src/types"
import { TimelineComponent } from "./TimelineComponent"

interface Props {
    chartData: Record<string, PatriarchData>
    notes?: Record<string, string>
    onNoteChange?: (name: string, note: string) => void
    interventionsByPatriarch?: Record<string, MissingFact[]>
}
export const Timelines = ({ chartData, notes, onNoteChange, interventionsByPatriarch }: Props) => {
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
                    note={notes?.[name]}
                    onNoteChange={onNoteChange ? note => onNoteChange(name, note) : undefined}
                    interventions={interventionsByPatriarch?.[name]}
                />
            ))}
        </div>
    )
}
