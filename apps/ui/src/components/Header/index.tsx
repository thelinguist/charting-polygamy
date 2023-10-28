import styles from "./Header.module.css"
import Link from "next/link"

export default function Header() {
    return (
        <header className={styles.header}>
            <Link href="/">
                <button>
                    Home
                </button>
            </Link>
            <button className={styles.tryIt}>Try it out</button>
        </header>
    )
}
