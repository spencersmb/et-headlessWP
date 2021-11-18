import { FunctionComponent, ReactElement } from 'react'
import { IEssAuthState } from './authContext'

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
      type: Key;
    }
    : {
      type: Key;
      payload: M[Key];
    }
}

export enum EssAuthTypes {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  MODAL_OPEN = 'MODAL_OPEN',
  MODAL_CLOSE = 'MODAL_CLOSE',
}
type EssAuthPayload = {
  [EssAuthTypes.LOGIN]: null
}
export type EssAuthAction =
  | {type: EssAuthTypes.LOGIN}
  | {type: EssAuthTypes.LOGOUT}
  | {type: EssAuthTypes.MODAL_CLOSE}
  | {type: EssAuthTypes.MODAL_OPEN, payload:{
    template: FunctionComponent | ReactElement
  }}

export type EssAuthActions = ActionMap<EssAuthPayload>[keyof ActionMap<EssAuthPayload>];

export const authReducer = (state: IEssAuthState, action: EssAuthAction): any => {
  // consoleHelper('auth reducer action', action)
  switch (action.type) {

    case EssAuthTypes.LOGIN :
      return {
        ...state,
        loggedIn: true
      }
    case EssAuthTypes.LOGOUT :
      return {
        ...state,
        loggedIn: false
      }
    case EssAuthTypes.MODAL_OPEN :
      return {
        ...state,
        modal: {
          ...state.modal,
          component: action.payload.template,
          open: true,
        }
      }
    case EssAuthTypes.MODAL_CLOSE :
      return {
        ...state,
        modal: {
          ...state.modal,
          open: false,
        }
      }

    default: {
      // throw new Error(`Unhandled action type: ${action.type}`)
      return state
    }
  }
}
