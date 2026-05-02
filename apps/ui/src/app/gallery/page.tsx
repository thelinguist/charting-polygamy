import styles from "./gallery.module.css"
import { GalleryRow } from "./GalleryRow"
import { PREBAKED } from "../../constants/pre-baked"
export default function GalleryPage() {
    return (
        <>
            <section className={styles.headerSection}>
                <div className="shell">
                    <div className={`flex items-baseline gap-16 ${styles.eyebrow}`}>
                        <span className="eyebrow">№ 004 — Gallery</span>
                        <hr className="rule" />
                    </div>
                    <h2>Pre-baked charts of well-documented patriarchs.</h2>
                    <p className={`lede ${styles.lede}`}>
                        Figures whose plural-marriage lives are widely known or are notably significant.
                    </p>
                </div>
            </section>

            <section className={styles.rowsSection}>
                <div className="shell">
                    <div className={styles.rows}>
                        {PREBAKED.map((profile, i) => (
                            <GalleryRow key={profile.name} profile={profile} index={i} />
                        ))}
                    </div>
                    <p className={`footnote ${styles.footnote}`}>
                        † Dates and wife counts are drawn from historical sources and may be approximate. They are
                        suitable for visualization purposes but should be verified against primary records before
                        citation.
                    </p>
                </div>
            </section>
        </>
    )
}
