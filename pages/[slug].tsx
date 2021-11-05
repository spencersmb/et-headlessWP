import { addApolloState, initializeApollo } from '../lib/apollo-client'
import { QUERY_ALL_POSTS, QUERY_NEXT_POSTS, QUERY_POST_BY_SLUG } from '../graphqlData/postsData'
import { flattenAllPosts, getPaginatedPosts } from '../lib/wp/posts'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { NAV_QUERY } from '../lib/apollo-cache'
import { useEssGridAuth } from '../lib/auth/authContext'

function Post(props){
  // console.log('page props', props)
  const {post} = props
  if(!post.title){
    return (
      <div>
        Loading
      </div>
    )
  }
  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{__html: post.content}} />
      <Link href='/'>
        <a>home</a>
      </Link>
    </div>
  )
}

export default Post
export async function getStaticPaths(){
  // const {__APOLLO_STATE__, posts, pagination} = await getPaginatedPosts()
  const apolloClient = initializeApollo()

  const data = await apolloClient.query({
    query: QUERY_NEXT_POSTS,
    variables: {after: null}
  })
  const posts = flattenAllPosts(data?.data.posts) || []
  const slugs = posts.map(post => post.slug)
  console.log('slugs', slugs)

  const params = slugs.map(slug => ({params:{slug: slug.toString()}}))

  return{
    paths:params,
    fallback: 'blocking'
  }
}
export async function getStaticProps(context){
  const {params} = context
  console.log('revalidate PID getStaticProps', params)

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

  return addApolloState(apolloClient, {
    props: {
      post:data?.data?.postBy || {},
      basePath: ''
    },
    // revalidate: 5,
  })

}
