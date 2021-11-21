import { addApolloState, initializeApollo } from '../lib/apollo-client'
import { QUERY_ALL_POSTS, QUERY_NEXT_POSTS, QUERY_POST_BY_SLUG } from '../lib/graphql/queries/posts'
import { flattenAllPosts, flattenPost, mapPostData } from '../lib/wp/posts'
import Link from 'next/link'
import Layout from '../components/Layout/Layout'
import path from 'path'
import fs from 'fs/promises'
import { getAllStaticPaths, getSingleStaticPost } from '../lib/staticApi/staticApi'

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

// export async function getStaticPaths(){
//   console.log('run get getStaticPaths')
//
//   // const {posts} = await getAllStaticPaths()
//   const apolloClient = initializeApollo()
//
//   /*
//   Change to QUERY_NEXT_POST if switching to real pagination method
//    */
//   const data = await apolloClient.query({
//     query: QUERY_NEXT_POSTS,
//     // variables: {count: parseInt(process.env.NEXT_GET_ALL_PAGES_COUNT)}
//   })
//   const posts = flattenAllPosts(data?.data.posts) || []
//   const slugs = posts.map(post => post.slug)
//
//   //
//   // const data = await getLocalJsonFile('public', 'wp-search.json')
//   // const slugs = data.posts.map(post => post.slug)
//   const params = slugs.map(slug => ({params:{slug: slug.toString()}}))
//
//   return{
//     paths: params,
//     fallback: "blocking"
//   }
// }
export async function getServerSideProps(context){
  // const postsDirectory = path.join(process.cwd(), 'public')
  // const filenames = await fs.readdir(postsDirectory)
  // console.log('filenames', filenames)

  console.log('context', context)
  const {params} = context

  // const apolloClient = initializeApollo()

  /**
   * STATIC
   */

  // const {post, apolloClient, foundStaticFile} = await getSingleStaticPost(params)

  /**
   * WITH-APOLLO
   */
  const apolloClient = initializeApollo()

  const data = await apolloClient.query({
    query: QUERY_POST_BY_SLUG,
    variables: {
      slug: params.slug
    },
  })

  const post = flattenPost(data?.data?.postBy)

  if (Object.keys(post).length === 0) {
    return addApolloState(apolloClient, {
        notFound: true,
      }
    )
  }

  return addApolloState(apolloClient, {
    props: {
      post,
      foundStaticFile: false
    },
    // revalidate: 1,
  })

}




