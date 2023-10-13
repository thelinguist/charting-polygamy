import markdownStyles from './PostBody.module.css'

type Props = {
  content: string
}
export default function PostBody({ content }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={markdownStyles.markdown}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}
