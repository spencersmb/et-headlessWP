import { addApolloState, initializeApollo } from '../lib/apollo-client'
import { QUERY_ALL_POSTS } from '../graphqlData/postsData'
import { flattenAllPosts } from '../lib/posts'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { NAV_QUERY } from '../lib/apollo-cache'

function Post(props){
  // console.log('page props', props)
  const {data} = useQuery(NAV_QUERY);
  console.log('nav data', data.nav)


  return (
    <div>
      slug
      <Link href='/'>
        <a>home</a>
      </Link>
    </div>
  )
}

export default Post
export async function getStaticPaths(params){
  console.log('params', params)
  
  return{
    paths:[
      { params: {
        slug: 'blog'
        } }
    ],
    fallback: false
  }
}
export async function getStaticProps(context){

  // const {initialApolloState, posts, pagination} = await getPaginatedPostsV2()
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
    query: QUERY_ALL_POSTS,
    // variables: allPostsQueryVars,
  })
  console.log('data', data)

  //
  // await apolloClient.query({
  //   query: QUERY_POST_PER_PAGE,
  // });
  //
  //
  const posts = flattenAllPosts(data?.data.posts) || []

  return addApolloState(apolloClient, {
    props: {
      posts,
      basePath: '/blog'
    },
    revalidate: 5,
  })

}
