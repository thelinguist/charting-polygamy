"use client"

import React, { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"
import useOnScreen from "../../../../hooks/useOnScreen"

mermaid.initialize({ startOnLoad: true, securityLevel: "antiscript" }) // allow html tags, clicking, but not scripting

export const Mermaid: React.FunctionComponent<{
    chart: string
    title: string
}> = ({ chart, title }) => {
    const chartDiv = useRef<HTMLDivElement>(null)
    const isVisible = useOnScreen(chartDiv)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (isVisible) {
            mermaid.contentLoaded()
            mermaid.setParseErrorHandler(err => {
                console.error(title, err)
                // sometimes it still renders sometimes it doesn't
                // setError(true)
            })
        }
    }, [isVisible])

    if (error) return <div>could not render graph for {title}</div>
    return (
        <div ref={chartDiv} className="mermaid">
            {chart}
        </div>
    )
}
