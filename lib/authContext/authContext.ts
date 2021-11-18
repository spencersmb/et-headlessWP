import { createContext, useContext, Dispatch, FunctionComponent, ReactElement } from 'react'
import { EssAuthAction, EssAuthTypes } from './authReducer'

export interface IEssAuthState {
  loggedIn: boolean
  modal:{
    open: boolean,
    component: null | FunctionComponent | ReactElement
  }
}
interface IAuthContextType {
  state: IEssAuthState,
  dispatch: Dispatch<EssAuthAction>
}
export const authInitialState  = {
  loggedIn: false,
  modal:{
    open: false,
    component: null
  },
}

export const EssGridAuthContext = createContext<IAuthContextType>({
  state: authInitialState,
  dispatch: () => null
})

EssGridAuthContext.displayName = 'EssGridAuthContext'

const useEssGridAuthContext = () => {
  const context = useContext(EssGridAuthContext)
  if (!context) {
    throw new Error('useEssGridAuthContext must be used within a Auth Provider app')
  }
  return context
}

export const useEssGridAuth = () => {
  const {state, dispatch} = useEssGridAuthContext()
  const logUserIn = (options: { modal: boolean } = {modal: false} ) => {
    //close modal
    if(options?.modal){
      // dispatch({type: EssAuthTypes.MODAL_CLOSE})
    }
    dispatch({
      type: EssAuthTypes.LOGIN
    })
  }
  const logoutAction = () => {
    dispatch({
      type: EssAuthTypes.LOGOUT
    })
  }

  return {
    logUserIn,
    logoutAction,
    // getLogOutBtnProps,
    // getOpenModalProps,
    // openModal,
    // closeModal,
    // loginAction,
    state,
    dispatch
  }
}

