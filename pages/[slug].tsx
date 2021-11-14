import { addApolloState, initializeApollo } from '../lib/apollo-client'
import { QUERY_ALL_POSTS, QUERY_NEXT_POSTS, QUERY_POST_BY_SLUG } from '../graphqlData/postsData'
import { flattenAllPosts, flattenPost, getPaginatedPosts } from '../lib/wp/posts'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { NAV_QUERY } from '../lib/apollo-cache'
import { useEssGridAuth } from '../lib/auth/authContext'
import Layout from '../components/Layout/Layout'
import { getStaticMenus } from '../lib/wp/menu'
import { getLocalJsonFile } from '../lib/utilities/localApi'
// import path from 'path'
// import fs from 'fs/promises'
// import { getLocalJsonFile } from '../lib/utilities/localApi'

interface IProps {
  post: IPost
}
function Post(props: IProps){
  const {post} = props
  return (
    // <Layout post={post}>
      <div>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{__html: post.content}} />
        <Link href='/'>
          <a>home</a>
        </Link>
      </div>
    // </Layout>
  )
}

export default Post
export async function getStaticPaths(context){
  //
  // const apolloClient = initializeApollo()
  // const data = await apolloClient.query({
  //   query: QUERY_NEXT_POSTS,
  //   variables: {after: null}
  // })
  // const posts = flattenAllPosts(data?.data.posts) || []
  // const slugs = posts.map(post => post.slug)


  const data = await getLocalJsonFile('public', 'wp-search.json')
  const slugs = data.posts.map(post => post.slug)
  const params = slugs.map(slug => ({params:{slug: slug.toString()}}))


  return{
    paths: params,
    fallback: false
  }
}
export async function getStaticProps(context){
  const {params} = context

  // const {initialApolloState, posts, pagination} = await getPaginatedPosts()
  // return {
  //   props: {
  //     initialApolloState,
  //     posts,
  //     pagination: {
  //       ...pagination,
  //       basePath: '',
  //     },
  //   },
  //   revalidate: 5
  // };

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
    },
    // revalidate: 5,
  })

}
