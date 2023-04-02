import { addApolloState, initializeApollo } from '../lib/apollo-client'
import { QUERY_ALL_POSTS, QUERY_NEXT_POSTS, QUERY_POST_BY_SLUG } from '../lib/graphql/queries/posts'
import { flattenAllPosts, flattenPost, mapPostData } from '../lib/wp/posts'
import Link from 'next/link'
import Layout from '../components/Layout/Layout'
import path from 'path'
import fs from 'fs/promises'
import { getAllStaticPaths, getSingleStaticPost } from '../lib/staticApi/staticApi'
import { gql } from '@apollo/client'

interface IProps {
  post: IPost
  foundStaticFile: boolean
}
function Post(props: IProps) {
  const { post } = props
  console.log('props.foundStaticFile', props.foundStaticFile)

  return (
    <Layout >
      <div>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <Link href='/'>
          <a>home</a>
        </Link>
      </div>
    </Layout>
  )
}

export default Post

export async function getStaticPaths() {
  const apolloClient = initializeApollo();

  const data = await apolloClient.query({
    query: gql`
      {
        posts(first: 1000) {
          edges {
            node {
              id
              title
              slug
            }
          }
        }
      }
    `,
  });
  console.log('data', data)

  // const posts = data?.data.posts.edges.map(({ node }) => node);
  const posts = []

  return {
    paths: posts.map(({ slug }) => {
      return {
        params: {
          postSlug: 'create-candy-cane-lettering-procreate'
        }
      }
    }),
    fallback: 'blocking'
  }
}


export async function getStaticProps({ params = {} }: any = {}) {
  const { postSlug } = params;

  const apolloClient = initializeApollo();

  const data = await apolloClient.query({
    query: gql`
      query PostBySlug($slug: String!) {
        postBy(slug: $slug) {
          id
          content
          title
          slug
        }
      }
    `,
    variables: {
      slug: 'create-candy-cane-lettering-procreate'
    }
  });

  const post = data?.data.postBy;
  return {
    props: {
      post,
    },
    revalidate: 86400
  }
}





