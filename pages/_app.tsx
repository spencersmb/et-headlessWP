import '../styles/globals.css'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apollo-client'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps)

  return(
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
    )
}

export default MyApp
