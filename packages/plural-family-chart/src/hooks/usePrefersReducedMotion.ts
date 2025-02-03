export const usePrefersReducedMotion = () => {
    // use non-animated components if prefers-reduced-motion is set
    const prefersReducedMotionQuery =
        typeof window === "undefined" ? false : window.matchMedia("(prefers-reduced-motion: reduce)")
    return !(!prefersReducedMotionQuery || !!prefersReducedMotionQuery.matches)
}
