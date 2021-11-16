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

  const {loading, error, data, fetchMore, networkStatus} = useQuery(QUERY_ALL_POSTS,{
    notifyOnNetworkStatusChange: true,
    variables: {
      count: process.env.NEXT_GET_ALL_PAGES_COUNT
    }
  });
  const pageInfo = data?.posts.pageInfo
  const posts = flattenAllPosts(data?.posts) || []
  const preloaded = useRef(false)
  const [currentPage, setPage] = useState(1)
  const preloadedPages = Math.ceil(posts.length / 10)
  // const morePages = currentPage < preloadedPages

  // SET PAGE state whenever the url param gets changed
  useEffect(()=>{
    let {page} = Object.fromEntries(new URLSearchParams(path.slice(2)));

    if(page && page !== '1'){
      setPage(parseInt(page))
    }

  },[path])

  function handleGetNextPosts(){

    setPage(currentPage + 1)
    // router.query.page = `${currentPage}`
    // router.push(router)
    router.replace({
      pathname: '/',
      query: { page: `${currentPage + 1}` },
    }, undefined, {
      shallow: true
    })

    fetchMore({
      variables:{
        after: data?.posts.pageInfo.endCursor
      }
    })
    if(currentPage >= preloadedPages){

    }
  }


  console.log('total pages', preloadedPages)
  console.log('current Page', currentPage)
  console.log('loading', loading)

  return (
    <div className={styles.container}>
      <ol>
        {posts
          .filter((post,index) => {
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
            return index
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

        {/*{morePages && (*/}
        {pageInfo?.hasNextPage && !loading && (
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
