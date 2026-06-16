import { MissingFact } from "lib"
import { PatriarchInterventions } from "./PatriarchInterventions"
import styles from "./ResearchAccordion.module.css"

interface Props {
    name: string
    note?: string
    onNoteChange?: (note: string) => void
    interventions?: MissingFact[]
}

export function ResearchAccordion({ name, note, onNoteChange, interventions }: Props) {
    const hasIssues = !!(interventions && interventions.length > 0)
    const hasNotes = onNoteChange !== undefined

    if (!hasNotes && !hasIssues) return null

    // Issues only — show flat, no accordion needed
    if (!hasNotes) {
        return (
            <div className={styles.wrapper}>
                <PatriarchInterventions interventions={interventions!} />
            </div>
        )
    }

    return (
        <details className={styles.wrapper}>
            <summary className={styles.toggle}>
                <span className={styles.toggleArrow}>▶</span>
                Notes
                {hasIssues && (
                    <span className={styles.issuesBadge}>
                        ⚠ {interventions!.length} issue{interventions!.length === 1 ? "" : "s"}
                    </span>
                )}
            </summary>
            <div className={styles.content}>
                <textarea
                    id={`notes-${name}`}
                    className={styles.notesArea}
                    value={note ?? ""}
                    onChange={e => onNoteChange(e.target.value)}
                    placeholder="Jot down interesting discoveries about this family, sources, or note for further research…"
                    rows={4}
                />
                <PatriarchInterventions interventions={interventions ?? []} />
            </div>
        </details>
    )
}
