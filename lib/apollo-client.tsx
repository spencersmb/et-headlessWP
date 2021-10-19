import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { useMemo } from 'react'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'

const API_URL = process.env.NEXT_PUBLIC_WP_API_URL;
const API_URL_BACKEND = process.env.WP_API_URL;
let apolloClient;

/*
WITH-APOLLO DOCS
 */
export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'
const flatten = () => (item) =>{
  console.log('flatten', item)
  if(item){
    const newItem = item.edges.map(post => post.node)

    return newItem
  }
  return item

}

function _createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    // link: new HttpLink({
    //   uri: 'https://nextjs-graphql-with-prisma-simple.vercel.app/api', // Server URL (must be absolute)
    //   credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    // }),
    uri: API_URL_BACKEND,
    connectToDevTools: process.env.NODE_ENV === 'development',
    cache: new InMemoryCache({
      typePolicies: {
//         RootQueryToPostConnection:{
//           fields:{
//             edges:{
//               read(item, options){
// console.log('options', options)
//
//                 if(item){
//                   const newItems = item.map(post => {
//                     // console.log('post', post)
//                     const postRefId = post.node.__ref
//                     const refObject = options.readField('post', 'cG9zdDo4Mzgz')
//                     console.log('refObject', refObject)
//
//                   })
//
//
//                   return newItems
//                 }
//                 return item
//               }
//             }
//           }
//         },
//         Post:{
//           // keyFields: ['node'],
//           fields:{
//             date:{
//               read(date, options){
//                 return 'new date'
//               }
//             }
//           }
//         },
        // Query: {
        //   fields: {
        //     // posts: flatten(),
        //     posts:{
        //       read(posts, options) {
        //         // console.log('options', options)
        //
        //         if(posts){
        //           const newItem = posts.edges.map(post => {
        //             // console.log('post', post)
        //             const refObject = options.readField('Post', post.node)
        //             const toRef = options.mergeObjects(post, post.node)
        //             console.log('refObject', toRef)
        //
        //             return post.node
        //           })
        //           // console.log('newItem', newItem)
        //           return newItem
        //         }
        //         return posts
        //       },
        //     }
        //   },
        // },
      },
    }),
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
