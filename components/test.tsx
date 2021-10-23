import { gql, useMutation, useQuery, useReactiveVar } from '@apollo/client'
import { cache, IsLoggedInVar, NAV_QUERY } from '../lib/apollo-cache'
import { useEssGridAuth } from '../lib/auth/authContext'
import { memo } from 'react'
import { mutations } from '../lib/apollo-mutations'

const TOGGLE_NAV_GQL = gql`
    mutation updateNavMutation($open: Boolean) {
        updateNav(isOpen: $open)@client{
            nav{
                isOpen
            }
        }
    }
`;
const ADD_TODO = gql`
    mutation AddTodo($text: String!) {
        addTodo(text: $text) {
            id
            text
        }
    }
`;
function Test(){
  const {data} = useQuery(NAV_QUERY);
  const [toggleNav, {loading}] = useMutation(TOGGLE_NAV_GQL)
  const isLoggedIn = useReactiveVar(IsLoggedInVar)
  const {toggleIsLoggedIn} = mutations
  console.log('login test', isLoggedIn)

  // const {logUserIn, logoutAction}= useEssGridAuth()
  // const {state} = useEssGridAuth()
  // console.log('state', state)
  console.log('render test')


  // console.log('isNav Open test component', data)
  // console.log('loading', loading)

  return (
    <div>
      TEST
      {/*<h2>Nav Status: {JSON.stringify(state.loggedIn)}</h2>*/}
      {loading && <p>loading</p>}
      <button onClick={()=>{
        toggleIsLoggedIn()
      }}>LoginVar Test</button>
      {/*<button onClick={async ()=>{*/}
      {/*  logUserIn()*/}
      {/* // await toggleNav({ variables: { isOpen: true }})*/}
      {/* }}>Login</button>*/}

      {/*<button onClick={async ()=>{*/}
      {/*  logoutAction()*/}
      {/*  // await toggleNav({ variables: { isOpen: true }})*/}
      {/*}}>LogOut</button>*/}
    </div>
  )
}
export default Test
