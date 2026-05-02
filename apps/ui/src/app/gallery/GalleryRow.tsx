"use client"

import React, { useState } from "react"
import styles from "./gallery.module.css"
import { GalleryPolygamist } from "../../types/GalleryPolygamist"
import { EncodedChart } from "../../components/EncodedChart/EncodedChart"

interface Props {
    profile: GalleryPolygamist
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
                    <div className={styles.rowRole}>{profile.notability}</div>
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
                        <span className={styles.rowMetaValue}>{profile.wifeCount ?? "––"}</span>
                    </div>
                </div>
                <span className={`${styles.rowChevron} ${open ? styles.rowChevronOpen : ""}`}>›</span>
            </button>

            {open && (
                <div className={styles.rowBody}>
                    {profile.data ? (
                        <EncodedChart encodedData={profile.data} />
                    ) : (
                        <div className={styles.chartPlaceholder}>Chart coming soon</div>
                    )}
                    {profile.source && (
                        <p className="footnote right-float">
                            {typeof profile.source === "object" ? (
                                <>
                                    source: <a href={profile.source.href}>{profile.source.text}</a>
                                </>
                            ) : (
                                profile.source
                            )}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
