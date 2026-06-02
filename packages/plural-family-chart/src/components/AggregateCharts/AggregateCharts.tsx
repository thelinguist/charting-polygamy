import styles from "./AggregateCharts.module.css"
import { useContainerWidth } from "../../hooks/useContainerWidth"
import type { PatriarchData } from "lib"
import { type BinWidthOptions, useAggregateData } from "./useAggregateData"
import { WifeAgeHistogram } from "./WifeAgeHistogram"
import { FirstVsSubsequentHistogram } from "./FirstVsSubsequentHistogram"
import { AgeGapHistogram } from "./AgeGapHistogram"
import { WifeAgeByOrderChart } from "./WifeAgeByOrderChart"
import { MarriagesByDecadeChart } from "./MarriagesByDecadeChart"
import { GapBetweenMarriagesChart } from "./GapBetweenMarriagesChart"
import { FamilySizeChart } from "./FamilySizeChart"
import { ConcurrentWivesChart } from "./ConcurrentWivesChart"
import { PatriarchWifeAgeScatter } from "./PatriarchWifeAgeScatter"
import { MarriageOutcomesPie } from "./MarriageOutcomesPie"
import { PALETTE_PER_CHART } from "./shared/colors"

export interface AggregateChartsProps {
    chartData: Record<string, PatriarchData>
    /** Non-polygamous families to include in family-size and scatter charts. */
    monogamousData?: Record<string, PatriarchData>
    /** Minimum number of polygamists with age data before rendering. Defaults to 2. */
    minDataPoints?: number
    /** Suppress the "Aggregate statistics" eyebrow when embedded inside another header. */
    hideHeader?: boolean
    /** Override histogram bin widths. Defaults match the hardcoded constants. */
    binWidths?: BinWidthOptions
}

