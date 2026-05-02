import { useEffect, useState } from "react"
import { decodePatriarchData } from "../lib/shareUrl"
import { PatriarchData } from "lib"

export enum DecodeStatus {
    LOADING,
    READY,
    ERROR,
}

type DecodeState =
    | { status: DecodeStatus.LOADING }
    | { status: DecodeStatus.ERROR }
    | { status: DecodeStatus.READY; name: string; data: PatriarchData }

export const useDecodeData = encoded => {
    const [state, setState] = useState<DecodeState>(
        encoded ? { status: DecodeStatus.LOADING } : { status: DecodeStatus.ERROR }
    )

    useEffect(() => {
        if (!encoded) return
        decodePatriarchData(encoded)
            .then(({ name, data }) => setState({ status: DecodeStatus.READY, name, data }))
            .catch(() => setState({ status: DecodeStatus.ERROR }))
    }, [encoded])

    return {
        state,
    }
}
