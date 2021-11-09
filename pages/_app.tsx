import '../styles/globals.css'
import App from "next/app"
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { addApolloState, initializeApollo, useApollo } from '../lib/apollo-client'
import type { AppProps } from 'next/app'
import EssAuthProvider from '../lib/auth/authProvider'
import { SiteContext } from '../hooks/useState'
import { IEssAuthState } from '../lib/auth/authContext'
import { Provider } from 'react-redux'
import { wrapper } from '../lib/redux/store'
import store from '../lib/redux-toolkit/store'
import { flattenAllPosts, getRecentPosts } from '../lib/wp/posts'
import { increment } from '../components/counter/counterSlice'
import { getCategories } from '../lib/wp/categories'
import { createMenuFromPages, getAllMenus, MENU_LOCATION_NAVIGATION_DEFAULT } from '../lib/wp/menu'
import { getTopLevelPages } from '../lib/wp/pages'
import { getSiteMetadata, IMetaData } from '../lib/wp/site'
import { QUERY_ALL_POSTS } from '../graphqlData/postsData'
import { QUERY_ALL_PAGES } from '../graphqlData/pagesGQL'
import { addCount } from '../lib/redux/counter/actions'

interface IProps {
  auth: IEssAuthState
  recentPosts: IPost[]
  categories: any
  metadata: IMetaData
  menus: any
}
type MyAppProps = IProps & AppProps
function MyApp(props: MyAppProps) {

  const { Component, pageProps, auth, metadata, recentPosts, categories, menus } = props

  const apolloClient = useApollo(pageProps)

  return(
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
        <title>{metadata.title}</title>
      </Head>
      <ApolloProvider client={apolloClient}>
        <SiteContext.Provider value={{
          menus,
          metadata,
          recentPosts,
          categories
        }}>
          {/*<Provider store={store} >*/}
          <EssAuthProvider auth={auth}>

            <Component {...pageProps} />
          </EssAuthProvider>
        </SiteContext.Provider>
        {/*</Provider>*/}
      </ApolloProvider>

    </>
    )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)


  // const { posts: recentPosts } = await getRecentPosts({
  //   count: 5,
  // });
  //
  // const { categories } = await getCategories({
  //   count: 5,
  // });
  //
  const { menus } = await getAllMenus();

  // const defaultNavigation = createMenuFromPages({
  //   locations: [MENU_LOCATION_NAVIGATION_DEFAULT],
  //   pages: await getTopLevelPages(),
  // });
  //
  // menus.push(defaultNavigation) // SO far do not need this

  const metadata = await getSiteMetadata()
  // AUTH EXAMPLE
  // const auth = await getUser(appContext.ctx)
  const auth = {
    loggedIn: false,
    modal:{
      open: false,
      component: null
    }
  }

  // const apolloClient = initializeApollo()
  //
  // const data = await apolloClient.query({
  //   query: QUERY_ALL_PAGES,
  // })
  //
  // const flattendPosts = flattenAllPosts(data?.data.pages) || []
  //
  // return addApolloState(apolloClient, {
  //   ...appProps,
  //   auth,
  //   pages: flattendPosts
  // })

  return {
    ...appProps,
    auth,
    // recentPosts,
    // categories,
    menus,
    metadata
  }
}

// export default MyApp
export default wrapper.withRedux(MyApp)

// wrapper.getInitialAppProps((store) => async (appContext) => {
//   const appProps = await App.getInitialProps(appContext)
//   console.log('store.getState()', store.getState())
//
//   store.dispatch(addCount())
//   const auth = {
//     loggedIn: false,
//     modal:{
//       open: false,
//       component: null
//     }
//   }
//   return {
//     ...appProps,
//     auth,
//     // recentPosts,
//     // categories,
//     // menus,
//     // metadata
//   }
// })


