import { authInitialState, EssGridAuthContext, IEssAuthState } from './authContext'
import React, { createContext, ReactElement, useContext } from 'react'
import { authReducer } from './authReducer'
import { ApolloError, gql, useQuery } from '@apollo/client'

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
  loggedIn: boolean;
  user?: User,
  loading: boolean;
  error?: ApolloError;
}

const DEFAULT_STATE: AuthData = {
  loggedIn: false,
  user: undefined,
  loading: false,
  error: undefined,
};
const GET_USER = gql`
    query getUser {
        viewer {
            id
            databaseId
            firstName
            lastName
            email
            capabilities
        }
    }
`;
const AuthContext = createContext(DEFAULT_STATE);
AuthContext.displayName = 'WPAuthContext'

export const useCookieAuth = () => useContext(AuthContext);

const WpAuthProvider = ({auth, children}: IProps) => {

  const { data, loading, error } = useQuery(GET_USER, {
    context:{
      credentials: 'include'
    }
  });
  console.log('EssAuthProvider user', data)

  const user = data?.viewer;
  const loggedIn = Boolean(user);

  const value = {
    loggedIn,
    user,
    loading,
    error,
  };

  // const [state, dispatch] = React.useReducer(authReducer, auth)
  // const value = {state, dispatch}
  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
}

export default WpAuthProvider
