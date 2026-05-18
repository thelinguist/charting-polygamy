import { MiniPersonTimelines } from "./MiniPersonTimeline"
import { MiniPatriarchMarriages } from "./MiniPatriarchMarriages"
import { MiniWivesTimelines } from "./MiniWivesTimelines"

export const MiniChart = ({ people, xScale, rowHeight, barH, patriarchTimeline, timelines }) => {
    const patriarchDeathMs = patriarchTimeline.death.getTime()

    return (
        <>
            <MiniPersonTimelines people={people} xScale={xScale} rowHeight={rowHeight} barH={barH} />
            <MiniPatriarchMarriages
                marriages={patriarchTimeline.marriages}
                timelines={timelines}
                patriarchDeathMs={patriarchDeathMs}
                rowHeight={rowHeight}
                barH={barH}
                xScale={xScale}
            />
            <MiniWivesTimelines
                timelines={timelines}
                patriarchDeathMs={patriarchDeathMs}
                rowHeight={rowHeight}
                barH={barH}
                xScale={xScale}
            />
        </>
    )
}
