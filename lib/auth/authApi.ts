import { initializeApollo } from '../apollo-client'
import { Auth, REFRESH_LOGIN } from '../graphql/mutations/auth'
import { v4 } from 'uuid';


export const contextWithCredentials = {
  context:{
    credentials: 'include'
  }
}

/*
 USED FOR JWT TOKENS
 */
export async function loginUser( {username, password} ) {
  console.log('username', username)
  console.log('password', password)


  const apolloClient = initializeApollo()
  const { data, errors } = await apolloClient.mutate( {
    mutation: Auth,
    variables: {
      input: {
        clientMutationId: v4(), // Generate a unique id
        username: username || '',
        password: password || '',
      },
    },
  } );

  return data || {};
}
export interface IAuthToken {
  token: string
  refresh: string
  cmid: string
}
export async function refreshUser( {refresh, cmid}: IAuthToken) {

  const apolloClient = initializeApollo()
  const { data, errors } = await apolloClient.mutate( {
    mutation: REFRESH_LOGIN,
    variables: {
      input: {
        clientMutationId: cmid,
        jwtRefreshToken: refresh
      },
    },
  } );

  return data || {};
}
