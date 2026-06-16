import { SkippedFamily } from "lib"
import styles from "../upload.module.css"

interface Props {
    families: SkippedFamily[]
    summary: string
}

export function SkippedFamiliesNotice({ families, summary }: Props) {
    if (families.length === 0) return null
    return (
        <details className={styles.processingNotice}>
            <summary>{summary}</summary>
            <ul className={styles.skippedList}>
                {families.map(f => (
                    <li key={f.name}>
                        <span className={styles.skippedName}>{f.name}</span>
                        {" — "}
                        {f.reason}
                    </li>
                ))}
            </ul>
        </details>
    )
}
