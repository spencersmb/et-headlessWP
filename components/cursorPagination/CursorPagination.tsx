import styles from '../pagination/Paginate.module.scss';
import Link from 'next/link'
import { GrNext as NextIcon, GrPrevious as PreviousIcon } from 'react-icons/gr'
import { HiOutlineDotsHorizontal as Dots } from 'react-icons/hi'
import { useQuery } from '@apollo/client'
import { QUERY_ALL_POSTS, QUERY_NEXT_POSTS } from '../../graphqlData/postsData'
import { flattenAllPosts } from '../../lib/wp/posts'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

const CursorPagination = () => {
  const router = useRouter();
  const path = router.asPath
  const {page} = Object.fromEntries(new URLSearchParams(path.slice(2)));
  const {loading, error, data, fetchMore, networkStatus} = useQuery(QUERY_ALL_POSTS,{
    notifyOnNetworkStatusChange: true,
    variables: {
      count: process.env.NEXT_GET_ALL_PAGES_COUNT
    }
  });
  const posts = flattenAllPosts(data?.posts) || []
  const [currentPage, setPage] = useState(!page ? 1 : parseInt(page))
  const morePages = currentPage < posts.length / 10

  function handleGetNextPosts(){
    setPage(currentPage + 1)
    router.replace({
      pathname: '/',
      query: { page: `${currentPage + 1}` },
    }, undefined, {
      shallow: true
    })
  }

  console.log('current Page', currentPage)
  console.log('loading', loading)

  return (
    <div className={styles.container}>
      <ol>
        {posts
          .filter((post,index) => {
            return index < currentPage * 10
            // if(preloaded.current){
            //   return index < 11
            // }else{
            //   return index
            // }
            // return totalItems - 10
            // if(currentPage < preloadedPages){
            //   return index < currentPage * 10
            // }else{
            //   return index
            // }
          } )
          .map((post) => (
            <li key={post.id}>
              <Link href={`/${post.slug}`}>
                {post.title}
              </Link>
            </li>
          ))}
      </ol>
      <nav className={styles.nav} role="navigation" aria-label="Pagination Navigation">
        {/*{pageInfo?.hasPreviousPage && (*/}
        {/*  // <Link href={`${path}${currentPage - 1}`}>*/}
        {/*    <button className={styles.prev} aria-label="Goto Previous Page">*/}
        {/*      <PreviousIcon />*/}
        {/*      Previous*/}
        {/*    </button>*/}
        {/*  // </Link>*/}
        {/*)}*/}

        {/*{pageInfo?.hasNextPage && !loading && (*/}
        {morePages && (
          // <Link href={`${path}${currentPage + 1}`}>
            <button className={styles.next} aria-label="Goto Next Page" onClick={handleGetNextPosts}>
              Next
              <NextIcon />
            </button>
          // </Link>
        )}

        {
          loading  && <div>Spinner loading</div>
        }
      </nav>
    </div>
  )
}
export default CursorPagination
