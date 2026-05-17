"use client"

import type { SavedSession } from "../../../../../lib/chartStorage"
import styles from "./SavedDataBanner.module.css"

interface Props {
    session: SavedSession
    onDelete: () => void
    onDismiss: () => void
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
})

function formatSource(session: SavedSession): string {
    if (session.source === "file" && session.fileName) {
        return `from uploaded file "${session.fileName}"`
    }
    return "entered manually"
}

export function SavedDataBanner({ session, onDelete, onDismiss }: Props) {
    const names = session.data.map(e => e.n)
    const nameDisplay =
        names.length === 1
            ? names[0]
            : names.length === 2
              ? `${names[0]} and ${names[1]}`
              : `${names[0]} and ${names.length - 1} others`
    const date = dateFormatter.format(new Date(session.savedAt))

    return (
        <div className={styles.banner}>
            <div className={styles.body}>
                <div className={styles.eyebrow}>Saved session restored</div>
                <p>
                    A chart for <strong>{nameDisplay}</strong>, saved on {date}, has been loaded from your browser.
                    Uploading a new file or entering data manually will replace it.
                </p>
                <div className={styles.source}>{formatSource(session)}</div>
            </div>
            <div className={styles.actions}>
                <button className={styles.delete} onClick={onDelete}>
                    Delete saved data
                </button>
                <button className={styles.dismiss} onClick={onDismiss}>
                    Dismiss
                </button>
            </div>
        </div>
    )
}
