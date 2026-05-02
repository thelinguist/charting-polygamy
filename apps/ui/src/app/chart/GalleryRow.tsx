"use client"

import { useState } from "react"
import styles from "./gallery.module.css"

export interface GalleryProfile {
    id: string
    name: string
    role: string
    born: number
    died: number | null
    wivesCount: string
    note: string
}

interface Props {
    profile: GalleryProfile
    index: number
}

export function GalleryRow({ profile, index }: Props) {
    const [open, setOpen] = useState(false)

    return (
        <div className={styles.row}>
            <button className={styles.rowToggle} onClick={() => setOpen(o => !o)} aria-expanded={open}>
                <span className={styles.rowMarker}>{String(index + 1).padStart(2, "0")}</span>
                <div>
                    <div className={styles.rowName}>{profile.name}</div>
                    <div className={styles.rowRole}>{profile.role}</div>
                </div>
                <div className={styles.rowMeta}>
                    <div className={styles.rowMetaItem}>
                        <span className={styles.rowMetaLabel}>Life</span>
                        <span className={styles.rowMetaValue}>
                            {profile.born}–{profile.died ?? "—"}
                        </span>
                    </div>
                    <div className={styles.rowMetaItem}>
                        <span className={styles.rowMetaLabel}>Wives</span>
                        <span className={styles.rowMetaValue}>{profile.wivesCount}</span>
                    </div>
                </div>
                <span className={`${styles.rowChevron} ${open ? styles.rowChevronOpen : ""}`}>›</span>
            </button>

            {open && (
                <div className={styles.rowBody}>
                    <div className={styles.rowBodyInner}>
                        <div className={styles.chartPlaceholder}>Chart coming soon</div>
                        <div className={styles.sidePanel}>
                            <div className={`eyebrow ${styles.noteEyebrow}`}>Note</div>
                            <p className={styles.noteText}>{profile.note}</p>
                            <hr className="rule-soft" />
                            <p className="footnote" style={{ marginTop: 16 }}>
                                Dates in pre-baked charts are illustrative. Verify specific years against primary
                                sources before citation.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
