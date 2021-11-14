import styles from '../pagination/Paginate.module.scss';
import Link from 'next/link'
import { GrNext as NextIcon, GrPrevious as PreviousIcon } from 'react-icons/gr'
import { HiOutlineDotsHorizontal as Dots } from 'react-icons/hi'
import { useQuery } from '@apollo/client'
import { QUERY_NEXT_POSTS } from '../../graphqlData/postsData'
import { flattenAllPosts } from '../../lib/wp/posts'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const CursorPagination = () => {
  const router = useRouter();
  const path = router.asPath

  const {loading, error, data, fetchMore, networkStatus} = useQuery(QUERY_NEXT_POSTS,{
    notifyOnNetworkStatusChange: true,
  });
  const pageInfo = data?.posts.pageInfo
  const posts = flattenAllPosts(data?.posts) || []

  const [preloadedCount, setPreloadedCount] = useState(1)
  const preloadedPages = Math.ceil(posts.length / 10)
  const morePages = preloadedCount < preloadedPages

  useEffect(()=>{
    let {page} = Object.fromEntries(new URLSearchParams(path.slice(2)));

    if(page && page !== '1'){
      setPreloadedCount(parseInt(page))
    }

  },[path])

  function handleGetNextPosts(){
    if(preloadedCount < preloadedPages){
      setPreloadedCount(preloadedCount + 1)
      // router.query.page = `${preloadedCount}`
      // router.push(router)
      router.replace({
        pathname: '/',
        query: { page: `${preloadedCount + 1}` },
      })
    }else {
      // fetchMore({
      //   variables:{
      //     after: data?.posts.pageInfo.endCursor
      //   }
      // })
    }

  }


  console.log('total pages', preloadedPages)
  console.log('current Page', preloadedCount)
  console.log('morePages', morePages)

  return (
    <div className={styles.container}>
      <ul>
        {posts
          // .filter((post,index) => {
          //   if(preloadedCount < preloadedPages){
          //     return index < preloadedCount * 10
          //   }else{
          //     return index
          //   }
          // } )
          .map((post) => (
            <li key={post.id}>
              <Link href={`/${post.slug}`}>
                {post.title}
              </Link>
            </li>
          ))}
      </ul>
      <nav className={styles.nav} role="navigation" aria-label="Pagination Navigation">
        {/*{pageInfo?.hasPreviousPage && (*/}
        {/*  // <Link href={`${path}${currentPage - 1}`}>*/}
        {/*    <button className={styles.prev} aria-label="Goto Previous Page">*/}
        {/*      <PreviousIcon />*/}
        {/*      Previous*/}
        {/*    </button>*/}
        {/*  // </Link>*/}
        {/*)}*/}

        {/*{morePages && (*/}
        {pageInfo?.hasNextPage && (
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
