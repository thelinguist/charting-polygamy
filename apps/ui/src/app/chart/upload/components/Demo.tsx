'use client'

import React, {ChangeEventHandler, useState} from 'react'
import {Mermaid} from './Mermaid'
import {getTimelinesForMermaid} from 'lib'
import {FileTypes} from 'lib/src/types'

const parseFile = async (fileRef, onprogress): Promise<string> => {
    const reader = new FileReader()
    return await new Promise((resolve, reject) => {
        reader.onload = (e) => {
            if (!e.target?.result) {
                reject()
            } else {
                resolve(e.target.result as string)
            }
        }
        reader.readAsText(fileRef)
        reader.onerror = (e) => reject(e)
        // @ts-expect-error basically any
        reader.onprogress = e => onprogress(e.target?.loaded / e.target?.total)
    })
}

export const Demo = () => {
    const [timelines, setTimelines] = useState<Record<string, string>>({})

    const onChange: ChangeEventHandler = async (e) => {
        e.preventDefault()
        // @ts-expect-error basically any
        const fileContents = await parseFile(e.target.files[0], console.info)
        const newTimelines = getTimelinesForMermaid(fileContents, FileTypes.ged)
        setTimelines(newTimelines)
    }
    return (
        <div className={'form'}>
            <div className={'formGroup chart'}>
                <label>upload a gedcom file</label>
                <input type={'file'} onChange={onChange}/>
            </div>
            <div>
                graphs here
                {Object.keys(timelines).map(name => <div className="chart">
                    <Mermaid key={name} chart={timelines[name]}/>
                </div>)}
            </div>
        </div>
    )
}
