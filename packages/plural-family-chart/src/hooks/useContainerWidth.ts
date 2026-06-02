import { useEffect, useRef, useState, type RefObject } from "react"

export function useContainerWidth(initialWidth = 600): [RefObject<HTMLDivElement|null>, number] {
    const ref = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(initialWidth)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
        observer.observe(el)
        return () => observer.disconnect()
    }, [])
    return [ref, width]
}
