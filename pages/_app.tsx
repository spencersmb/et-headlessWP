import '../styles/globals.css'
import App from "next/app"
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apollo-client'
import type { AppProps } from 'next/app'
import EssAuthProvider from '../lib/auth/authProvider'
import { IEssAuthState } from '../lib/auth/authContext'
import { wrapper } from '../lib/redux/store'

interface IProps {
  auth: IEssAuthState
}
type MyAppProps = IProps & AppProps
function MyApp({ Component, pageProps, auth }: MyAppProps) {
  const apolloClient = useApollo(pageProps)

  return(
    <ApolloProvider client={apolloClient}>
      <EssAuthProvider auth={auth}>
        <Component {...pageProps} />
      </EssAuthProvider>
    </ApolloProvider>
    )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  // const auth = await getUser(appContext.ctx)
  const auth = {
    loggedIn: false,
    modal:{
      open: false,
      component: null
    }
  }
  return { ...appProps, auth: auth }
}

export default wrapper.withRedux(MyApp)


