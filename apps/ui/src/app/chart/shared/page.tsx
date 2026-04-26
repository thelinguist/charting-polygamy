import { Suspense } from "react"
import { SharedChart } from "./SharedChart"
import styles from "../upload/components/TimelineRendering.module.css"
import { classNames } from "../../../lib"

export default function SharedPage() {
    return (
        <Suspense fallback={<div className={classNames(styles.chart, styles.placeholder)}>Loading chart...</div>}>
            <SharedChart />
        </Suspense>
    )
}