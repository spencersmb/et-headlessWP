import { addApolloState, initializeApollo } from '../lib/apollo-client'
import { QUERY_ALL_POSTS, QUERY_NEXT_POSTS, QUERY_POST_BY_SLUG } from '../graphqlData/postsData'
import { flattenAllPosts, flattenPost, getPaginatedPosts, mapPostData, mapStaticPostData } from '../lib/wp/posts'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { NAV_QUERY } from '../lib/apollo-cache'
import { useEssGridAuth } from '../lib/auth/authContext'
import Layout from '../components/Layout/Layout'
import { getStaticMenus } from '../lib/wp/menu'
import { getLocalJsonFile } from '../lib/utilities/localApi'
import path from 'path'
import fs from 'fs/promises'
// import path from 'path'
// import fs from 'fs/promises'
// import { getLocalJsonFile } from '../lib/utilities/localApi'

interface IProps {
  post: IPost
  filenames: string
}
function Post(props: IProps){
  const {post} = props
  return (
    <Layout post={post}>
      <div>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{__html: post.content}} />
        <Link href='/'>
          <a>home</a>
        </Link>
      </div>
    </Layout>
  )
}

export default Post


// to build all postsStatically
// - must have fallback set to false
// - local env set to 100

export async function getStaticPaths(context){
  console.log('run get getStaticPaths')


  const apolloClient = initializeApollo()
  const data = await apolloClient.query({
    query: QUERY_NEXT_POSTS,
    variables: {after: null}
  })
  const posts = flattenAllPosts(data?.data.posts) || []
  const slugs = posts.map(post => post.slug)

  //
  // const data = await getLocalJsonFile('public', 'wp-search.json')
  // const slugs = data.posts.map(post => post.slug)
  const params = slugs.map(slug => ({params:{slug: slug.toString()}}))

  return{
    paths: params,
    fallback: false
  }
}
export async function getStaticProps(context){
  // const postsDirectory = path.join(process.cwd(), 'public')
  // const filenames = await fs.readdir(postsDirectory)
  // console.log('filenames', filenames)

  const {params} = context
  const apolloClient = initializeApollo()


  /**
   * STATIC
   */
  let staticPost = {}
  let post = {}
  let data: any = {}
  let hasStatic = false
  let foundFile = false
  let postsLoaded = false
  const postsDirectory = path.join(process.cwd(), 'public')
  const filenames = await fs.readdir(postsDirectory)
  const dataJsonfile = filenames.find(file => file === 'wp-static-data.json')

  if(dataJsonfile) {
    foundFile = true
    const filePath = path.join(postsDirectory, dataJsonfile)
    const jsonData: any = await fs.readFile(filePath, 'utf8')
    data = await JSON.parse(jsonData)
    postsLoaded = data.posts.length >= 423
  }

  if(dataJsonfile && postsLoaded && typeof data.posts[params.slug] === "object") {
    post = mapPostData(data.posts[params.slug])
  }else {
    data = await apolloClient.query({
      query: QUERY_POST_BY_SLUG,
      variables: {
        slug: params.slug
      },
    })
    post = flattenPost(data?.data?.postBy)
  }
    // const post = mapStaticPostData(data.posts[params.slug])
    // staticPost = mapPostData(data.posts[params.slug])
  /**
   * WITH-APOLLO
   */
  if (Object.keys(post).length === 0) {
    return addApolloState(apolloClient, {
        notFound: true,
      }
    )
  }

  return addApolloState(apolloClient, {
    props: {
      post,
      staticPost
    },
    // revalidate: 5,
  })

}
