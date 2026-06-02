// Parchment background — matches PluralFamilyChart background
export const BG = "#f1ead8"
export const TOOLTIP_BG = "#2e2a22"

// Axis
export const AXIS_COLOR = "#5a5446"
export const GRID_COLOR = "rgba(139,90,43,0.15)"

// Bar fill colors (from PluralFamilyChart/constants.ts)
export const WIFE_BROWN = "#8c5a3a"
export const SPOUSE_TAN = "#b0a794"
export const PATRIARCH_LIGHT = "#6375a0"
export const PATRIARCH_DARK = "#3b4a6b"

// Scatter chart: prior-marriage status colors
export const COLOR_PREVIOUSLY_MARRIED = "#7c5fa0" // muted purple
export const COLOR_SINGLE = "#4a7a52" // muted sage green

/**
 * each chart receives a distinct archival tone so the grid
 * is visually differentiated at a glance. Colors remain within the
 * warm-earth / muted-archival palette.
 */
export const PALETTE_PER_CHART = {
    // WifeAge → rust
    wifeAge: "#9a4a2a",
    // FirstVsSubsequent → sage (first) vs slate (subsequent)
    firstWife: "#5a7a5a",
    subsequentWife: "#6a7a8a",
    // AgeGap → ochre (positive gap) / deeper ochre (negative)
    ageGapLight: "#8a7a3a",
    ageGapDark: "#5a4e22",
    // FamilySize → slate blue
    familySize: "#5a7090",
    // WifeAgeByOrder → dusty rose
    wifeAgeByOrder: "#8a5a6a",
    // MarriagesByDecade → forest green
    marriagesByDecade: "#4a6a4a",
    // GapBetweenMarriages → muted teal
    gapBetweenMarriages: "#4a7a7a",
    // ConcurrentWives → steel blue (area + line)
    concurrentWivesArea: "#5a6a7a",
    concurrentWivesLine: "#36454f",
    // Scatter — unchanged (meaning-bearing colors)
    scatterSingle: COLOR_SINGLE,
    scatterPreviouslyMarried: COLOR_PREVIOUSLY_MARRIED,
    // MarriageOutcomes — muted teal vs warm umber
    marriageOutcomesStayed: "#4a6a6a",
    marriageOutcomesLeft: "#8a6a4a",
} as const
