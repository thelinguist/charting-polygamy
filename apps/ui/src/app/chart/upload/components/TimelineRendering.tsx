"use client"

import React, { ChangeEventHandler, useState } from "react"
import { Mermaid } from "./Mermaid"
import { getTimelinesForMermaid } from "lib"
import { FileTypes } from "lib/src/types"
import { parseFile } from "../../../../lib/parseFile"
import styles from "./TimelineRendering.module.css"
import classNames from "../../../../lib/classNames"
import { example3Wives } from "../constants/sample"
import { UploadButton } from "../../../../components/UploadButton"

const getFileFormat = (file: File): FileTypes => {
    const ext = file.name.split(".").at(-1)
    if (ext === "ged") return FileTypes.ged
    if (ext === "csv") return FileTypes.csv
    const message = `invalid file type ${ext}, expected ged or csv`
    alert(message)
    throw Error(message)
}

export const TimelineRendering = () => {
    const [timelines, setTimelines] = useState<Record<string, string>>({})
    const onChange: ChangeEventHandler<HTMLInputElement> = async e => {
        e.preventDefault()
        if (e.target.files) {
            const file = e.target.files[0]
            const fileContents = await parseFile(file, console.info)
            const fileFormat = getFileFormat(file)
            const newTimelines = getTimelinesForMermaid({
                fileContents,
                fileFormat,
            })
            setTimelines(newTimelines)
        }
    }

    const runDemo = () => {
        setTimelines({ example: example3Wives })
    }

    return (
        <div className={styles.timelines}>
            <div className={classNames(styles.chart, styles.uploadInfo)}>
                <UploadButton title="upload files" text="upload a gedcom or csv file" accept=".ged,.csv" onChange={onChange} />
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
