import { ReactiveVar } from '@apollo/client'
import { IsLoggedInVar } from './apollo-cache'
function createToggleIsLoggedIn (isLoggedInVar: ReactiveVar<boolean>) {
  return () => {
    isLoggedInVar(!isLoggedInVar())
  }
}
export const mutations = {
    toggleIsLoggedIn: createToggleIsLoggedIn(IsLoggedInVar)
}
