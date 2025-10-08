import { MouseEventHandler, TouchEventHandler, useCallback, useState } from "react"

export interface HoverHandlers {
    onMouseEnter: MouseEventHandler
    onMouseLeave: MouseEventHandler
    onTouchStart: TouchEventHandler
    onTouchEnd: TouchEventHandler
    onTouchCancel: TouchEventHandler
}

export const useOnHoverOrTap = () => {
    const [activeX, setActiveX] = useState<number>()

    const handleActivate = useCallback((event: MouseEvent | TouchEvent) => {
        setActiveX(parseFloat((event.target as HTMLElement)?.id))
    }, [])

    // todo this is called when you hover over an item in front of current
    const handleDeactivate = useCallback(() => {
        setActiveX(undefined)
    }, [])
    return {
        handlers: {
            onMouseEnter: handleActivate as unknown as MouseEventHandler,
            onMouseLeave: handleDeactivate as unknown as MouseEventHandler,
            onTouchStart: handleActivate as unknown as TouchEventHandler,
            // onTouchEnd: handleDeactivate as unknown as TouchEventHandler,
            // onTouchCancel: handleDeactivate as unknown as TouchEventHandler,
        } as HoverHandlers,
        activeX,
    }
}
