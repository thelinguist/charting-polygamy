import { useState, useEffect, useRef, useCallback } from 'react';

export function useHoverOrTap<T extends SVGElement>(): [React.RefObject<T>, boolean] {
    const [isActive, setIsActive] = useState(false);
    const ref = useRef<T>(null);

    const handleMouseEnter = useCallback(() => setIsActive(true), []);
    const handleMouseLeave = useCallback(() => setIsActive(false), []);

    const handleTouchStart = useCallback(() => setIsActive(true), []);
    const handleTouchEnd = useCallback(() => {
        setIsActive(false);
    }, []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        console.log('useHoverOrTap: element', element);
        let isTouchDevice = false;
        if (typeof window !== 'undefined') {
            isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        }

        if (isTouchDevice) {
            element.addEventListener('touchstart', handleTouchStart);
            element.addEventListener('touchend', handleTouchEnd);
            element.addEventListener('touchcancel', handleTouchEnd);
        } else {
            element.addEventListener('mouseenter', handleMouseEnter);
            element.addEventListener('mouseleave', handleMouseLeave);
            // Removed mouseup listener for standard hover behavior
        }

        return () => {
            if (element) { // Check element again before removing listeners
                if (isTouchDevice) {
                    element.removeEventListener('touchstart', handleTouchStart);
                    element.removeEventListener('touchend', handleTouchEnd);
                    element.removeEventListener('touchcancel', handleTouchEnd);
                } else {
                    element.removeEventListener('mouseenter', handleMouseEnter);
                    element.removeEventListener('mouseleave', handleMouseLeave);
                    // Ensure no mouseup listener to remove if it's not added
                }
            }
        };
    }, [ref, handleMouseEnter, handleMouseLeave, handleTouchStart, handleTouchEnd]); // Removed handleToggle from dependencies

    console.log(isActive); // You can keep this for debugging if needed
    return [ref, isActive];
}