import { Component, type ReactNode } from "react"

interface Props {
    children: ReactNode
}

interface State {
    error: Error | null
}

export class ChartErrorBoundary extends Component<Props, State> {
    state: State = { error: null }

    static getDerivedStateFromError(error: Error): State {
        return { error }
    }

    componentDidCatch(error: Error) {
        console.error("PluralFamilyChart render error:", error)
    }

    render() {
        if (this.state.error) {
            return (
                <div
                    style={{
                        padding: "24px",
                        border: "1px solid var(--rule-soft)",
                        background: "var(--bg-elev)",
                        fontFamily: "var(--mono)",
                        fontSize: 12,
                        color: "var(--ink-mute)",
                        letterSpacing: "0.05em",
                    }}
                >
                    Chart could not be rendered.
                </div>
            )
        }
        return this.props.children
    }
}
