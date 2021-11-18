import '../styles/globals.css'
import App from "next/app"
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { addApolloState, initializeApollo, useApollo } from '../lib/apollo-client'
import type { AppProps } from 'next/app'
import EssAuthProvider from '../lib/authContext/authProvider'
import { SiteContext } from '../hooks/useSite'
import { IEssAuthState } from '../lib/authContext/authContext'
import NextNProgress from 'nextjs-progressbar';
import { Provider } from 'react-redux'
import { wrapper } from '../lib/redux/store'
import store from '../lib/redux-toolkit/store'
import { flattenAllPosts, getRecentPosts } from '../lib/wp/posts'
import { increment } from '../components/counter/counterSlice'
import { getCategories } from '../lib/wp/categories'
import {
  createMenuFromPages,
  getAllMenus,
  getStaticMenus,
  mapMenuData,
  MENU_LOCATION_NAVIGATION_DEFAULT
} from '../lib/wp/menu'
import { getTopLevelPages } from '../lib/wp/pages'
import { getMenu, getMetadata, getSiteMetadata, getStaticSiteMetadata, IMetaData } from '../lib/wp/site'
import { QUERY_ALL_POSTS } from '../graphqlData/postsData'
import { QUERY_ALL_PAGES } from '../graphqlData/pagesGQL'
import { addCount } from '../lib/redux/counter/actions'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { SearchProvider } from '../hooks/useSearch'
import path from 'path'


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


  // const DEFAULT_SEO = {
  //   title: `Home - ${metadata.title}`,
  //   description: metadata.description,
  //   openGraph: {
  //     type: 'website',
  //     locale: 'en_IE',
  //     url: metadata.domain + asPath,
  //     title: metadata.title,
  //     description: metadata.description,
  //     image:
  //       // need defaul image
  //       'https://prismic-io.s3.amazonaws.com/gary-blog%2F3297f290-a885-4cc6-9b19-3235e3026646_default.jpg',
  //     site_name: metadata.siteTitle,
  //     imageWidth: 1200,
  //     imageHeight: 1200
  //   },
  //   twitter: {
  //     handle: `@${metadata.social.twitter.username}`,
  //     cardType: 'summary_large_image'
  //   }
  // };


  return(
    <>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="application-name" content="Every-Tuesday"/>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="facebook-domain-verification" content="49a7ouvzn8x5uhb6gdmg2km5pnbfny"/>
        <meta name="norton-safeweb-site-verification" content="42o2xv441l6-j8hnbn5bc1wi76o7awsydx8s00-ad8jqokbtj2w3ylsaed7gk2tbd3o-tdzh62ynrlkpicf51voi7pfpa9j61f51405kq0t9z-v896p48l7nlqas6i4l"/>
        {/*<title>Home - {metadata.title}</title>*/}

      </Head>
      {/*<NextSeo {...DEFAULT_SEO} />*/}
      <ApolloProvider client={apolloClient}>
        <SiteContext.Provider value={{
          menus,
          metadata,
          recentPosts,
          categories
        }}>
          <SearchProvider>
            <NextNProgress height={4} color={`#0070f3`} />
            {/*<Provider store={store} >*/}
            <EssAuthProvider auth={auth}>
              <Component {...pageProps} />
            </EssAuthProvider>

          </SearchProvider>

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
  const { menus } = getMenu()

  // const defaultNavigation = createMenuFromPages({
  //   locations: [MENU_LOCATION_NAVIGATION_DEFAULT],
  //   pages: await getTopLevelPages(),
  // });
  //
  // menus.push(defaultNavigation) // SO far do not need this

  const metadata = getMetadata()

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


