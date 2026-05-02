"use client"

import { Suspense } from "react"
import { SharedChart } from "./SharedChart"
import styles from "../upload/components/TimelinesViewer.module.css"
import { classNames } from "../../../lib"
import { useSearchParams } from "next/navigation"

function SharedChartLoader() {
    const searchParams = useSearchParams()
    const encoded = searchParams.get("data")
    return <SharedChart encoded={encoded} />
}

export default function SharedPage() {
    return (
        <Suspense fallback={<div className={classNames(styles.chart, styles.placeholder)}>Loading chart...</div>}>
            <SharedChartLoader />
        </Suspense>
    )
}
