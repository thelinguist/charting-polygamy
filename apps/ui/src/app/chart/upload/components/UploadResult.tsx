import { MissingFact, PatriarchData, SkippedFamily } from "lib"
import { Stage } from "../types"
import { ScanAnimation } from "./ScanAnimation"
import { SkippedFamiliesNotice } from "./SkippedFamiliesNotice"
import { NoChartsFound } from "./NoChartsFound"
import { GlobalInterventionsNotice } from "./GlobalInterventionsNotice"
import { Timelines } from "../../../../components/Timelines/Timelines"
import { ChartStats as ChartStatsBlock } from "../../../../components/ChartStats/ChartStats"
import type { ChartStats } from "../../../../components/ChartStats/types"
import styles from "../upload.module.css"

interface Props {
    stage: Stage
    parseError: string | null
    noCharts: boolean
    skippedFamilies: SkippedFamily[]
    interventions: MissingFact[]
    chartStats: ChartStats | null
    chartData: Record<string, PatriarchData>
    monogamousData: Record<string, PatriarchData>
    notes: Record<string, string>
    onNoteChange: (name: string, note: string) => void
}

export function UploadResult({
    stage,
    parseError,
    noCharts,
    skippedFamilies,
    interventions,
    chartStats,
    chartData,
    monogamousData,
    notes,
    onNoteChange,
}: Props) {
    if (stage === Stage.Idle) return null

    const skippedSummary = `${skippedFamilies.length} famil${skippedFamilies.length === 1 ? "y was" : "ies were"} skipped during processing`

    const globalInterventions = interventions.filter(i => !i.patriarch)
    const interventionsByPatriarch: Record<string, MissingFact[]> = Object.fromEntries(
        Object.keys(chartData).map(name => [name, interventions.filter(i => i.patriarch === name)])
    )

    return (
        <section className="tight">
            <div className="shell">
                {stage === Stage.Parsing ? (
                    <div className={styles.scanBox}>
                        <ScanAnimation />
                    </div>
                ) : (
                    <>
                        {parseError && (
                            <div className={styles.parseError}>
                                <strong>Could not process file:</strong> {parseError}
                            </div>
                        )}

                        {noCharts ? (
                            <NoChartsFound skippedFamilies={skippedFamilies} />
                        ) : (
                            <SkippedFamiliesNotice families={skippedFamilies} summary={skippedSummary} />
                        )}

                        <GlobalInterventionsNotice interventions={globalInterventions} />

                        {!noCharts && chartStats && (
                            <ChartStatsBlock stats={chartStats} chartData={chartData} monogamousData={monogamousData} />
                        )}
                        <Timelines
                            chartData={chartData}
                            notes={notes}
                            onNoteChange={onNoteChange}
                            interventionsByPatriarch={interventionsByPatriarch}
                        />
                    </>
                )}
            </div>
        </section>
    )
}
