"use client"

import { useState, useEffect, useRef, ChangeEventHandler } from "react"
import { getTimelines, PatriarchData } from "lib"
import { FileTypes } from "lib/src/types"
import { parseFile } from "../../../lib"
import { example3WivesChartData } from "./constants/sample"
import { ManualEntryForm } from "./components/ManualEntryForm/ManualEntryForm"
import { SavedDataBanner } from "./components/SavedDataBanner/SavedDataBanner"
import { Timelines } from "../../../components/Timelines/Timelines"
import { saveSession, updateSessionNotes } from "../../../lib/chartStorage"
import { useChartSession } from "../../../hooks/useChartSession"
import { ChartStats as ChartStatsBlock } from "../../../components/ChartStats/ChartStats"
import type { ChartStats } from "../../../components/ChartStats/types"
import { computeChartStats } from "../../../lib/computeChartStats"
import Link from "next/link"
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
    const { initialChartData, initialNotes, showBanner, savedSession, dismissBanner, deleteSession } = useChartSession()
    const [chartData, setChartData] = useState<Record<string, PatriarchData>>(initialChartData ?? {})
    const [monogamousData, setMonogamousData] = useState<Record<string, PatriarchData>>({})
    const [stage, setStage] = useState<Stage>(initialChartData ? "result" : "idle")
    const [chartStats, setChartStats] = useState<ChartStats | null>(() =>
        initialChartData && Object.keys(initialChartData).length > 0
            ? computeChartStats(initialChartData, savedSession?.stats)
            : null
    )
    const [notes, setNotes] = useState<Record<string, string>>(initialNotes)
    const [showManual, setShowManual] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const id = setTimeout(() => updateSessionNotes(notes), 800)
        return () => clearTimeout(id)
    }, [notes])

    const handleFile: ChangeEventHandler<HTMLInputElement> = async e => {
        e.preventDefault()
        if (!e.target.files?.length) return
        const file = e.target.files[0]
        setStage("parsing")
        const fileContents = await parseFile(file, console.info)
        const fileFormat = getFileFormat(file)
        const {
            chartData: newData,
            monogamousData: newMonoData,
            stats,
        } = getTimelines({ fileContents, fileFormat, includeMonogamous: true })
        saveSession(newData, "file", file.name, stats)
        setChartStats(Object.keys(newData).length > 0 ? computeChartStats(newData, stats) : null)
        setNotes({})
        setChartData(newData)
        setMonogamousData(newMonoData)
        setStage("result")
    }

    const runDemo = () => {
        setStage("parsing")
        setTimeout(() => {
            const data = { ...example3WivesChartData }
            setChartData(data)
            setStage("result")
        }, 1200)
    }

    const handleManual = (data: Record<string, PatriarchData> | null) => {
        if (data) {
            saveSession(data, "manual")
            setChartStats(Object.keys(data).length > 0 ? computeChartStats(data) : null)
            setNotes({})
            setChartData(data)
            setStage("result")
        }
    }

    return (
        <>
            {/* HEADER */}
            <section className={styles.headerSection}>
                <div className="shell">
                    <h2 className={styles.heading}>Chart your own tree.</h2>
                    <p className={`lede ${styles.lede}`}>
                        Drop in a GEDCOM file, paste a CSV, or build a family by hand. The tool detects men with
                        overlapping marriages and draws each as a stacked timeline.
                    </p>
                    <p className={`lede ${styles.lede}`}>
                        <b>You will likely need to review your family tree.</b>There may be missing marriage dates that
                        cause families to be hidden in the charts below. Sometimes researchers falsely link a child as a
                        wife or vice versa and there may even be duplicates. Once the tool has identified some plural
                        families, look into supporting facts such as government records to confirm what you are seeing.
                    </p>
                </div>
            </section>

            {/* SAVED SESSION BANNER */}
            {showBanner && savedSession && (
                <section className="tight">
                    <div className="shell">
                        <SavedDataBanner session={savedSession} onDelete={deleteSession} onDismiss={dismissBanner} />
                    </div>
                </section>
            )}

            {/* INPUT OPTIONS */}
            <section className="tight">
                <div className="shell">
                    <div className={styles.optionsGrid}>
                        {/* Upload */}
                        <div className={`card ${styles.optionCard}`}>
                            <div className={styles.optionMarker}>option 01</div>
                            <h4 className={styles.optionTitle}>Upload a GEDCOM or CSV</h4>
                            <p className={styles.optionDesc}>
                                Parsed locally — nothing is sent to a server.{" "}
                                <Link href="/chart/gedcom-instructions">How to export a GEDCOM</Link>
                                {" · "}
                                <Link href="/chart/csv-instructions">CSV format guide</Link>
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
                                Choose file <span>→</span>
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
                                Load a sample three-wife household to see what a chart looks like before using your own
                                data.
                            </p>
                            <button className="btn" style={{ alignSelf: "flex-start" }} onClick={runDemo}>
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
                        {stage === "parsing" ? (
                            <div className={styles.scanBox}>
                                <ScanAnimation />
                            </div>
                        ) : (
                            <>
                                {chartStats && (
                                    <ChartStatsBlock
                                        stats={chartStats}
                                        chartData={chartData}
                                        monogamousData={monogamousData}
                                    />
                                )}
                                <Timelines
                                    chartData={chartData}
                                    notes={notes}
                                    onNoteChange={(name, note) => setNotes(prev => ({ ...prev, [name]: note }))}
                                />
                            </>
                        )}
                    </div>
                </section>
            )}
        </>
    )
}
