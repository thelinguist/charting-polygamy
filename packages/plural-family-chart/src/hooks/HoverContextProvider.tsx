import { useOnHoverOrTap } from "./useOnHoverOrTap.ts"
import { HoverContext } from "./HoverContext.tsx"

export const HoverContextProvider = ({ children }) => {
    const { handlers, activeX } = useOnHoverOrTap()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return <HoverContext value={{ activeX, handlers } as HoverContextType}>{children}</HoverContext>
}
