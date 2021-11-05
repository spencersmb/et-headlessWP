import { getAllPosts, getPagesCount, getPaginatedPosts } from '../../lib/wp/posts'
import Pagination from '../../components/pagination'
import Link from 'next/link'

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
          )}x
        </>
      )}
    </div>
  )
}

export async function getStaticProps({ params = {} }: any = {}) {

  const {__APOLLO_STATE__, posts, pagination} = await getPaginatedPosts(params?.page)
  return{
    props: {
      __APOLLO_STATE__,
      posts,
      pagination: {
        ...pagination,
        basePath: '',
      },
    },
    revalidate: 5
  }
}

export async function getStaticPaths() {
  const { posts } = await getAllPosts();
  const pagesCount = await getPagesCount(posts);
  const paths = [...new Array(pagesCount)].map((_, i) => {
    return { params: { page: String(i + 1) } };
  });
  return {
    paths,
    fallback: false,
  };
}
