"use client"

import { classNames, downloadSVGFromDOM, nameToId } from "../../../../lib"
import styles from "./TimelineRendering.module.css"
import { Mermaid } from "./Mermaid"
import React, { useMemo } from "react"

export const Timeline: React.FunctionComponent<{
    timeline: string
    name: string
}> = ({ timeline, name }) => {
    const id = useMemo(() => nameToId(name), [name])
    const handleSave = () => downloadSVGFromDOM(id, { asPNG: true, fileName: name })
    const handleSaveSVG = () => downloadSVGFromDOM(id, { fileName: name })

    return (
        <div key={name} className={classNames(styles.chart, styles.timeline)}>
            <div className={styles.header}>
                <h2>{name}</h2>
                <div className={styles.actions}>
                    <button onClick={handleSave}>save as png</button>
                    <button onClick={handleSaveSVG}>save as svg</button>
                </div>
            </div>

            <Mermaid chart={timeline} title={name} id={id} />
        </div>
    )
}
