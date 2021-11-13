import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { createPaginatedPosts, flattenAllPosts, getAllPostsApollo, getPaginatedPosts } from '../lib/wp/posts'
import Pagination from '../components/pagination';
import { addApolloState, initializeApollo, useApollo } from '../lib/apollo-client'
import { QUERY_ALL_POSTS, QUERY_POST_PER_PAGE, QUERY_NEXT_POSTS } from '../graphqlData/postsData'
import { useQuery, gql, useMutation, useReactiveVar } from '@apollo/client'
import { IsLoggedInVar, NAV_QUERY } from '../lib/apollo-cache'
import Test from '../components/test'
import { useEssGridAuth } from '../lib/auth/authContext'
import { useEffect } from 'react'
import { wrapper } from '../lib/redux/store'
import { serverRenderClock, startClock } from '../lib/redux/tick/actions'
import { addCount } from '../lib/redux/counter/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Clock from '../components/Clock'
import AddCount from '../components/addCount'
import { mutations } from '../lib/apollo-mutations'
import { loginUserAction } from '../lib/redux/user/actions'
// import Counter from '../components/counter/counter'
import { QUERY_ALL_MENUS } from '../graphqlData/menuGQL'
import CursorPagination from '../components/cursorPagination/CursorPagination'

function Home(props) {

  // console.log('props', props)

  useEffect(() => {
    // const timer = props.startClock()
    //
    // return () => {
    //   clearInterval(timer)
    // }
  }, [props])

  // const isLoggedIn = useReactiveVar(IsLoggedInVar)
  // console.log('isLoggedIn', isLoggedIn)
  //
  // const {state} = useEssGridAuth()
  // const {logUserIn, logoutAction}= useEssGridAuth()
  //
  // function LogIn(){
  //   IsLoggedInVar(true)
  // }

  // const {loading, error, data, fetchMore} = useQuery(QUERY_NEXT_POSTS, {
  //   variables: {after: null}
  // });
  // console.log('index loading', loading)

  // console.log('index data', data)
  // const posts = flattenAllPosts(data?.posts) || []


  return (
    <div className={styles.container}>

      <h1 className={styles.title}>Welcome to our demo blog!</h1>
      <AddCount />
      {/*<Clock lastUpdate={props.tick.lastUpdate} light={props.tick.light}/>*/}
      {/*<Counter />*/}
      <nav>
        <Link href={'/other'}>
          <a>Navigate</a>
        </Link>
      </nav>
      {/*<h2>Nav Status: {JSON.stringify(state.loggedIn)}</h2>*/}
      <button onClick={async ()=>{
        // logUserIn()
        // await toggleNav({ variables: { isOpen: true }})
      }}>Context Login </button>

      <button onClick={async ()=>{
        // logoutAction()
        // await toggleNav({ variables: { isOpen: true }})
      }}>Context LogOut</button>
      <p>
        You can find more articles on the{' '}
        <Link href='/blog'>
          <a>blog articles page</a>
        </Link>
      </p>
      {/*<Test />*/}
      <div>
        {/*<h3>Posts</h3>*/}
        {/*<ul>*/}
        {/*  {props.posts*/}
        {/*    // .filter((post,index) => index < 10 )*/}
        {/*    .map((post) => (*/}
        {/*    <li key={post.id}>*/}
        {/*      <Link href={`/${post.slug}`}>*/}
        {/*        {post.title}*/}
        {/*      </Link>*/}
        {/*    </li>*/}
        {/*  ))}*/}
        {/*</ul>*/}
      </div>

      <div>
        <h3>Pagination</h3>
        <CursorPagination />
        {/*<Pagination*/}
        {/*  {...props.pagination}*/}
        {/*/>*/}
      </div>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

// REDUX Standard way
// export const getStaticProps = wrapper.getStaticProps((store) => async () => {
export const getStaticProps = async () => {

  /**
   * CUSTOM Alternate way to wrap component
   */
  // const {__APOLLO_STATE__, posts, pagination} = await getPaginatedPosts()
  // // store.dispatch(serverRenderClock(true))
  // // store.dispatch(loginUserAction())
  // // store.dispatch(addCount())
  //
  // return{
  //   props: {
  //     __APOLLO_STATE__,
  //     posts,
  //     pagination: {
  //       ...pagination,
  //       basePath: '',
  //     },
  //   },
  //   revalidate: 5
  // }

  /**
   * WITH-APOLLO Way to wrap component
   */

  const {apolloClient, posts, pagination} = await getPaginatedPosts()

  // const apolloClient = initializeApollo()
  //
  // const data = await apolloClient.query({
  //   query: QUERY_NEXT_POSTS,
  //   variables: {after: null}
  // })
  // const pageInfo = data?.data.posts.pageInfo
  // const posts = flattenAllPosts(data?.data.posts) || []

  return addApolloState(apolloClient, {
    props: {
      posts,
      // pageInfo,
      // pagination: {
      //   ...pagination,
      //   basePath: '',
      // },
      basePath: ''
    },
    revalidate: 15,
  })
}

const mapDispatchToProps = (dispatch) => {
  return {
    addCount: bindActionCreators(addCount, dispatch),
    startClock: bindActionCreators(startClock, dispatch),
  }
}
const mapStateToProps = (state) => {
  return state
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)
// export default Home


