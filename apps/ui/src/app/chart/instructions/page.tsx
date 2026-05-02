import Link from "next/link"
import styles from "./instructions.module.css"

export const metadata = {
    title: "Instructions — Charting Polygamy",
}

export default function InstructionsPage() {
    return (
        <div className="shell">
            <div className={styles.page}>
                <section className={styles.intro}>
                    <div className={`flex items-baseline gap-16 ${styles.eyebrowRow}`}>
                        <span className="eyebrow">Getting Started</span>
                        <hr className="rule" />
                    </div>
                    <h1 className={styles.heading}>How to use this tool</h1>
                    <p className="lede">
                        This tool scans your family tree for male ancestors who practiced polygamy. Your data stays in
                        your browser — nothing is sent to a server.
                    </p>
                </section>

                <hr className="rule-soft" />

                <section className={styles.section}>
                    <h2 className={styles.sectionHeading}>Where to start</h2>
                    <p className={styles.body}>You can jump in at one of these points:</p>
                    <ol className={styles.list}>
                        <li>
                            <strong>Upload a file</strong> — GEDCOM exported from FamilySearch, Ancestry, or another
                            genealogy platform. A CSV feature is also available on the upload page.
                        </li>
                        <li>
                            <strong>Build a chart by hand</strong> — Enter a patriarch and his wives directly without a
                            file.
                        </li>
                        <li>
                            <strong>Browse the gallery</strong> — Explore pre-built charts for well-documented
                            historical figures.
                        </li>
                    </ol>
                    <div className={styles.ctas}>
                        <Link href="/chart/upload" className="btn btn-primary">
                            Upload a File →
                        </Link>
                        <Link href="/gallery" className="btn">
                            Browse the Gallery
                        </Link>
                    </div>
                </section>

                <hr className="rule-soft" />

                <section className={styles.section}>
                    <h2 className={styles.sectionHeading}>How to read a chart</h2>
                    <ul className={styles.list}>
                        <li>
                            The <strong>top row</strong> is the patriarch. His bars show each marriage stacked over his
                            lifespan — overlapping bars mark a polygamous interval.
                        </li>
                        <li>
                            The <strong>remaining rows</strong> are his wives. Each colored bar is her marriage to him.
                            Hatched bars indicate a marriage to another man.
                        </li>
                        <li>
                            <strong>Hover or click a bar</strong> to see the marriage year, the wife&#39;s age at
                            marriage, and any prior or subsequent partners.
                        </li>
                    </ul>
                </section>

                <hr className="rule-soft" />

                <section className={styles.section}>
                    <h2 className={styles.sectionHeading}>Common questions</h2>

                    <div className={styles.qa}>
                        <h3 className={styles.question}>How do you identify a polygamist?</h3>
                        <p className={styles.answer}>
                            Any man whose marriages overlap in time is flagged as polygamous. If the data includes a
                            start and end date for each marriage, the tool checks whether two or more intervals are
                            concurrent. If there is no end date, the husband&#39;s death is used as the end date.
                        </p>
                    </div>

                    <div className={styles.qa}>
                        <h3 className={styles.question}>Where should I get my family tree?</h3>
                        <p className={styles.answer}>
                            FamilySearch is the most comprehensive source for LDS lineages. Because FamilySearch does
                            not offer a direct GEDCOM export, export your tree to Ancestry first, then download it as a
                            GEDCOM file. Note that FamilySearch&#39;s export is limited to roughly four generations, so
                            you may need to review record hints to fill in gaps.
                            <br />
                            Other sources you could use are AncestralQuest and WikiTree.{" "}
                        </p>
                        <a style={{ fontSize: 10 }} href="https://github.com/thelinguist/charting-polygamy/issues/new">
                            Update this page?
                        </a>
                    </div>

                    <div className={styles.qa}>
                        <h3 className={styles.question}>Is my data private?</h3>
                        <p className={styles.answer}>
                            Yes. The app runs entirely in your browser. No file contents or family data are transmitted
                            to any server.
                        </p>
                    </div>

                    <div className={styles.qa}>
                        <h3 className={styles.question}>Why focus on the LDS movement?</h3>
                        <p className={styles.answer}>
                            The nineteenth-century Latter-day Saint movement institutionalized plural marriage as
                            doctrine, which means the genealogical record for that period is unusually dense with
                            polygamous households. That makes it the most productive starting point. Support for other
                            traditions is on the roadmap.
                        </p>
                    </div>
                </section>

                <p className="footnote" style={{ marginTop: 32 }}>
                    Some assumptions are made about marriage end dates — when a new marriage begins, a prior one is
                    assumed to have ended. For a small group of figures close to Joseph Smith this assumption does not
                    hold, as plural wives could remain married to earlier husbands simultaneously. The web version of
                    this tool does not model that case.
                </p>
            </div>
        </div>
    )
}
