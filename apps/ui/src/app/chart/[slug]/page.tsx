import { classNames, markdownToHTML } from "../../../lib"
import PostBody from "../../../components/PostBody/PostBody"
import styles from './page.module.css'
import { getPostBySlug, getPostTitles } from "./getAllPosts"

export async function generateStaticParams() {
    const titles = getPostTitles()
    return titles.map((post) => {
        return {
            slug: post.split('.')[0]
        }
    })
}

async function fetchPost(slug) {
    const post = getPostBySlug(slug, ["title", "content"])

    const content = await markdownToHTML(post.content || "")

    return {
        title: post.title,
        content,
    }
}

export default async function Page({ params: { slug } }) {
    const { title, content } = await fetchPost(slug)
    return (
        <article className={classNames(styles.container, "reader")}>
            <title>{title}</title>
            <PostBody content={content} />
        </article>
    )
}
