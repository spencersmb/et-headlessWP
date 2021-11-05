import styles from '../pagination/Paginate.module.scss';
import Link from 'next/link'
import { GrNext as NextIcon, GrPrevious as PreviousIcon } from 'react-icons/gr'
import { HiOutlineDotsHorizontal as Dots } from 'react-icons/hi'
import { useQuery } from '@apollo/client'
import { QUERY_NEXT_POSTS } from '../../graphqlData/postsData'
import { flattenAllPosts } from '../../lib/wp/posts'

const CursorPagination = () => {

  const {loading, error, data, fetchMore, networkStatus} = useQuery(QUERY_NEXT_POSTS,{
    notifyOnNetworkStatusChange: true,
  });
  console.log('loading', loading)
  console.log('networkStatus', networkStatus)

  function handleGetNextPosts(){
    fetchMore({
      variables:{
        after: data?.posts.pageInfo.endCursor
      }
    })
  }
  const pageInfo = data?.posts.pageInfo
  const posts = flattenAllPosts(data?.posts) || []

  // console.log('data', data)

  return (
    <div className={styles.container}>
      <ul>
        {posts
          // .filter((post,index) => index < 10 )
          .map((post) => (
            <li key={post.id}>
              <Link href={`/${post.slug}`}>
                {post.title}
              </Link>
            </li>
          ))}
      </ul>
      <nav className={styles.nav} role="navigation" aria-label="Pagination Navigation">
        {pageInfo.hasPreviousPage && (
          // <Link href={`${path}${currentPage - 1}`}>
            <button className={styles.prev} aria-label="Goto Previous Page">
              <PreviousIcon />
              Previous
            </button>
          // </Link>
        )}

        {pageInfo.hasNextPage && (
          // <Link href={`${path}${currentPage + 1}`}>
            <button className={styles.next} aria-label="Goto Next Page" onClick={handleGetNextPosts}>
              Next
              <NextIcon />
            </button>
          // </Link>
        )}
      </nav>
    </div>
  )
}
export default CursorPagination
