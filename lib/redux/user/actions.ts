export const userActionTypes = {
  LOGIN: 'LOGIN',
}

export const loginUserAction = () => (dispatch) => {
  return dispatch({ type: userActionTypes.LOGIN })
}
