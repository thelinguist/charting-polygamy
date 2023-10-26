import { getPostBySlug, getPostSlugs } from "../../../lib/getAllPosts"
import PostBody from "../../../components/PostBody/PostBody"
import markdownToHtml from "../../../lib/markdownToHTML"

export function generateStaticParams() {
    const posts = getPostSlugs()
    return posts.map(post => ({
        slug: post,
    }))
}

async function fetchPost(slug) {
    const post = getPostBySlug(slug, ["title", "content"])

    const content = await markdownToHtml(post.content || "")

    return {
        title: post.title,
        content,
    }
}

export default async function Page({ params: { slug } }) {
    const { title, content } = await fetchPost(slug)
    return (
        <article className="mb-32">
            <title>{title}</title>
            <PostBody content={content} />
        </article>
    )
}
