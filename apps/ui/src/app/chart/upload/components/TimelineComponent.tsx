"use client"

import React, { useEffect, useRef, useState } from "react"
import { PluralFamilyChart } from "plural-family-chart"
import { PatriarchTimeline, type Timeline } from "lib/src/types"
import styles from "./TimelineRendering.module.css"
import { classNames } from "../../../../lib"
import { encodePatriarchData } from "../../../../lib/shareUrl"
import { ChartErrorBoundary } from "../../../../components/ChartErrorBoundary"

interface Props {
    name: string
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
    timelineFallback?: string
    hideShare?: boolean
    chartWidth?: number
}

export const TimelineComponent: React.FC<Props> = ({ name, patriarchTimeline, timelines, hideShare, chartWidth }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(chartWidth ?? 800)
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
                        <button onClick={handleShare}>{copied ? "Copied!" : "Share This Graph"}</button>
                    </div>
                )}
            </div>
            <div ref={containerRef}>
                <ChartErrorBoundary>
                    <PluralFamilyChart width={width} patriarchTimeline={patriarchTimeline} timelines={timelines} />
                </ChartErrorBoundary>
            </div>
        </div>
    )
}
