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
}

export function ChartStats({ stats }: Props) {
    return (
        <div className={styles.block}>
            <div className={`eyebrow ${styles.eyebrow}`}>Statistical summary</div>
            <div className={stats.practicingPercent ? styles.grid : styles.smallGrid}>
                <StatTile value={stats.polygamistCount} label="men who practiced polygamy" />
                {stats.practicingPercent !== undefined && (
                    <StatTile
                        value={`${(stats.practicingPercent * 100).toFixed(0)}%`}
                        label={stats.adjustedPracticingPercent !== undefined ? "of eligible men in this tree practiced polygamy †" : "of eligible men in this tree practiced polygamy"}
                        sub={
                            stats.adjustedPracticingPercent !== undefined
                                ? `≈ ${(stats.adjustedPracticingPercent * 100).toFixed(0)}% est. (ascent-adjusted)`
                                : undefined
                        }
                    />
                )}
                <StatTile value={stats.averageWives.toFixed(1)} label="average wives per patriarch" />
                <StatTile value={stats.maxWives} label="most wives recorded" sub={stats.maxWivesName} />
                <StatTile
                    value={stats.afterBanCount}
                    label="married after the 1890 ban"
                    compound={`${stats.afterBanPercent}%`}
                />
            </div>
            {stats.adjustedPracticingPercent !== undefined && (
                <p className={styles.footnote}>
                    † The observed rate overstates the historical population rate due to genealogical ascent bias: men
                    with more wives had proportionally more descendants, and thus appear more frequently in any
                    descendant-compiled tree. The adjusted figure applies inverse probability weighting using average
                    wife count as a proxy for reproductive advantage. Historical scholarship estimates 20–30% of
                    eligible Latter-day Saint men practiced plural marriage during 1852–1890.
                </p>
            )}
        </div>
    )
}
