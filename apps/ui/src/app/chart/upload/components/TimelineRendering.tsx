"use client"

import React, { ChangeEventHandler, useState } from "react"
import { Mermaid } from "./Mermaid"
import { getTimelinesForMermaid } from "lib"
import { FileTypes } from "lib/src/types"
import { parseFile } from "../../../../lib/parseFile"
import styles from "./TimelineRendering.module.css"
import classNames from "../../../../lib/classNames"
import { example3Wives } from "../constants/sample"

export const TimelineRendering = () => {
    const [timelines, setTimelines] = useState<Record<string, string>>({})

    const onChange: ChangeEventHandler<HTMLInputElement> = async e => {
        e.preventDefault()
        if (e.target.files) {
            const fileContents = await parseFile(e.target.files[0], console.info)
            const newTimelines = getTimelinesForMermaid({
                fileContents,
                fileFormat: FileTypes.ged,
            })
            setTimelines(newTimelines)
        }
    }

    const runDemo = () => {
        setTimelines({ example: example3Wives })
    }

    return (
        <div>
            <div className={classNames(styles.chart, styles.uploadInfo)}>
                <button>
                     <label htmlFor="upload" role={"button"} title={"upload files"}>
                    <a>
                        upload a gedcom file
                    </a>
                </label>
                <input id="upload" type="file" onChange={onChange} hidden />
                </button>
                Or
                <button onClick={runDemo}>try the demo</button>
            </div>
            <div>
                {!Object.keys(timelines).length && (
                    <div className={classNames(styles.chart, styles.placeholder)}>graphs will go here</div>
                )}
                {Object.keys(timelines).map(name => (
                    <div key={name} className={styles.chart}>
                        <h2>{name}</h2>
                        <Mermaid chart={timelines[name]} title={name} />
                    </div>
                ))}
            </div>
        </div>
    )
}
