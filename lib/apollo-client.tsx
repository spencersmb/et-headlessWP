import {
  ApolloClient, ApolloProvider, HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { concatPagination } from '@apollo/client/utilities'
import { useMemo } from 'react'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { ParsedUrlQuery } from 'querystring'

const API_URL = process.env.WP_API_URL;
let apolloClient;
//
/**
 * getApolloClient
 */
export function getApolloClient() {
  if (!apolloClient) {
    apolloClient = _createApolloClient();
  }
  return apolloClient;
}

export function _createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined", // set to true for SSR
    uri: API_URL,
    connectToDevTools: process.env.NODE_ENV === 'development',
    cache: new InMemoryCache()
  });
}

/*
WITH-APOLLO DOCS
 */
export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    // link: new HttpLink({
    //   uri: 'https://nextjs-graphql-with-prisma-simple.vercel.app/api', // Server URL (must be absolute)
    //   credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    // }),
    uri: 'https://etheadless.wpengine.com/graphql/',
    connectToDevTools: process.env.NODE_ENV === 'development',
    cache: new InMemoryCache({
      typePolicies: {
        // Query: {
        //   fields: {
        //     posts: concatPagination(),
        //   },
        // },
      },
    }),
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)

  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function addApolloState(client, pageProps) {
  console.log('revalide apollo', client)
  console.log('pageProps', pageProps)


  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])
  return store
}

/*
FETCH Method
 */

async function fetchAPI(query, { variables }: any = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      'Authorization'
      ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Etest')
  }
  return json.data
}

export async function getAllPostsForHome(preview) {
  const data = await fetchAPI(
    `
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                firstName
                lastName
                avatar {
                  url
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    }
  )

  return data?.posts
}

/*
Static Apollo
 */
export function createStaticApolloClient(
  initialState: object,
  ctx: any | null){
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache().restore(
      (initialState || {}) as NormalizedCacheObject
    )
  })
}

export function apolloStatic(): ApolloClient<object> {
  if (typeof window !== 'undefined') {
    throw new Error('Can only be used on the server')
  }
  return createStaticApolloClient({}, null)
}

const notImplemented = (..._args: any): any => {
  throw new Error("Can't be called from a static page")
}
const baseFakeRouter = {
  route: '',
  pathname: '',
  asPath: '',
  basePath: '',
  isLocaleDomain: false,
  isPreview: false,
  push: notImplemented,
  replace: notImplemented,
  reload: notImplemented,
  back: notImplemented,
  prefetch: notImplemented,
  beforePopState: notImplemented,
  events: {
    on: notImplemented,
    off: notImplemented,
    emit: notImplemented
  },
  isFallback: false,
  isReady: true
}
export default function getStaticApolloProps(Page, { revalidate }: { revalidate?: number } = {}, callback?){
  return async (context) => {
    const { params, locales, locale, defaultLocale } = context
    const router = {
      query: params as ParsedUrlQuery,
      locales,
      locale,
      defaultLocale,
      ...baseFakeRouter
    }

    const { getDataFromTree } = await import('@apollo/client/react/ssr')
    const { RouterContext } = await import(
      'next/dist/shared/lib/router-context'
      )

    const apolloClient = apolloStatic()

    const otherProps = await callback({
      apolloClient,
      params: params!
    })

    const PrerenderComponent = () => (
      <ApolloProvider client={apolloClient}>
      <RouterContext.Provider value={router}>
        <Page {...otherProps} />
    </RouterContext.Provider>
    </ApolloProvider>
  )

    await getDataFromTree(<PrerenderComponent />)

    return {
      props: {
        apolloState: apolloClient.cache.extract(),
        generatedAt: new Date().toISOString(),
        revalidate: revalidate || null,
        ...otherProps
      },
      revalidate
    }
  }
}
