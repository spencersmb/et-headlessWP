import { getAllPosts, getPagesCount, getPaginatedPosts } from '../../../lib/posts'
import Pagination from '../../../components/pagination'

export default function Posts({ posts, pagination }) {
  const title = `All Posts`;
  const slug = 'posts';

  return (
    <div>
      <h2>Posts</h2>
      {Array.isArray(posts) && (
        <>
          <ul className={''}>
            {posts.map((post) => {
              return (
                <li key={post.slug}>
                  {post.title}
                  {/*<PostCard post={post} options={postOptions} />*/}
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

  const { posts, pagination } = await getPaginatedPosts(params?.page);
  return {
    props: {
      posts,
      pagination: {
        ...pagination,
        basePath: '/blog',
      },
    },
    revalidate: 60
  };
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
