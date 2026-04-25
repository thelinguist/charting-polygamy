import { createContext } from "react"
import { HoverHandlers } from "./useOnHoverOrTap"

interface HoverContextType {
    activeX: number
    handlers: HoverHandlers
}

export const HoverContext = createContext<HoverContextType | undefined>(undefined)
