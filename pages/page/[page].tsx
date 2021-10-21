import { getAllPostsV2, getPagesCountV2, getPaginatedPostsV2 } from '../../lib/posts'
import Pagination from '../../components/pagination'
import { useQuery } from '@apollo/client'
import { NAV_QUERY } from '../../lib/apollo-cache'

export default function Posts({ posts, pagination }) {
  const title = `All Posts`;
  const slug = 'posts';
  const {data} = useQuery(NAV_QUERY);
  console.log('isNav Open', data)


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

  const { posts, pagination } = await getPaginatedPostsV2(params?.page);
  return {
    props: {
      posts,
      pagination: {
        ...pagination,
        basePath: '',
      },
    },
    revalidate: 60
  };
}

export async function getStaticPaths() {
  const { posts } = await getAllPostsV2();
  const pagesCount = await getPagesCountV2(posts);
  const paths = [...new Array(pagesCount)].map((_, i) => {
    return { params: { page: String(i + 1) } };
  });
  return {
    paths,
    fallback: false,
  };
}
