import { authInitialState, EssGridAuthContext, IEssAuthState } from './authContext'
import React, { createContext, ReactElement, useContext } from 'react'
import { authReducer } from './authReducer'
import { ApolloError, gql, useQuery } from '@apollo/client'
import { contextWithCredentials } from '../auth/authApi'
import { GET_USER } from '../graphql/queries/user'

interface IProps {
  auth: IEssAuthState
  children?: ReactElement
}
export interface User {
  id: string;
  databaseId: number;
  firstName: string;
  lastName: string;
  email: string;
  capabilities: string[];
}

interface AuthData {
  resourceAuth:IEssAuthState
  wpAuth:{
    loggedIn: boolean;
    user?: User,
    loading: boolean;
    error?: ApolloError;
  }
}

const DEFAULT_STATE: AuthData = {
  resourceAuth: {
    loggedIn: false,
    modal:{
      open: false,
      component: null
    }
  },
  wpAuth:{
    loggedIn: false,
    user: undefined,
    loading: false,
    error: undefined,
  }
};

const AuthContext = createContext(DEFAULT_STATE);
AuthContext.displayName = 'WPAuthContext'

export const useCookieAuth = () => useContext(AuthContext);

const WpAuthProvider = ({auth, children}: IProps) => {

  const { data, loading, error } = useQuery(GET_USER, {
    ...contextWithCredentials
  });

  const user = data?.viewer;
  const loggedIn = Boolean(user);

  const value = {
    resourceAuth: auth,
    wpAuth:{
      loggedIn,
      user,
      loading,
      error,
    }
  };

  console.log('EssAuthProvider', value)

  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
}

export default WpAuthProvider
