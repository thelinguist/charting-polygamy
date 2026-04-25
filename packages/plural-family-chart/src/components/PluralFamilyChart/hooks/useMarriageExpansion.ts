import React from "react"

/**
 * tracks the index that was hovered/clicked on in a list of items (marriages for example)
 */
export function useMarriageExpansion() {
    const [pinnedIndex, setPinnedIndex] = React.useState<number | null>(null)
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
    const expandedIndex = hoveredIndex ?? pinnedIndex

    const handleClick = (index: number) => {
        setPinnedIndex(prev => (prev === index ? null : index))
    }

    return { expandedIndex, handleClick, setHoveredIndex }
}
