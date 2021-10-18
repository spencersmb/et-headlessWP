import '../styles/globals.css'
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { useApollo } from '../lib/apollo-client'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../lib/redux/redux-store'

console.log('process.env.WP_API_URL', process.env.WP_API_URL)

const client = new ApolloClient({
  // uri: process.env.WP_API_URL,
  link: new HttpLink({
    uri: 'https://etheadless.wpengine.com/graphql/', // Server URL (must be absolute)
    // credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
  }),
  cache: new InMemoryCache()
});

function MyApp({ Component, pageProps }: AppProps) {
  // const apolloClient = useApollo(pageProps.initialApolloState);
  const apolloClient = useApollo(pageProps)

  return(
    <ApolloProvider client={apolloClient}>
    {/*<Provider store={store}>*/}
      <Component {...pageProps} />
    {/*</Provider>*/}
    </ApolloProvider>
    )
}

export default MyApp
