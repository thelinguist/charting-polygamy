"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { PatriarchData } from "lib"
import { AggregateCharts } from "plural-family-chart"
import type { ChartStats } from "./types"
import styles from "./ChartStats.module.css"

interface StatTileProps {
    value: string | number
    label: string
    sub?: string
    compound?: string
}

function StatTile({ value, label, sub, compound }: StatTileProps) {
    return (
        <div className={styles.tile}>
            <div className={styles.valueRow}>
                <span className={styles.value}>{value}</span>
                {compound && <span className={styles.compound}>{compound}</span>}
            </div>
            <div className={styles.label}>{label}</div>
            {sub && <div className={styles.sub}>{sub}</div>}
        </div>
    )
}

interface Props {
    stats: ChartStats
    chartData?: Record<string, PatriarchData>
    monogamousData?: Record<string, PatriarchData>
}

export function ChartStats({ stats, chartData, monogamousData }: Props) {
    const [expanded, setExpanded] = useState(false)
    const hasCharts = chartData != null && Object.keys(chartData).length > 1

    return (
        <div className={styles.block}>
            <div className={`eyebrow ${styles.eyebrow}`}>Statistical summary</div>
            <div className={stats.practicingPercent ? styles.grid : styles.smallGrid}>
                <StatTile value={stats.polygamistCount} label="men who practiced polygamy" />
                {stats.practicingPercent ? (
                    <StatTile
                        value={`${(stats.practicingPercent * 100).toFixed(0)}%`}
                        label="percentage of elligible men who practiced polygamy"
                    />
                ) : null}
                <StatTile value={stats.averageWives.toFixed(1)} label="average wives per patriarch" />
                <StatTile value={stats.maxWives} label="most wives recorded" sub={stats.maxWivesName} />
                <StatTile
                    value={stats.afterBanCount}
                    label="married after the 1890 ban"
                    compound={`${stats.afterBanPercent}%`}
                />
            </div>

            {hasCharts && (
                <>
                    <div className={styles.divider} />
                    <button className={styles.toggle} onClick={() => setExpanded(v => !v)} aria-expanded={expanded}>
                        <span>Distribution charts</span>
                        <ChevronDown size={14} className={expanded ? styles.chevronOpen : styles.chevron} />
                    </button>
                    {expanded && (
                        <div className={styles.chartsArea}>
                            <AggregateCharts chartData={chartData} monogamousData={monogamousData} hideHeader />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
