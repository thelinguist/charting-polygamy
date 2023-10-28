import { useMediaQuery } from '@uidotdev/usehooks'

export const useIsPortrait = () => {
    const orientation = useMediaQuery('all and (orientation:portrait)')

    return orientation
}

