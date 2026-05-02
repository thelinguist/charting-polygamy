"use client"

import { Suspense } from "react"
import { SharedChart } from "./SharedChart"
import styles from "../upload/components/TimelineRendering.module.css"
import { classNames } from "../../../lib"
import { useSearchParams } from "next/navigation"

export default function SharedPage() {
    const searchParams = useSearchParams()
    const encoded = searchParams.get("data")
    return (
        <Suspense fallback={<div className={classNames(styles.chart, styles.placeholder)}>Loading chart...</div>}>
            <SharedChart encoded={encoded} />
        </Suspense>
    )
}
