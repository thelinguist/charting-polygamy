"use client"

import React, { ChangeEventHandler, useState } from "react"
import Link from "next/link"
import { getTimelines, PatriarchData } from "lib"
import { FileTypes, Statistics } from "lib/src/types"
import { parseFile, classNames } from "../../../../lib"
import styles from "./TimelineRendering.module.css"
import { example3WivesChartData } from "../constants/sample"
import { UploadButton } from "../../../../components/UploadButton"
import { Timelines } from "./Timelines"
import { ManualEntryForm } from "./ManualEntryForm"

const contactHref = `mailto:${"chartingpolygamy"}@${"noctiluma.com"}`

const getFileFormat = (file: File): FileTypes => {
    const ext = file.name.split(".").at(-1)
    if (ext === "ged") return FileTypes.ged
    if (ext === "csv") return FileTypes.csv
    const message = `invalid file type ${ext}, expected ged or csv`
    alert(message)
    throw Error(message)
}

export const TimelinesViewer = () => {
    const [chartData, setChartData] = useState<Record<string, PatriarchData>>({})
    const [stats, setStats] = useState<Statistics>()
    const [showManualForm, setShowManualForm] = useState(false)
    const onChange: ChangeEventHandler<HTMLInputElement> = async e => {
        e.preventDefault()
        if (e.target.files) {
            const file = e.target.files[0]
            const fileContents = await parseFile(file, console.info)
            const fileFormat = getFileFormat(file)
            const { chartData: newChartData, stats: newStats } = getTimelines({ fileContents, fileFormat })
            setStats(newStats)
            setChartData(newChartData)
        }
    }

    const runDemo = () => {
        setChartData({ ...example3WivesChartData })
    }

    const handleManualChart = (data: Record<string, PatriarchData> | null) => {
        if (data) setChartData(data)
    }

    return (
        <div className={styles.timelines}>
            <div className={styles.chart}>
                <p>In order to render a chart you will need either:</p>
                <ul>
                    <li>
                        a gedcom file (.ged) which you can export from ancestry.com {">"} my tree {">"} tree settings
                        export
                    </li>
                    <li>
                        a csv file, formatted{" "}
                        <Link href="/data/parley-p-pratt.csv" target="_blank" rel="noopener noreferrer">
                            like the one here
                        </Link>
                    </li>
                    <li>enter family data manually using the form below</li>
                </ul>
                <br />
                <p>
                    I am collecting interesting charts for a new page. If you want to contribute, or have any feedback,{" "}
                    <a href={contactHref}>emails are welcome</a>.
                </p>
            </div>
            <div className={classNames(styles.chart, styles.uploadInfo)}>
                <UploadButton
                    title="upload files"
                    text="upload a gedcom or csv file"
                    accept=".ged,.csv"
                    onChange={onChange}
                />
                Or
                <button onClick={runDemo}>try the demo</button>
                Or
                <button onClick={() => setShowManualForm(prev => !prev)}>
                    {showManualForm ? "hide form" : "enter manually"}
                </button>
            </div>
            {showManualForm && (
                <div className={styles.chart}>
                    <ManualEntryForm onChart={handleManualChart} />
                </div>
            )}
            <Timelines chartData={chartData} stats={stats} />
        </div>
    )
}
