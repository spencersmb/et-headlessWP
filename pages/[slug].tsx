import { addApolloState, initializeApollo } from '../lib/apollo-client'
import { QUERY_ALL_POSTS, QUERY_POST_BY_SLUG } from '../graphqlData/postsData'
import { flattenAllPosts, flattenPost, mapPostData } from '../lib/wp/posts'
import Link from 'next/link'
import Layout from '../components/Layout/Layout'
import path from 'path'
import fs from 'fs/promises'
import { getAllStaticPostsArray, getSingleStaticPost } from '../lib/staticApi/staticApi'

interface IProps {
  post: IPost
  foundStaticFile: boolean
}
function Post(props: IProps){
  const {post} = props
  console.log('props.foundStaticFile', props.foundStaticFile)

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

  //rewrite this similar to getStaticProps
  const {posts} = await getAllStaticPostsArray()
  // const apolloClient = initializeApollo()

  /*
  Change to QUERY_NEXT_POST if switching to real pagination method
   */
  // const data = await apolloClient.query({
  //   query: QUERY_ALL_POSTS,
  //   variables: {count: parseInt(process.env.NEXT_GET_ALL_PAGES_COUNT)}
  // })
  // const posts = flattenAllPosts(data?.data.posts) || []
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
  // const apolloClient = initializeApollo()

  /**
   * STATIC
   */
  // let staticPost = {}
  // let data: any = {}
  // let hasStatic = false
  // let foundFile = false
  // let postsLoaded = false
  // const postsDirectory = path.join(process.cwd(), 'public')
  // const filenames = await fs.readdir(postsDirectory)
  // const dataJsonfile = filenames.find(file => file === 'wp-static-data.json')
  //
  // if(dataJsonfile) {
  //   try {
  //     const filePath = path.join(postsDirectory, dataJsonfile)
  //     const jsonData: any = await fs.readFile(filePath, 'utf8')
  //     data = await JSON.parse(jsonData)
  //   }catch (e){
  //
  //   }
  // }

  // let post = {}
  // let data: any = {}
  //
  // if(foundFile && typeof result.posts[params.slug] === "object") {
  //   post = mapPostData(result.posts[params.slug])
  // }else {
  //   data = await apolloClient.query({
  //     query: QUERY_POST_BY_SLUG,
  //     variables: {
  //       slug: params.slug
  //     },
  //   })
  //   post = flattenPost(data?.data?.postBy)
  // }

  const {post, apolloClient, foundStaticFile} = await getSingleStaticPost(params)

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
      foundStaticFile
    },
    // revalidate: 5,
  })

}




