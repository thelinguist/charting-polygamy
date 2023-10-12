import React, {ChangeEventHandler, useState} from 'react'
import {Mermaid} from './Mermaid.tsx'
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        reader.onprogress = e => onprogress(e.target?.loaded / e.target?.total)
    })
}

export const Demo = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [timelines, setTimelines] = useState<Record<string, string>>({})

    const onChange: ChangeEventHandler = async (e) => {
        e.preventDefault()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
