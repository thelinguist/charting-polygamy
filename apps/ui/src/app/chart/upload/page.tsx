"use client"

import { useState, useEffect, useRef, ChangeEventHandler } from "react"
import { getTimelines, PatriarchData } from "lib"
import { FileTypes } from "lib/src/types"
import { parseFile } from "../../../lib"
import { example3WivesChartData } from "./constants/sample"
import { ManualEntryForm } from "./components/ManualEntryForm/ManualEntryForm"
import { Timelines } from "../../../components/Timelines/Timelines"
import styles from "./upload.module.css"

const SCAN_LINES = [
    "reading GEDCOM…",
    "parsing individuals",
    "parsing family records",
    "detecting concurrent marriages…",
    "assembling timelines",
    "rendering chart…",
]

function ScanAnimation() {
    const [n, setN] = useState(0)
    useEffect(() => {
        const id = setInterval(() => setN(x => x + 1), 90)
        return () => clearInterval(id)
    }, [])
    return (
        <div>
            {SCAN_LINES.slice(0, Math.min(SCAN_LINES.length, Math.floor(n / 4) + 1)).map((line, i) => (
                <div key={i} className={styles.scanLine}>
                    <span className={styles.scanAccent}>›</span> {line}
                </div>
            ))}
        </div>
    )
}

const getFileFormat = (file: File): FileTypes => {
    const ext = file.name.split(".").at(-1)
    if (ext === "ged") return FileTypes.ged
    if (ext === "csv") return FileTypes.csv
    const message = `invalid file type ${ext}, expected ged or csv`
    alert(message)
    throw Error(message)
}

type Stage = "idle" | "parsing" | "result"

export default function UploadPage() {
    const [chartData, setChartData] = useState<Record<string, PatriarchData>>({})
    const [stage, setStage] = useState<Stage>("idle")
    const [showManual, setShowManual] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFile: ChangeEventHandler<HTMLInputElement> = async e => {
        e.preventDefault()
        if (!e.target.files?.length) return
        const file = e.target.files[0]
        setStage("parsing")
        const fileContents = await parseFile(file, console.info)
        const fileFormat = getFileFormat(file)
        const { chartData: newData } = getTimelines({ fileContents, fileFormat })
        setChartData(newData)
        setStage("result")
    }

    const runDemo = () => {
        setStage("parsing")
        setTimeout(() => {
            setChartData({ ...example3WivesChartData })
            setStage("result")
        }, 1200)
    }

    const handleManual = (data: Record<string, PatriarchData> | null) => {
        if (data) {
            setChartData(data)
            setStage("result")
        }
    }

    return (
        <>
            {/* HEADER */}
            <section className={styles.headerSection}>
                <div className="shell">
                    <div className={`flex items-baseline gap-16 ${styles.eyebrowRow}`}>
                        <span className="eyebrow">№ 004 — The Tool</span>
                        <hr className="rule" />
                    </div>
                    <h2 className={styles.heading}>Chart your own tree.</h2>
                    <p className={`lede ${styles.lede}`}>
                        Drop in a GEDCOM file, paste a CSV, or build a family by hand. The tool
                        detects men with overlapping marriages and draws each as a stacked timeline.
                    </p>
                </div>
            </section>

            {/* INPUT OPTIONS */}
            <section className="tight">
                <div className="shell">
                    <div className={styles.optionsGrid}>
                        {/* Upload */}
                        <div className={`card ${styles.optionCard}`}>
                            <div className={styles.optionMarker}>option 01</div>
                            <h4 className={styles.optionTitle}>Upload a GEDCOM</h4>
                            <p className={styles.optionDesc}>
                                .ged from Ancestry or FamilySearch. Parsed locally — nothing is sent to a server.
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".ged,.csv"
                                style={{ display: "none" }}
                                onChange={handleFile}
                            />
                            <button
                                className="btn"
                                style={{ alignSelf: "flex-start" }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Choose file →
                            </button>
                        </div>

                        {/* Manual */}
                        <div className={`card ${styles.optionCard}`}>
                            <div className={styles.optionMarker}>option 02</div>
                            <h4 className={styles.optionTitle}>Enter manually</h4>
                            <p className={styles.optionDesc}>
                                Best for a single household you already know. Add a patriarch and his wives by hand.
                            </p>
                            <button
                                className="btn"
                                style={{ alignSelf: "flex-start" }}
                                onClick={() => setShowManual(v => !v)}
                            >
                                {showManual ? "Hide form" : "Open form →"}
                            </button>
                        </div>

                        {/* Demo */}
                        <div className={`card ${styles.optionCard}`}>
                            <div className={styles.optionMarker}>option 03</div>
                            <h4 className={styles.optionTitle}>Try the demo</h4>
                            <p className={styles.optionDesc}>
                                Load a sample three-wife household to see what a chart looks like before using your own data.
                            </p>
                            <button
                                className="btn"
                                style={{ alignSelf: "flex-start" }}
                                onClick={runDemo}
                            >
                                Load demo →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* MANUAL FORM */}
            {showManual && (
                <section className={`tight ${styles.manualSection}`}>
                    <div className="shell">
                        <ManualEntryForm onChart={handleManual} />
                    </div>
                </section>
            )}

            {/* RESULT */}
            {stage !== "idle" && (
                <section className="tight">
                    <div className="shell">
                        <div className={styles.resultHeader}>
                            <div>
                                <div className={`eyebrow ${styles.resultEyebrow}`}>Result</div>
                                {stage === "result" && Object.keys(chartData).length > 1 && (
                                    <p className={styles.resultCount}>
                                        {Object.keys(chartData).length} polygamous households detected.
                                    </p>
                                )}
                            </div>
                        </div>

                        {stage === "parsing" ? (
                            <div className={styles.scanBox}>
                                <ScanAnimation />
                            </div>
                        ) : (
                            <Timelines chartData={chartData} />
                        )}
                    </div>
                </section>
            )}
        </>
    )
}
