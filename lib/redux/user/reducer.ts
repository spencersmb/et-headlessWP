import { loginUserAction, userActionTypes } from './actions'

const userInitialState = null

export default function reducer(state = userInitialState, action) {
  switch (action.type) {
    case userActionTypes.LOGIN:
      return Object.assign({}, state, {
          name: 'spencer'
      })
    default:
      return state
  }
}
