import { useCallback, useState } from "react"

export const useOnHoverOrTap = () => {
    const [isActive, setIsActive] = useState(false)

    // Event handlers
    const handleActivate = useCallback(() => {
        setIsActive(true)
    }, [])

    const handleDeactivate = useCallback(() => {
        setIsActive(false)
    }, [])
    return {
        handlers: {
            onMouseEnter: handleActivate,
            onMouseLeave: handleDeactivate,
            onTouchStart: handleActivate,
            onTouchEnd: handleDeactivate,
            onTouchCancel: handleDeactivate,
        },
        isActive,
    }
}
