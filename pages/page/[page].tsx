import {
  createPaginatedPosts,
  flattenAllPosts,
  getAllPosts,
  getAllPostsApollo,
  getPagesCount,
  getPaginatedPosts
} from '../../lib/wp/posts'
import Pagination from '../../components/pagination'
import Link from 'next/link'
import { addApolloState, initializeApollo } from '../../lib/apollo-client'
import { QUERY_NEXT_POSTS } from '../../graphqlData/postsData'

export default function Posts({ posts, pagination }) {

  return (
    <div>
      <h2>Posts</h2>
      {Array.isArray(posts) && (
        <>
          <ul className={''}>
            {posts.map((post) => {
              return (
                <li key={post.id}>
                  <Link href={`/${post.slug}`}>
                    {post.title}
                  </Link>
                </li>
              );
            })}
          </ul>
          {pagination && (
            <Pagination
              currentPage={pagination?.currentPage}
              pagesCount={pagination?.pagesCount}
              basePath={pagination?.basePath}
            />
          )}
        </>
      )}
    </div>
  )
}
//
export async function getStaticProps({ params = {} }: any = {}) {

  const {apolloClient, posts, pagination} = await getPaginatedPosts(params?.page)
  return addApolloState(apolloClient, {
    props: {
      posts,
      pagination: {
        ...pagination,
        basePath: '',
      },
    },
    revalidate: 5
  });
}

export async function getStaticPaths() {
  // const {data} = await getAllPostsApollo()
  // const postsPerPage = data?.data.allSettings.readingSettingsPostsPerPage
  // const flattendPosts = flattenAllPosts(data?.data.posts) || []
  // const pagesCount = Math.ceil(flattendPosts.length / postsPerPage);
  //
  // const paths = [...new Array(pagesCount)].map((_, i) => {
  //   return { params: { page: String(i + 1) } };
  // });
  const apolloClient = initializeApollo()

  const data = await apolloClient.query({
    query: QUERY_NEXT_POSTS,
    variables: {after: null}
  })
  const postsPerPage = data?.data.allSettings.readingSettingsPostsPerPage
  const posts = flattenAllPosts(data?.data.posts) || []
  const pagesCount = Math.ceil(posts.length / postsPerPage);
  const paths = [...new Array(pagesCount)].map((_, i) => {
    return { params: { page: String(i + 1) } };
  });

  return {
    paths,
    fallback: "blocking",
  };
}
