import { useRef, useState, ChangeEventHandler } from "react"
import { PatriarchData } from "lib"
import { ManualEntryForm } from "./ManualEntryForm/ManualEntryForm"
import Link from "next/link"
import styles from "../upload.module.css"

interface Props {
    onFile: ChangeEventHandler<HTMLInputElement>
    onDemo: () => void
    onManual: (data: Record<string, PatriarchData> | null) => void
}

export function InputOptions({ onFile, onDemo, onManual }: Props) {
    const [showManual, setShowManual] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    return (
        <>
            <section className="tight">
                <div className="shell">
                    <div className={styles.optionsGrid}>
                        <div className={`card ${styles.optionCard}`}>
                            <div className={styles.optionMarker}>option 01</div>
                            <h4 className={styles.optionTitle}>Upload a GEDCOM or CSV</h4>
                            <p className={styles.optionDesc}>
                                Parsed locally — nothing is sent to a server.{" "}
                                <Link href="/chart/gedcom-instructions">How to export a GEDCOM</Link>
                                {" · "}
                                <Link href="/chart/csv-instructions">CSV format guide</Link>
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".ged,.csv"
                                style={{ display: "none" }}
                                onChange={onFile}
                            />
                            <button
                                className="btn"
                                style={{ alignSelf: "flex-start" }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Choose file <span>→</span>
                            </button>
                        </div>

                        <div className={`card ${styles.optionCard}`}>
                            <div className={styles.optionMarker}>option 02</div>
                            <h4 className={styles.optionTitle}>Enter manually</h4>
                            <p className={styles.optionDesc}>
                                Best for a single household you already know. Add a patriarch and his wives by hand.
                            </p>
                            <button
                                className="btn"
                                style={{ alignSelf: "flex-start" }}
                                onClick={() => setShowManual(v => !v)}
                            >
                                {showManual ? "Hide form" : "Open form →"}
                            </button>
                        </div>

                        <div className={`card ${styles.optionCard}`}>
                            <div className={styles.optionMarker}>option 03</div>
                            <h4 className={styles.optionTitle}>Try the demo</h4>
                            <p className={styles.optionDesc}>
                                Load a sample three-wife household to see what a chart looks like before using your own
                                data.
                            </p>
                            <button className="btn" style={{ alignSelf: "flex-start" }} onClick={onDemo}>
                                Load demo →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {showManual && (
                <section className={`tight ${styles.manualSection}`}>
                    <div className="shell">
                        <ManualEntryForm onChart={onManual} />
                    </div>
                </section>
            )}
        </>
    )
}
