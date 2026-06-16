import styles from "../upload.module.css"

export function UploadHeader() {
    return (
        <section className={styles.headerSection}>
            <div className="shell">
                <h2 className={styles.heading}>Chart your own tree.</h2>
                <p className={`lede ${styles.lede}`}>
                    Drop in a GEDCOM file, paste a CSV, or build a family by hand. The tool detects men with
                    overlapping marriages and draws each as a stacked timeline.
                </p>
                <p className={`lede ${styles.lede}`}>
                    <b>You will likely need to review your family tree.</b>There may be missing marriage dates that
                    cause families to be hidden in the charts below. Sometimes researchers falsely link a child as a
                    wife or vice versa and there may even be duplicates. Once the tool has identified some plural
                    families, look into supporting facts such as government records to confirm what you are seeing.
                </p>
            </div>
        </section>
    )
}
