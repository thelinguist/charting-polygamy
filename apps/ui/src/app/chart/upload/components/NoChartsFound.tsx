import { SkippedFamily } from "lib"
import { SkippedFamiliesNotice } from "./SkippedFamiliesNotice"
import styles from "../upload.module.css"

interface Props {
    skippedFamilies: SkippedFamily[]
}

export function NoChartsFound({ skippedFamilies }: Props) {
    const skippedSummary = `${skippedFamilies.length} famil${skippedFamilies.length === 1 ? "y" : "ies"} could not be fully processed`
    return (
        <div className={styles.emptyState}>
            <h3 className={styles.emptyStateHeading}>No plural families found</h3>
            <p>
                Your file was processed, but no concurrent marriages were detected within the LDS polygamy period
                (1833–1890). This may be because:
            </p>
            <ul className={styles.emptyStateList}>
                <li>Your tree contains families outside that time period</li>
                <li>
                    Marriage date records are missing or incomplete — these are required to detect overlapping marriages
                </li>
                <li>Your ancestors practiced monogamy, which is entirely common</li>
            </ul>
            <SkippedFamiliesNotice families={skippedFamilies} summary={skippedSummary} />
        </div>
    )
}
