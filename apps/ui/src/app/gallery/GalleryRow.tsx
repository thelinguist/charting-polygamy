"use client"

import { useEffect, useRef, useState } from "react"
import { PluralFamilyChart } from "plural-family-chart"
import type { PatriarchTimeline, Timeline } from "lib/src/types"
import styles from "./gallery.module.css"
import { GalleryPolygamist } from "../../types/GalleryPolygamist"
import { SharedChart } from "../chart/shared/SharedChart"

interface Props {
    profile: GalleryPolygamist
    index: number
}

function ChartPanel({ data }: { data: string}) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(800)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div ref={containerRef}>
            <SharedChart encoded={data} width={width} />
            {/*<PluralFamilyChart width={width} patriarchTimeline={data.patriarchTimeline} timelines={data.timelines} />*/}
        </div>
    )
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
                        <span className={styles.rowMetaValue}>{profile.wifeCount ?? '––'}</span>
                    </div>
                </div>
                <span className={`${styles.rowChevron} ${open ? styles.rowChevronOpen : ""}`}>›</span>
            </button>

            {open && (
                <div className={styles.rowBody}>
                    <div className={styles.rowBodyInner}>
                        {profile.data ? (
                            <ChartPanel data={profile.data} />
                        ) : (
                            <div className={styles.chartPlaceholder}>Chart coming soon</div>
                        )}
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
