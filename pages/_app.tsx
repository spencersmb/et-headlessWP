import '../styles/globals.css'
import App from "next/app"
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apollo-client'
import type { AppProps } from 'next/app'
import WpAuthProvider from '../lib/authContext/authProvider'
import { SiteContext } from '../hooks/useSite'
import { IEssAuthState } from '../lib/authContext/authContext'
import { Provider } from 'react-redux'
import { wrapper } from '../lib/redux/store'
import store from '../lib/redux-toolkit/store'
import { increment } from '../components/counter/counterSlice'
import { getMenu, getMetadata } from '../lib/wp/site'
import { addCount } from '../lib/redux/counter/actions'
import { useRouter } from 'next/router'
import { SearchProvider } from '../hooks/useSearch'
import { getResourceLibraryAuthToken } from '../lib/utilities/cookies'
import { isEmpty } from 'lodash'


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
  const router = useRouter();
  const { asPath } = router;
  const apolloClient = useApollo(pageProps)
  console.log('asPath', asPath)

  return (
    <>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="application-name" content="Every-Tuesday" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="facebook-domain-verification" content="49a7ouvzn8x5uhb6gdmg2km5pnbfny" />
        <meta name="norton-safeweb-site-verification" content="42o2xv441l6-j8hnbn5bc1wi76o7awsydx8s00-ad8jqokbtj2w3ylsaed7gk2tbd3o-tdzh62ynrlkpicf51voi7pfpa9j61f51405kq0t9z-v896p48l7nlqas6i4l" />
        <title>Home - {metadata.title}</title>
        <link rel="preload" href="/fonts/sentinel/Sentinel-SemiboldItal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <SiteContext.Provider value={{
          menus,
          metadata,
          recentPosts,
          categories
        }}>
          <SearchProvider>
            {/* <NextNProgress height={4} color={`#0070f3`} /> */}
            {/*<Provider store={store} >*/}
            <WpAuthProvider auth={auth}>
              <Component {...pageProps} />
            </WpAuthProvider>

          </SearchProvider>

        </SiteContext.Provider>
        {/*</Provider>*/}
      </ApolloProvider>

    </>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  const isServer = typeof window === 'undefined'
  const auth = {
    loggedIn: false,
    modal: {
      open: false,
      component: null
    }
  }

  if (isServer) {
    const resourceAuthToken = getResourceLibraryAuthToken(appContext.ctx.req)
    auth.loggedIn = !isEmpty(resourceAuthToken)
  }
  // const { posts: recentPosts } = await getRecentPosts({
  //   count: 5,
  // });
  //
  // const { categories } = await getCategories({
  //   count: 5,
  // });
  //
  const { menus } = getMenu()

  const metadata = getMetadata()

  // AUTH EXAMPLE
  // const auth = await getUser(appContext.ctx)

  return {
    ...appProps,
    auth,
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


