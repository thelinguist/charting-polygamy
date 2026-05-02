"use client"

import { useEffect, useRef, useState } from "react"
import { PluralFamilyChart } from "plural-family-chart"
import type { PatriarchTimeline, Timeline } from "lib/src/types"
import styles from "./page.module.css"
import { useIsMobile } from "../hooks/useIsMobile"

// this data is made up
const patriarchTimeline: PatriarchTimeline = {
    name: "Thomas Harlow",
    birth: new Date(1822, 0, 1),
    death: new Date(1891, 0, 1),
    marriages: [
        { start: new Date(1845, 0, 1), end: new Date(1891, 0, 1) },
        { start: new Date(1851, 0, 1), end: new Date(1891, 0, 1) },
        { start: new Date(1858, 0, 1), end: new Date(1891, 0, 1) },
    ],
}

const timelines: Timeline[] = [
    {
        name: "Margaret",
        birth: new Date(1827, 0, 1),
        death: new Date(1893, 0, 1),
        linkedMarriage: { start: new Date(1845, 0, 1), end: new Date(1891, 0, 1) },
        otherMarriages: [],
        age: 18,
    },
    {
        name: "Ruth",
        birth: new Date(1833, 0, 1),
        death: new Date(1895, 0, 1),
        linkedMarriage: { start: new Date(1851, 0, 1), end: new Date(1891, 0, 1) },
        otherMarriages: [],
        age: 18,
    },
    {
        name: "Clara",
        birth: new Date(1836, 0, 1),
        death: new Date(1902, 0, 1),
        linkedMarriage: { start: new Date(1858, 0, 1), end: new Date(1891, 0, 1) },
        otherMarriages: [{ start: new Date(1854, 0, 1), end: new Date(1857, 0, 1), spouse: "prior husband" }],
        age: 22,
    },
]

export function IllustrativePatriarch() {
    const isMobile = useIsMobile()
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
        <section className={styles.figureSection}>
            <div className="shell">
                <div className={`flex items-baseline justify-between ${styles.figureHeader}`}>
                    <div>
                        <div className="eyebrow">Figure 01</div>
                        <h3 className={styles.figureHeading}>An illustrative patriarch</h3>
                    </div>
                    <p className={`footnote ${styles.figureCaption}`}>
                        Hover a row to inspect a wife&#39;s lifespan, age at marriage, and any prior partner.
                    </p>
                </div>
                <div ref={containerRef}>
                    <PluralFamilyChart width={width} patriarchTimeline={patriarchTimeline} timelines={timelines} showBrush={!isMobile} />
                </div>
            </div>
        </section>
    )
}
