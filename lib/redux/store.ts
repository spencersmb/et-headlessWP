import { createStore, applyMiddleware, combineReducers } from 'redux'
import { HYDRATE, createWrapper } from 'next-redux-wrapper'
import thunkMiddleware from 'redux-thunk'
import count from './counter/reducer'
import tick from './tick/reducer'
import user from './user/reducer'

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

const combinedReducer = combineReducers({
  user,
  count,
  tick,
})

const reducer = (state, action) => {

  if (action.type === HYDRATE) {
    let nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    }

    if(state.user){
      nextState.user = state.user
    }

    if (state.count.count){
      nextState.count.count = state.count.count
    } // preserve count value on client side navigation
    return nextState
  } else {
    // CLIENT-SIDE

    return combinedReducer(state, action)
  }
}

const initStore = () => {
  return createStore(reducer, bindMiddleware([thunkMiddleware]))
}

export const wrapper = createWrapper(initStore)
