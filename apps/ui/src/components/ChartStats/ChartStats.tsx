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
        </div>
    )
}
