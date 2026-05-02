"use client"

import React, { useEffect, useRef, useState } from "react"
import { PluralFamilyChart } from "plural-family-chart"
import { PatriarchTimeline, Timeline } from "lib/src/types"
import styles from "./TimelineRendering.module.css"
import { classNames } from "../../../../lib"
import { Timeline as TimelineFallback } from "./Timeline"
import { encodePatriarchData } from "../../../../lib/shareUrl"

interface Props {
    name: string
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
    timelineFallback?: string
    hideShare?: boolean
    chartWidth?: number
}

interface ErrorBoundaryState {
    hasError: boolean
}

class Timeline2ErrorBoundary extends React.Component<Props, ErrorBoundaryState> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true }
    }

    componentDidCatch(error: Error) {
        console.error("Timeline2 error for", this.props.name, error)
        console.log("patriarchTimeline", this.props.patriarchTimeline)
        console.log("timelines", this.props.timelines)
    }

    render() {
        if (this.state.hasError && this.props.timelineFallback) {
            return <TimelineFallback name={this.props.name} timeline={this.props.timelineFallback} />
        }
        return <Timeline2Inner {...this.props} />
    }
}

const Timeline2Inner: React.FC<Props> = ({ name, patriarchTimeline, timelines, hideShare, chartWidth }) => {
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
                <PluralFamilyChart width={width} patriarchTimeline={patriarchTimeline} timelines={timelines} />
            </div>
        </div>
    )
}

export const Timeline2 = Timeline2ErrorBoundary
