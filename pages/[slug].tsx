import { addApolloState, initializeApollo } from '../lib/apollo-client'
import { QUERY_ALL_POSTS, QUERY_NEXT_POSTS, QUERY_POST_BY_SLUG } from '../graphqlData/postsData'
import { flattenAllPosts, flattenPost, getPaginatedPosts } from '../lib/wp/posts'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { NAV_QUERY } from '../lib/apollo-cache'
import { useEssGridAuth } from '../lib/auth/authContext'
import Layout from '../components/Layout/Layout'
import { getSearchData } from '../lib/search/searchApi'
import path from 'path'
import fs from 'fs/promises'

interface IProps {
  post: IPost
}
function Post(props: IProps){
  // console.log('page props', props)
  const {post} = props
  return (
    <Layout post={post}>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{__html: post.content}} />
      <Link href='/'>
        <a>home</a>
      </Link>
    </Layout>
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
  const filePath = path.join(process.cwd(), 'public', 'wp-search.json')
  const jsonData: any = await fs.readFile(filePath,  'utf-8',)
  const data = JSON.parse(jsonData)
  console.log('data', data.posts)


  // const response = await fetch('http://localhost:3000/wp-search.json');
  // const data = await response.json();
  // const slugs = posts.map(post => post.slug)
  const slugs = data.posts.map(post => post.slug)
  const params = slugs.map(slug => ({params:{slug: slug.toString()}}))
  console.log('params', params)


  return{
    paths: params,
    fallback: "blocking"
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
      post
    },
    // revalidate: 5,
  })

}
