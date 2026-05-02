"use client"

import { useRef, useState, useEffect } from "react"
import { PluralFamilyChart } from "plural-family-chart"
import { DecodeStatus, useDecodeData } from "../../hooks/useDecodeData"
import { ChartErrorBoundary } from "../ChartErrorBoundary"
import styles from "./EncodedChart.module.css"
import { useIsMobile } from "../../hooks/useIsMobile"

interface Props {
    encodedData: string
}

export function EncodedChart({ encodedData }: Props) {
    const isMobile = useIsMobile()
    const { state } = useDecodeData(encodedData)
    const containerRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState<number | null>(null)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    if (state.status === DecodeStatus.LOADING) {
        return (
            <div ref={containerRef} className={styles.status}>
                Loading…
            </div>
        )
    }

    if (state.status === DecodeStatus.ERROR) {
        return (
            <div ref={containerRef} className={styles.status}>
                Chart data could not be loaded.
            </div>
        )
    }

    return (
        <div ref={containerRef}>
            {width !== null && (
                <ChartErrorBoundary>
                    <PluralFamilyChart
                        width={width}
                        patriarchTimeline={state.data.patriarchTimeline}
                        timelines={state.data.timelines}
                        showBrush={!isMobile}
                    />
                </ChartErrorBoundary>
            )}
        </div>
    )
}
