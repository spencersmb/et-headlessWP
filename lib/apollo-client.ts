import {
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";
import { concatPagination } from '@apollo/client/utilities'
import { useMemo } from 'react'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'

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
//
// export function initializeApollo(initialState = null) {
//   const _apolloClient = apolloClient ?? _createApolloClient();
//
//   // If your page has Next.js data fetching methods that use Apollo Client,
//   // the initial state gets hydrated here
//   if (initialState) {
//     // Get existing cache, loaded during client side data fetching
//     const existingCache = _apolloClient.extract();
//
//     // Restore the cache using the data passed from
//     // getStaticProps/getServerSideProps combined with the existing cached data
//     _apolloClient.cache.restore({ ...existingCache, ...initialState });
//   }
//
//   // For SSG and SSR always create a new Apollo Client
//   if (typeof window === "undefined") return _apolloClient;
//
//   // Create the Apollo Client once in the client
//   if (!apolloClient) apolloClient = _apolloClient;
//   return _apolloClient;
// }
//
// export function useApollo(initialState) {
//   const store = useMemo(() => initializeApollo(initialState), [initialState]);
//   return store;
// }

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
    uri: API_URL,
    connectToDevTools: process.env.NODE_ENV === 'development',
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: concatPagination(),
          },
        },
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
