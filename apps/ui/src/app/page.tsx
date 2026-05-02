import Link from "next/link"
import styles from "./page.module.css"
import { PREBAKED_SAMPLE } from "../constants/pre-baked"

const STEPS = [
    {
        n: "i.",
        t: "Bring your tree",
        d: "Drop in a GEDCOM file from FamilySearch or Ancestry, or enter a family by hand. Files are parsed in your browser; nothing is sent anywhere.",
    },
    {
        n: "ii.",
        t: "Detect concurrent marriages",
        d: "The tool scans for men with overlapping marriage intervals, then assembles a per-patriarch timeline of wives and lifespans.",
    },
    {
        n: "iii.",
        t: "Read the chart",
        d: "Each row is one person. Each colored bar is a marriage. Stacked bars on the patriarch row indicate the polygamous interval.",
    },
]

export default function Home() {
    return (
        <>
            {/* HERO — chart-led variant */}
            <section className={styles.heroSection}>
                <div className="shell">
                    <div className={`flex items-baseline gap-16 ${styles.heroEyebrow}`}>
                        <span className="eyebrow">A Family-History Study</span>
                        <hr className="rule" />
                    </div>
                    <h1 className={styles.heroHeading}>
                        What was it like to live in a{" "}
                        <em className={`italic-serif ${styles.heroAccent}`}>plural family</em>?
                    </h1>
                    <p className={`lede ${styles.heroLede}`}>
                        A tool for visualizing plural-marriage households in family-tree data. Upload a GEDCOM or enter
                        a family by hand — everything runs in your browser.
                    </p>
                    <div className={`flex gap-12 ${styles.heroCtas}`}>
                        <Link href="/chart/upload" className="btn btn-primary">
                            Chart Your Tree →
                        </Link>
                        <Link href="/gallery" className="btn">
                            Browse the Gallery
                        </Link>
                    </div>
                </div>
            </section>

            <hr className="rule-soft" />

            {/* HOW IT WORKS */}
            <section>
                <div className="shell">
                    <div className={`flex items-baseline gap-16 ${styles.methodEyebrow}`}>
                        <span className="eyebrow">№ 002 — Method</span>
                        <hr className="rule" />
                    </div>
                    <div className={styles.stepsGrid}>
                        {STEPS.map((step, i) => (
                            <div key={i}>
                                <div className={styles.stepNumeral}>{step.n}</div>
                                <h3 className={styles.stepHeading}>{step.t}</h3>
                                <p className={styles.stepBody}>{step.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GALLERY CALLOUT */}
            <section className="tight">
                <div className="shell">
                    <div className={styles.galleryCallout}>
                        <div>
                            <div className={`eyebrow ${styles.galleryEyebrow}`}>Gallery</div>
                            <h2 className={styles.galleryHeading}>
                                Look at timelines from historical and public figures.
                            </h2>
                            <p className={styles.galleryBody}>
                                Visualize family life for figures whose plural households are widely discussed in
                                history — from the founder of the Mormon Movement through to a modern fundamentalist
                                offshoot.
                            </p>
                            <Link href="/gallery" className="btn btn-primary">
                                Open the Gallery →
                            </Link>
                        </div>
                        <div className={styles.prebaked}>
                            {PREBAKED_SAMPLE.map(p => (
                                <div
                                    key={p.name}
                                    className={`flex justify-between items-baseline ${styles.prebakedRow}`}
                                >
                                    <span className={styles.prebakedName}>{p.name}</span>
                                    <span>
                                        {p.born}{p.died ? `-${p.died}` : "—"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
