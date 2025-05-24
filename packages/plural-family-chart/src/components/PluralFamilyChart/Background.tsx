import { LinearGradient } from "@visx/gradient"

interface Props {
    backgroundColor: string
    outerWidth: number
    outerHeight: number
    rx?: number
}
export const Background: React.FC<Props> = ({ backgroundColor, outerWidth, outerHeight, rx }) => (
    <>
        <LinearGradient id="visx-axis-gradient" from={backgroundColor} to={backgroundColor} toOpacity={0.5} />
        <rect x={0} y={0} width={outerWidth} height={outerHeight} fill={"url(#visx-axis-gradient)"} rx={rx} />
    </>
)
