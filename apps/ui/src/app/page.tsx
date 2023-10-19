import Link from "next/link"
import styles from "./page.module.css"

export default function Home() {
    return (
        <>
            <div className={styles.description}>
                <h1>Charting Polygamy</h1>
            </div>

            <div className={styles.center}></div>

            <div className={styles.grid}>
                <Link href="/chart/instructions" className={styles.card}>
                    <h2>
                        Chart my Tree <span>-&gt;</span>
                    </h2>
                    <p>see your ancestry and detect polygamous families</p>
                    <span>tree icon</span>
                </Link>

                <a
                    href="https://en.wikipedia.org/wiki/Mormonism_and_polygamy"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2>
                        about polygamy <span>-&gt;</span>
                    </h2>
                    <p>
                        Set in the context of polygamy during the Joseph Smith
                        Movement{" "}
                    </p>
                    <span>wiki icon</span>
                </a>

                <Link href="/chart/faq" className={styles.card}>
                    <h2>
                        Project FAQ <span>-&gt;</span>
                    </h2>
                    <p>More info on this project and how to support it</p>
                </Link>
            </div>
        </>
    )
}
