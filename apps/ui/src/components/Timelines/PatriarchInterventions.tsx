import { MissingFact } from "lib"
import styles from "./ResearchAccordion.module.css"

interface Props {
    interventions: MissingFact[]
}

export function PatriarchInterventions({ interventions }: Props) {
    if (interventions.length === 0) return null
    return (
        <ul className={styles.issuesList}>
            {interventions.map((issue, idx) => (
                <li
                    key={idx}
                    className={issue.canMakeAssumption ? styles.issuesAssumption : styles.issuesMissing}
                >
                    {(issue.fact.Name ?? issue.fact["Second Party"]) && (
                        <span className={styles.issuesPerson}>
                            {issue.fact.Name ?? issue.fact["Second Party"]}
                        </span>
                    )}
                    {(issue.fact.Name ?? issue.fact["Second Party"]) && " — "}
                    {issue.reason}
                </li>
            ))}
        </ul>
    )
}