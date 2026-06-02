import { AXIS_COLOR } from "../shared/colors"
import { getAveragedBins } from "../shared/ipumsReference"

// Pre-compute averaged IPUMS bins (stable across renders)
const IPUMS_BINS = getAveragedBins()

export const AverageGapArea = ({ xScale, yScale }) => {
    // ── IPUMS conditional reference band ─────────────────────────────────────
    // Each bin: given wife age range, what was the mean (±1 SD) husband age
    // in the U.S. 1850–1880 censuses? The band is drawn in (husband_age, wife_age)
    // space — x = husband age (patriarch axis), y = wife age midpoint.
    const bandPoints = IPUMS_BINS.map(b => ({
        wifeAgeMid: (b.wifeAgeMin + b.wifeAgeMax) / 2,
        meanHusbandAge: b.meanHusbandAge,
        sdHusbandAge: b.sdHusbandAge,
    }))

    // Build SVG path: right edge (mean + SD) top→bottom, then left edge (mean − SD) bottom→top
    const upperEdge = bandPoints.map(p => ({
        x: xScale(p.meanHusbandAge + p.sdHusbandAge) ?? 0,
        y: yScale(p.wifeAgeMid) ?? 0,
    }))
    const lowerEdge = [...bandPoints].reverse().map(p => ({
        x: xScale(p.meanHusbandAge - p.sdHusbandAge) ?? 0,
        y: yScale(p.wifeAgeMid) ?? 0,
    }))

    const bandPath = [
        `M ${upperEdge[0].x} ${upperEdge[0].y}`,
        ...upperEdge.slice(1).map(p => `L ${p.x} ${p.y}`),
        ...lowerEdge.map(p => `L ${p.x} ${p.y}`),
        "Z",
    ].join(" ")

    // Gradient: fade band to transparent as wife age approaches the oldest bins (~55+)
    // gradientUnits="userSpaceOnUse" so y values match the yScale coordinate space
    const fadeFullY = yScale(47) ?? 0 // fully opaque below this SVG y
    const fadeNoneY = yScale(57.5) ?? 0 // fully transparent above this SVG y

    // Label at the youngest (top-left) end of the band
    const firstPoint = bandPoints[0]
    const citationX = xScale(firstPoint.meanHusbandAge - firstPoint.sdHusbandAge) ?? 0
    const citationY = (yScale(firstPoint.wifeAgeMid) ?? 0) - 6

    const centerPath = bandPoints
        .map((p, i) => {
            const x = xScale(p.meanHusbandAge) ?? 0
            const y = yScale(p.wifeAgeMid) ?? 0
            return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
        })
        .join(" ")
    return (
        <>
            <defs>
                <linearGradient
                    id="ipums-band-fill"
                    x1="0"
                    y1={fadeNoneY}
                    x2="0"
                    y2={fadeFullY}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#4a6a52" stopOpacity={0} />
                    <stop offset="100%" stopColor="#4a6a52" stopOpacity={0.07} />
                </linearGradient>
                <linearGradient
                    id="ipums-band-stroke"
                    x1="0"
                    y1={fadeNoneY}
                    x2="0"
                    y2={fadeFullY}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#4a6a52" stopOpacity={0} />
                    <stop offset="100%" stopColor="#4a6a52" stopOpacity={0.5} />
                </linearGradient>
            </defs>

            {/* IPUMS conditional reference band: U.S. national norm 1850–1880 */}
            <path d={bandPath} fill="url(#ipums-band-fill)" stroke="none" />
            <path d={centerPath} fill="none" stroke="url(#ipums-band-stroke)" strokeWidth={1} strokeDasharray="4 2" />
            <text
                x={citationX}
                y={citationY}
                fill={AXIS_COLOR}
                fontSize={9}
                fontFamily="monospace"
                opacity={0.6}
                textAnchor="start"
            >
                U.S. 1800s average gap
            </text>
        </>
    )
}
