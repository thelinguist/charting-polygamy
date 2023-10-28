import markdownStyles from "./PostBody.module.css"

type Props = {
    content: string
}
export default function PostBody({ content }: Props) {
    return <div className={markdownStyles.markdown} dangerouslySetInnerHTML={{ __html: content }} />
}
