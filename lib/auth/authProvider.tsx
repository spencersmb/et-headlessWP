import { authInitialState, EssGridAuthContext, IEssAuthState } from './authContext'
import React, { ReactElement } from 'react'
import { authReducer } from './authReducer'

interface IProps {
  auth: IEssAuthState
  children?: ReactElement
}
const EssAuthProvider = ({auth, children}: IProps) => {

  const initialState = auth
  const [state, dispatch] = React.useReducer(authReducer, auth)
  const value = {state, dispatch}
  return <EssGridAuthContext.Provider value={value}>
    {children}
  </EssGridAuthContext.Provider>
}

export default EssAuthProvider
