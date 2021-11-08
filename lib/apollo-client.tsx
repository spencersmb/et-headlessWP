import {
  ApolloClient,
  gql, InMemoryCache,
} from '@apollo/client'
import { useMemo } from 'react'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { IsLoggedInVar, NAV_QUERY } from './apollo-cache'
import { relayStylePagination } from '@apollo/client/utilities'

const API_URL = process.env.NEXT_PUBLIC_WP_API_URL;
let apolloClient;

const typeDefs = gql`
#    type Nav {
#        isNavOpen: Boolean!
##        cartItems: [ID!]!
#    }
#
#    extend type GeneralSettings {
#        nav: Nav
#    }

    extend type RootQuery {
        nav: Nav
    }


`;

const resolvers = {
  GeneralSettings:{
    nav(){
      return {
        isOpen: false
      }
    }
  },
  RootQuery:{
    nav(){
      return {
        isOpen: false
      }
    }
  },
  Nav:{
    isOpen(){
      return false
    }
  }
}
const mutations = {
  updateNav: (_, variables, { cache }) => {

    //query existing data
    const data = cache.readQuery({ query: NAV_QUERY });

    //Calculate new counter value
    const _currentValue = data.nav.isOpen;
    cache.writeQuery({
      query: NAV_QUERY,
      data: {
        nav: {
          isOpen: !_currentValue
        }
      },
    })
    return {
      nav: {
        isOpen: !_currentValue
      }
    }
  }
}
/*
WITH-APOLLO DOCS
 */
export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'
/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 * @param {Function|Class} PageComponent
 * @param {Object} [config]
 * @param {Boolean} [config.ssr=true]
 */
function _createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    // link: new HttpLink({
    //   uri: 'https://nextjs-graphql-with-prisma-simple.vercel.app/api', // Server URL (must be absolute)
    //   credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    // }),
    uri: API_URL,
    defaultOptions:{
        query:{
          // notifyOnNetworkStatusChange: true
        }
    },
    connectToDevTools: process.env.NODE_ENV === 'development',
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            isLoggedIn: {
              read(){
                return IsLoggedInVar()
              }
            },

            //Pagination
            posts: relayStylePagination()
            // posts:{
            //   keyArgs: ["type"],
            //   merge(existing = [], incoming) {
            //     console.log('existing', existing)
            //     console.log('incoming', incoming)
            //
            //
            //     // return [existing, incoming];
            //     return {
            //       ...existing,
            //       ...incoming
            //     }
            //   },
            // }

            // nav:{
            //   read () {
            //     return NavVar();
            //   }
            // }
          }
        },
      },
    })
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? _createApolloClient()

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
