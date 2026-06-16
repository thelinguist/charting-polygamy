"use client"

import { useState, useEffect } from "react"
import { MissingFact, PatriarchData, SkippedFamily } from "lib"
import { Stage } from "./types"
import { example3WivesChartData } from "./constants/sample"
import { UploadHeader } from "./components/UploadHeader"
import { InputOptions } from "./components/InputOptions"
import { UploadResult } from "./components/UploadResult"
import { SavedDataBanner } from "./components/SavedDataBanner/SavedDataBanner"
import { saveSession, updateSessionInterventions, updateSessionNotes } from "../../../lib/chartStorage"
import { useChartSession } from "../../../hooks/useChartSession"
import type { ChartStats } from "../../../components/ChartStats/types"
import { computeChartStats } from "../../../lib/computeChartStats"
import { processUploadedFile } from "../../../lib/processUploadedFile"

export default function UploadPage() {
    const {
        initialChartData,
        initialNotes,
        initialInterventions,
        showBanner,
        savedSession,
        dismissBanner,
        deleteSession,
    } = useChartSession()
    const [chartData, setChartData] = useState<Record<string, PatriarchData>>(initialChartData ?? {})
    const [monogamousData, setMonogamousData] = useState<Record<string, PatriarchData>>({})
    const [stage, setStage] = useState<Stage>(initialChartData ? Stage.Result : Stage.Idle)
    const [chartStats, setChartStats] = useState<ChartStats | null>(() =>
        initialChartData && Object.keys(initialChartData).length > 0
            ? computeChartStats(initialChartData, savedSession?.stats)
            : null
    )
    const [notes, setNotes] = useState<Record<string, string>>(initialNotes)
    const [parseError, setParseError] = useState<string | null>(null)
    const [skippedFamilies, setSkippedFamilies] = useState<SkippedFamily[]>([])
    const [interventions, setInterventions] = useState<MissingFact[]>(initialInterventions)

    useEffect(() => {
        const id = setTimeout(() => updateSessionNotes(notes), 800)
        return () => clearTimeout(id)
    }, [notes])

    useEffect(() => {
        const id = setTimeout(() => updateSessionInterventions(interventions), 800)
        return () => clearTimeout(id)
    }, [interventions])

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (!e.target.files?.length) return
        const file = e.target.files[0]
        setStage(Stage.Parsing)
        setParseError(null)
        setSkippedFamilies([])
        setInterventions([])
        try {
            const {
                chartData: newData,
                monogamousData: newMonoData,
                stats,
                skippedFamilies: newSkipped,
                interventions: newInterventions,
            } = await processUploadedFile(file)
            saveSession(newData, "file", file.name, stats)
            setChartStats(Object.keys(newData).length > 0 ? computeChartStats(newData, stats) : null)
            setNotes({})
            setChartData(newData)
            setMonogamousData(newMonoData)
            setSkippedFamilies(newSkipped)
            setInterventions(newInterventions.filter(i => !!i.reason))
        } catch (err) {
            setParseError(err instanceof Error ? err.message : "An unexpected error occurred while parsing your file.")
        } finally {
            setStage(Stage.Result)
        }
    }

    const handleDemo = () => {
        setParseError(null)
        setSkippedFamilies([])
        setChartData({ ...example3WivesChartData })
        setStage(Stage.Result)
    }

    const handleManual = (data: Record<string, PatriarchData> | null) => {
        if (data) {
            saveSession(data, "manual")
            setChartStats(Object.keys(data).length > 0 ? computeChartStats(data) : null)
            setNotes({})
            setChartData(data)
            setStage(Stage.Result)
        }
    }

    const noCharts = stage === Stage.Result && !parseError && Object.keys(chartData).length === 0

    return (
        <>
            <UploadHeader />

            {showBanner && savedSession && (
                <section className="tight">
                    <div className="shell">
                        <SavedDataBanner session={savedSession} onDelete={deleteSession} onDismiss={dismissBanner} />
                    </div>
                </section>
            )}

            <InputOptions onFile={handleFile} onDemo={handleDemo} onManual={handleManual} />

            <UploadResult
                stage={stage}
                parseError={parseError}
                noCharts={noCharts}
                skippedFamilies={skippedFamilies}
                interventions={interventions}
                chartStats={chartStats}
                chartData={chartData}
                monogamousData={monogamousData}
                notes={notes}
                onNoteChange={(name, note) => setNotes(prev => ({ ...prev, [name]: note }))}
            />
        </>
    )
}
