import { useState, useEffect } from "react"
import styles from "../upload.module.css"

const SCAN_LINES = [
    "reading GEDCOM…",
    "parsing individuals",
    "parsing family records",
    "detecting concurrent marriages…",
    "assembling timelines",
    "rendering chart…",
]

export function ScanAnimation() {
    const [n, setN] = useState(0)
    useEffect(() => {
        const id = setInterval(() => setN(x => x + 1), 90)
        return () => clearInterval(id)
    }, [])
    return (
        <div>
            {SCAN_LINES.slice(0, Math.min(SCAN_LINES.length, Math.floor(n / 4) + 1)).map((line, i) => (
                <div key={i} className={styles.scanLine}>
                    <span className={styles.scanAccent}>›</span> {line}
                </div>
            ))}
        </div>
    )
}
