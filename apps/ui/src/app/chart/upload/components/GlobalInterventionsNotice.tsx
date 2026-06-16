import { MissingFact } from "lib"
import styles from "../upload.module.css"

interface Props {
    interventions: MissingFact[]
}

export function GlobalInterventionsNotice({ interventions }: Props) {
    if (interventions.length === 0) return null
    const count = interventions.length
    return (
        <details className={styles.processingNotice}>
            <summary>
                {count} data issue{count === 1 ? "" : "s"} could not be linked to a specific family
            </summary>
            <ul className={styles.skippedList}>
                {interventions.map((issue, idx) => (
                    <li key={idx}>
                        {(issue.fact.Name ?? issue.fact["Second Party"]) && (
                            <span className={styles.skippedName}>
                                {issue.fact.Name ?? issue.fact["Second Party"]}
                            </span>
                        )}
                        {(issue.fact.Name ?? issue.fact["Second Party"]) && " — "}
                        {issue.reason}
                    </li>
                ))}
            </ul>
        </details>
    )
}
