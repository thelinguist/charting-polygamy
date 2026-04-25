import { useOnHoverOrTap } from "./useOnHoverOrTap"
import { HoverContext } from "./HoverContext"

export const HoverContextProvider = ({ children }) => {
    const { handlers, activeX } = useOnHoverOrTap()
    return <HoverContext.Provider value={{ activeX, handlers }}>{children}</HoverContext.Provider>
}
