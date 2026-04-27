import Link from "next/link"
import { Network, BookMarked, CircleHelp, UserRound } from "lucide-react"
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
                    <Network size={48} strokeWidth={1.5} style={{ transform: "rotate(180deg)" }} />
                    <div>
                        <h2>
                            Chart my Tree <span>-&gt;</span>
                        </h2>
                        <p>see your ancestry and detect polygamous families</p>
                    </div>
                </Link>

                <a
                    href="https://en.wikipedia.org/wiki/Mormonism_and_polygamy"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <BookMarked size={48} strokeWidth={1.5} />
                    <div>
                        <h2>
                            about polygamy <span>-&gt;</span>
                        </h2>
                        <p>Set in the context of polygamy during the Joseph Smith Movement </p>
                    </div>
                </a>

                <Link href="/chart/faq" className={styles.card}>
                    <CircleHelp size={48} strokeWidth={1.5} />
                    <div>
                        <h2>
                            Project FAQ <span>-&gt;</span>
                        </h2>
                        <p>More info on this project</p>
                    </div>
                </Link>

                <Link href="/chart/about" className={styles.card}>
                    <UserRound size={48} strokeWidth={1.5} />
                    <div>
                        <h2>
                            About Me <span>-&gt;</span>
                        </h2>
                        <p>about me and how to support this project</p>
                    </div>
                </Link>
            </div>
        </>
    )
}
