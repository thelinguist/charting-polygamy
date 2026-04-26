"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { PatriarchData } from "lib"
import { decodePatriarchData } from "../../../lib/shareUrl"
import { Timeline2 } from "../upload/components/Timeline2"
import styles from "../upload/components/TimelineRendering.module.css"
import { classNames } from "../../../lib"

type DecodeState = { status: "loading" } | { status: "error" } | { status: "ready"; name: string; data: PatriarchData }

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

export function SharedChart() {
    const searchParams = useSearchParams()
    const encoded = searchParams.get("data")
    const [state, setState] = useState<DecodeState>(encoded ? { status: "loading" } : { status: "error" })

    useEffect(() => {
        if (!encoded) return
        decodePatriarchData(encoded)
            .then(({ name, data }) => setState({ status: "ready", name, data }))
            .catch(() => setState({ status: "error" }))
    }, [encoded])

    if (state.status === "loading") {
        return <div className={classNames(styles.chart, styles.placeholder)}>Loading chart...</div>
    }
    if (state.status === "error") {
        return (
            <ErrorState
                message={encoded ? "This chart link is invalid or corrupted." : "No chart data found in this link."}
            />
        )
    }

    return (
        <div>
            <Timeline2
                name={state.name}
                patriarchTimeline={state.data.patriarchTimeline}
                timelines={state.data.timelines}
                hideShare
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
