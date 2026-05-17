"use client"

import React, { useEffect, useRef, useState } from "react"
import { PluralFamilyChart } from "plural-family-chart"
import { PatriarchTimeline, type Timeline } from "lib/src/types"
import styles from "./TimelineComponent.module.css"
import { classNames } from "../../lib"
import { encodePatriarchData } from "../../lib/shareUrl"
import { ChartErrorBoundary } from "../ChartErrorBoundary"
import { useIsMobile } from "../../hooks/useIsMobile"

interface Props {
    name: string
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
    timelineFallback?: string
    hideShare?: boolean
    chartWidth?: number
    note?: string
    onNoteChange?: (note: string) => void
}

export const TimelineComponent: React.FC<Props> = ({ name, patriarchTimeline, timelines, hideShare, chartWidth, note, onNoteChange }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(chartWidth ?? 800)
    const isMobile = useIsMobile()
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const handleShare = async () => {
        const encoded = await encodePatriarchData(name, { patriarchTimeline, timelines })
        const url = `${window.location.origin}/charting-polygamy/chart/shared?data=${encoded}`
        navigator.clipboard.writeText(url).catch(console.error)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={classNames(styles.chart, styles.timeline)}>
            <div className={styles.header}>
                <h2>{name}</h2>
                {!hideShare && (
                    <div className={styles.actions}>
                        <button className="btn btn-primary" onClick={handleShare}>
                            {copied ? "Copied!" : "Share This Graph"}
                        </button>
                    </div>
                )}
            </div>
            <div ref={containerRef}>
                <ChartErrorBoundary>
                    <PluralFamilyChart
                        width={width}
                        patriarchTimeline={patriarchTimeline}
                        timelines={timelines}
                        showBrush={!isMobile}
                    />
                </ChartErrorBoundary>
            </div>
            {onNoteChange !== undefined && (
                <div className={styles.notes}>
                    <label className={styles.notesLabel} htmlFor={`notes-${name}`}>
                        Research notes
                    </label>
                    <textarea
                        id={`notes-${name}`}
                        className={styles.notesArea}
                        value={note ?? ""}
                        onChange={e => onNoteChange(e.target.value)}
                        placeholder="Jot down interesting discoveries about this family, sources, or note for further research…"
                        rows={4}
                    />
                </div>
            )}
        </div>
    )
}