export function AggregateCharts({
    chartData,
    monogamousData,
    minDataPoints = 2,
    hideHeader = false,
    binWidths,
}: AggregateChartsProps) {
    const [containerRef, width] = useContainerWidth()

    const data = useAggregateData(chartData, monogamousData, binWidths)

    // Guard: need sufficient data points to show meaningful distributions
    const hasEnough = data.allWifeCount >= minDataPoints
    if (!hasEnough) return null

    // Compute per-tile width from the CSS grid column count
    const cols = Math.max(1, Math.floor(width / 420))
    const tileWidth = Math.floor((width - (cols - 1) * 24) / cols)

    return (
        <div className={hideHeader ? styles.rootEmbedded : styles.root}>
            {!hideHeader && <div className={styles.eyebrow}>Aggregate statistics</div>}
            <div ref={containerRef} className={styles.grid}>
                <div className={styles.tileSpan2}>
                    <div className={styles.tileTitle}>Patriarch age vs. wife age at marriage</div>
                    <PatriarchWifeAgeScatter
                        scatterPoints={data.scatterPoints}
                        width={width}
                        colorSingle={PALETTE_PER_CHART.scatterSingle}
                        colorPreviouslyMarried={PALETTE_PER_CHART.scatterPreviouslyMarried}
                    />
                    <p className={styles.description}>
                        Each point represents a single marriage, plotted by the patriarch's age (x-axis) against the
                        wife's age (y-axis). The shaded band shows the expected husband age (±1 SD) for each wife age
                        group, derived from{" "}
                        <a href="https://usa.ipums.org/usa/sda/" target="_blank" rel="noopener noreferrer">
                            IPUMS USA 1850–1880 full-count census microdata
                        </a>
                        . Points to the right of the band represent marriages where the patriarch was older than the
                        national norm for that wife age; points to the left represent younger husbands. The dashed
                        diagonal marks equal age between husband and wife.
                    </p>
                </div>

                <div>
                    <div className={styles.tileTitle}>Women's age at marriage</div>
                    <WifeAgeHistogram
                        bins={data.allWifeBins}
                        maxCount={data.maxAgeCount}
                        sampleN={data.allWifeCount}
                        width={tileWidth}
                        fill={PALETTE_PER_CHART.wifeAge}
                    />
                    <p className={styles.description}>
                        This chart shows the count of women who got married at a given age.
                    </p>
                </div>

                <div>
                    <div className={styles.tileTitle}>First wife vs. subsequent wives</div>
                    <FirstVsSubsequentHistogram
                        firstWifeBins={data.firstWifeBins}
                        firstWifeCount={data.firstWifeCount}
                        subsequentWifeBins={data.subsequentWifeBins}
                        subsequentWifeCount={data.subsequentWifeCount}
                        maxCount={data.maxAgeCount}
                        width={tileWidth}
                        fillFirst={PALETTE_PER_CHART.firstWife}
                        fillSubsequent={PALETTE_PER_CHART.subsequentWife}
                    />
                    <p className={styles.description}>
                        This graph plots the age at marriage and compares the age of the first wife vs the age of later
                        wives (sister wives).
                    </p>
                </div>

                <div>
                    <div className={styles.tileTitle}>Patriarch–wife age gap</div>
                    <AgeGapHistogram
                        bins={data.ageGapBins}
                        maxCount={data.maxGapCount}
                        sampleN={data.ageGapCount}
                        width={tileWidth}
                        fillLight={PALETTE_PER_CHART.ageGapLight}
                        fillDark={PALETTE_PER_CHART.ageGapDark}
                    />
                    <p className={styles.description}>
                        Age difference between patriarch and wife at the time of marriage, expressed as years the
                        patriarch was older. The dashed zero line marks an equal-age pairing. Negative values, though
                        less common, indicate a wife older than her husband.
                    </p>
                </div>

                <div>
                    <div className={styles.tileTitle}>Wife age by ordinal position</div>
                    <WifeAgeByOrderChart
                        avgAgeByOrder={data.avgAgeByOrder}
                        width={tileWidth}
                        fill={PALETTE_PER_CHART.wifeAgeByOrder}
                    />
                    <p className={styles.description}>
                        Average wife age at marriage grouped by the order in which she was wed. A declining trend across
                        positions would suggest that patriarchs systematically married younger women as additional wives
                        were taken. Counts per position are noted beneath each bar.
                    </p>
                </div>

                <div>
                    <div className={styles.tileTitle}>Marriages by decade</div>
                    <MarriagesByDecadeChart
                        bins={data.decadeBins}
                        sampleN={data.decadeCount}
                        width={tileWidth}
                        fill={PALETTE_PER_CHART.marriagesByDecade}
                    />
                    <p className={styles.description}>
                        Count of recorded marriages by decade. Vertical markers indicate the Mormon Exodus to Utah
                        (1847) and the Woodruff Manifesto (1890), which formally but ineffectively ended
                        Church-sanctioned polygamy.
                    </p>
                </div>

                <div>
                    <div className={styles.tileTitle}>Years between sequential marriages</div>
                    <GapBetweenMarriagesChart
                        bins={data.sequentialGapBins}
                        sampleN={data.sequentialGapCount}
                        width={tileWidth}
                        fill={PALETTE_PER_CHART.gapBetweenMarriages}
                    />
                    <p className={styles.description}>
                        Elapsed time in years between a patriarch's consecutive marriages. Values near zero indicate
                        marriages entered within the same year, reflecting concurrent plural marriage; larger values
                        suggest sequential, rather than simultaneous, family formation.
                    </p>
                </div>

                <div>
                    <div className={styles.tileTitle}>Family size distribution</div>
                    <FamilySizeChart
                        bins={data.familySizeBins}
                        maxFamilySize={data.maxFamilySize}
                        sampleN={data.familySizeCount}
                        width={tileWidth}
                        fill={PALETTE_PER_CHART.familySize}
                    />
                    <p className={styles.description}>
                        Number of documented wives per patriarch. The majority of practitioners maintained small
                        households; families with five or more wives were uncommon. This dataset reflects known,
                        documented marriages only — the historical record is incomplete for some individuals.
                    </p>
                </div>

                <div>
                    <div className={styles.tileTitle}>Concurrent wives by patriarch age</div>
                    <ConcurrentWivesChart
                        points={data.concurrentWivesByAge}
                        width={tileWidth}
                        fillArea={PALETTE_PER_CHART.concurrentWivesArea}
                        strokeLine={PALETTE_PER_CHART.concurrentWivesLine}
                    />
                    <p className={styles.description}>
                        Average number of simultaneously active marriages at each year of a patriarch's life, aggregated
                        across all patriarchs in the dataset. The curve illustrates at what life stage polygamous
                        households were typically largest.
                    </p>
                </div>

                <div>
                    <div className={styles.tileTitle}>Marriage outcomes</div>
                    <MarriageOutcomesPie
                        marriageOutcomes={data.marriageOutcomes}
                        width={tileWidth}
                        colorStayed={PALETTE_PER_CHART.marriageOutcomesStayed}
                        colorLeft={PALETTE_PER_CHART.marriageOutcomesLeft}
                    />
                    <p className={styles.description}>
                        The percent of dissolved polygamous marriages. A marriage is counted as dissolved only when the
                        recorded end date precedes the patriarch's death and is not attributable to the wife's own
                        death.
                    </p>
                </div>
            </div>
        </div>
    )
}
