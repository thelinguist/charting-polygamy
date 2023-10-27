// this goes in chart/[slug]/page.tsx but it's not working, see the issue:
// https://github.com/vercel/next.js/issues/54393
import { getPostBySlug, getPostTitles } from "../../../lib/getAllPosts"
import PostBody from "../../../components/PostBody/PostBody"
import markdownToHtml from "../../../lib/markdownToHTML"

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
