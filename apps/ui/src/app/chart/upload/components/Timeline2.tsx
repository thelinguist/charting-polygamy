"use client"

import React, { useEffect, useRef, useState } from "react"
import { PluralFamilyChart } from "plural-family-chart"
import { PatriarchTimeline, Timeline } from "lib/src/types"
import styles from "./TimelineRendering.module.css"
import { classNames } from "../../../../lib"
import { Timeline as TimelineFallback } from "./Timeline"

interface Props {
    name: string
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
    timelineFallback: string
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
        if (this.state.hasError) {
            return <TimelineFallback name={this.props.name} timeline={this.props.timelineFallback} />
        }
        return <Timeline2Inner {...this.props} />
    }
}

const Timeline2Inner: React.FC<Props> = ({ name, patriarchTimeline, timelines }) => {
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
        <div className={classNames(styles.chart, styles.timeline)}>
            <div className={styles.header}>
                <h2>{name}</h2>
            </div>
            <div ref={containerRef}>
                <PluralFamilyChart
                    width={width}
                    patriarchTimeline={patriarchTimeline}
                    timelines={timelines}
                />
            </div>
        </div>
    )
}

export const Timeline2 = Timeline2ErrorBoundary
