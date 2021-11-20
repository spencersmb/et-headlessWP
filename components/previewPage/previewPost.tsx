interface IProps {
  loading: boolean
  post?: any
  page?: any
}
const PreviewPost = ({loading, post, page}: IProps) => {

  if(loading){
    return (
      <div>Loading preview page...</div>
    )
  }

  return (
      <div>
        {page && <div>
          <h1>{page.title}</h1>
          <div dangerouslySetInnerHTML={{__html: page.content}} />
        </div>}
        {post && <div>
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{__html: post.content}} />
        </div>}
      </div>
  )
}

export default PreviewPost
