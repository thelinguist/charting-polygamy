import React, { useEffect, useRef } from "react"
import mermaid from "mermaid"
import useOnScreen from "../hooks/useOnScreen.ts"

mermaid.initialize({ startOnLoad: true })

export const Mermaid: React.FunctionComponent<{ chart: string }> = ({
    chart,
}) => {
    const chartDiv = useRef<HTMLDivElement>(null)
    const isVisible = useOnScreen(chartDiv)

    useEffect(() => {
        if (isVisible) {
            mermaid.contentLoaded()
        }
    }, [isVisible])

    return (
        <div ref={chartDiv} className={"mermaid"}>
            {chart}
        </div>
    )
}
