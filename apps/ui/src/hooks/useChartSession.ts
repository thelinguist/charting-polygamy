import { useState } from "react"
import type { PatriarchData } from "lib"
import { loadSession, clearSession, deserializeSession, type SavedSession } from "../lib/chartStorage"

export function useChartSession(): {
    initialChartData: Record<string, PatriarchData> | null
    showBanner: boolean
    savedSession: SavedSession | null
    dismissBanner: () => void
    deleteSession: () => void
} {
    const [savedSession] = useState<SavedSession | null>(() => loadSession())
    const [isDismissed, setIsDismissed] = useState(false)
    const [initialChartData] = useState<Record<string, PatriarchData> | null>(() =>
        savedSession ? deserializeSession(savedSession) : null,
    )

    return {
        initialChartData,
        showBanner: savedSession !== null && !isDismissed,
        savedSession,
        dismissBanner: () => setIsDismissed(true),
        deleteSession: () => {
            clearSession()
            setIsDismissed(true)
        },
    }
}
