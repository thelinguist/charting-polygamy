"use client"

import React, { useEffect, useState } from "react"
import type { PatriarchData } from "lib"
import styles from "./ManualEntryForm.module.css"

interface WifeEntry {
    id: number
    name: string
    birthYear: string
    deathYear: string
    marriageStartYear: string
    marriageEndYear: string
}

interface Props {
    onChart: (data: Record<string, PatriarchData> | null) => void
}

// Use mid-year dates to avoid UTC midnight → prev-year issues in negative-offset timezones
const yearToDate = (year: number) => new Date(`${year}-07-01`)

// Only accept 4-digit years to avoid invalid dates while the user is still typing
const parseYear = (s: string): Date | undefined => {
    const y = parseInt(s)
    if (isNaN(y) || y < 1000 || y > 2200) return undefined
    return yearToDate(y)
}

let nextId = 1
const emptyWife = (): WifeEntry => ({
    id: nextId++,
    name: "",
    birthYear: "",
    deathYear: "",
    marriageStartYear: "",
    marriageEndYear: "",
})

const parseValidWife = (w: WifeEntry) => {
    if (!w.name.trim()) return null
    const birthDate = parseYear(w.birthYear)
    const deathDate = parseYear(w.deathYear)
    if (!birthDate || !deathDate || deathDate <= birthDate) return null
    return { ...w, birthDate, deathDate }
}

export const ManualEntryForm: React.FC<Props> = ({ onChart }) => {
    const [patriarchName, setPatriarchName] = useState("")
    const [patriarchBirthYear, setPatriarchBirthYear] = useState("")
    const [patriarchDeathYear, setPatriarchDeathYear] = useState("")
    const [wives, setWives] = useState<WifeEntry[]>([emptyWife(), emptyWife()])

    const addWife = () => setWives(prev => [...prev, emptyWife()])

    const removeWife = (id: number) => setWives(prev => prev.filter(w => w.id !== id))

    const updateWife = (id: number, field: keyof Omit<WifeEntry, "id">, value: string) =>
        setWives(prev => prev.map(w => (w.id === id ? { ...w, [field]: value } : w)))

    useEffect(() => {
        const patriarchBirthDate = parseYear(patriarchBirthYear)
        const patriarchDeathDate = parseYear(patriarchDeathYear)

        if (
            !patriarchName.trim() ||
            !patriarchBirthDate ||
            !patriarchDeathDate ||
            patriarchDeathDate <= patriarchBirthDate
        ) {
            onChart(null)
            return
        }

        const validWives = wives.map(parseValidWife).filter(Boolean) as NonNullable<ReturnType<typeof parseValidWife>>[]
        if (validWives.length < 2) {
            onChart(null)
            return
        }

        const marriages = validWives.map(w => ({
            start: parseYear(w.marriageStartYear),
            end: parseYear(w.marriageEndYear),
        }))

        const timelines = validWives.map((w, i) => {
            const marriage = marriages[i]
            return {
                name: w.name.trim(),
                birth: w.birthDate,
                death: w.deathDate,
                linkedMarriage: {
                    start: marriage.start,
                    end: marriage.end,
                } as { start: Date; end?: Date },
                otherMarriages: [] as { start: Date; end: Date; spouse: string }[],
                age: marriage.start ? marriage.start.getFullYear() - w.birthDate.getFullYear() : undefined,
                gap: patriarchBirthDate.getFullYear() - w.birthDate.getFullYear(),
            }
        })

        onChart({
            [patriarchName.trim()]: {
                patriarchTimeline: {
                    name: patriarchName.trim(),
                    birth: patriarchBirthDate,
                    death: patriarchDeathDate,
                    marriages,
                },
                timelines,
            },
        })
    }, [patriarchName, patriarchBirthYear, patriarchDeathYear, wives])

    const validCount = wives.filter(w => parseValidWife(w) !== null).length
    const patriarchBirthDate = parseYear(patriarchBirthYear)
    const patriarchDeathDate = parseYear(patriarchDeathYear)
    const patriarchValid =
        !!patriarchName.trim() &&
        !!patriarchBirthDate &&
        !!patriarchDeathDate &&
        patriarchDeathDate > patriarchBirthDate
    const remaining = patriarchValid ? Math.max(0, 2 - validCount) : null

    return (
        <div className={styles.form}>
            <h3 className={styles.sectionTitle}>Patriarch</h3>
            <div className={styles.row}>
                <label className={styles.wide}>
                    <span>Name</span>
                    <input
                        type="text"
                        placeholder="Full name"
                        value={patriarchName}
                        onChange={e => setPatriarchName(e.target.value)}
                    />
                </label>
                <label>
                    <span>Birth year</span>
                    <input
                        type="number"
                        placeholder="e.g. 1820"
                        value={patriarchBirthYear}
                        onChange={e => setPatriarchBirthYear(e.target.value)}
                    />
                </label>
                <label>
                    <span>Death year</span>
                    <input
                        type="number"
                        placeholder="e.g. 1890"
                        value={patriarchDeathYear}
                        onChange={e => setPatriarchDeathYear(e.target.value)}
                    />
                </label>
            </div>

            <h3 className={styles.sectionTitle}>Wives</h3>
            <div className={styles.wifeHeader}>
                <span className={styles.wide}>Name</span>
                <span>Birth</span>
                <span>Death</span>
                <span>Marriage start</span>
                <span>Marriage end</span>
                <span />
            </div>
            {wives.map(wife => (
                <div key={wife.id} className={styles.row}>
                    <input
                        className={styles.wide}
                        type="text"
                        placeholder="Full name"
                        value={wife.name}
                        onChange={e => updateWife(wife.id, "name", e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="e.g. 1825"
                        value={wife.birthYear}
                        onChange={e => updateWife(wife.id, "birthYear", e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="e.g. 1895"
                        value={wife.deathYear}
                        onChange={e => updateWife(wife.id, "deathYear", e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="optional"
                        value={wife.marriageStartYear}
                        onChange={e => updateWife(wife.id, "marriageStartYear", e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="optional"
                        value={wife.marriageEndYear}
                        onChange={e => updateWife(wife.id, "marriageEndYear", e.target.value)}
                    />
                    <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeWife(wife.id)}
                        aria-label="Remove wife"
                        disabled={wives.length <= 2}
                    >
                        ✕
                    </button>
                </div>
            ))}

            <div className={styles.formFooter}>
                <button type="button" className={styles.addBtn} onClick={addWife}>
                    + Add wife
                </button>
                {remaining !== null && remaining > 0 && (
                    <p className={styles.hint}>
                        {remaining === 1 ? "Add 1 more valid wife" : `Add ${remaining} more valid wives`} to see the
                        chart
                    </p>
                )}
            </div>
        </div>
    )
}
