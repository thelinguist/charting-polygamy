"use client"

import Link from "next/link"
import { TimelineComponent } from "../../../components/Timelines/TimelineComponent"
import styles from "../upload/components/TimelinesViewer.module.css"
import { classNames } from "../../../lib"
import { DecodeStatus, useDecodeData } from "../../../hooks/useDecodeData"

function ErrorState({ message }: { message: string }) {
    return (
        <div className={classNames(styles.chart, styles.placeholder)}>
            <div>
                <p>{message}</p>
                <Link href="/chart/upload">Create your own chart →</Link>
            </div>
        </div>
    )
}

interface Props {
    encoded?: string | null
    width?: number
}

export function SharedChart({ encoded, width }: Props) {
    const { state } = useDecodeData(encoded)

    if (state.status === DecodeStatus.LOADING) {
        return <div className={classNames(styles.chart, styles.placeholder)}>Loading chart...</div>
    }
    if (state.status === DecodeStatus.ERROR) {
        return (
            <ErrorState
                message={encoded ? "This chart link is invalid or corrupted." : "No chart data found in this link."}
            />
        )
    }

    return (
        <div>
            <TimelineComponent
                name={state.name}
                patriarchTimeline={state.data.patriarchTimeline}
                timelines={state.data.timelines}
                hideShare
                chartWidth={width}
            />
            <div className={classNames(styles.chart, styles.cta)}>
                <p>This chart was generated with Charting Polygamy.</p>
                <div>
                    <Link href="/chart/upload">Upload your own family tree →</Link>
                </div>
                <div>
                    <Link href="/chart/upload">Try the demo →</Link>
                </div>
            </div>
        </div>
    )
}
