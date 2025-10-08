import { createContext } from "react"
import { HoverHandlers, useOnHoverOrTap } from "./useOnHoverOrTap"

interface HoverContextType {
    activeX: number
    handlers: HoverHandlers
}

export const HoverContext = createContext<HoverContextType>(undefined)

export const HoverContextProvider = ({ children }) => {
    const { handlers, activeX } = useOnHoverOrTap()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return <HoverContext value={{ activeX, handlers } as HoverContextType}>{children}</HoverContext>
}
