import React, { useEffect, useRef } from 'react'
import mermaid from "mermaid"


mermaid.initialize({ startOnLoad: true })

export const Mermaid:React.FunctionComponent<{ chart: string }> = ({ chart }) => {
  const chartDiv = useRef<HTMLDivElement>(null)


  useEffect(() => {
    mermaid.contentLoaded()
  }, [])

  return (
    <div ref={chartDiv} className={"mermaid"}>
      {chart}
    </div>
  )
}
