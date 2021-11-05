import { configureStore, ThunkAction, Action, EnhancedStore, AnyAction } from '@reduxjs/toolkit'

import counterReducer, { CounterState } from '../../components/counter/counterSlice'
import { number } from 'prop-types'
import { ThunkMiddlewareFor } from '@reduxjs/toolkit/dist/getDefaultMiddleware'

export function makeStore(preloadedState: any) {
  return configureStore({
    reducer: {
      counter: counterReducer
    },
    preloadedState
  })
}

interface IStoreState {
  counter: {
    value: number
    status: string
  }
}

type MyStore = () => IStoreState

const store = makeStore({})

export type AppState = ReturnType<MyStore>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
  >

export default store
