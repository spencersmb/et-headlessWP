import { gql, useMutation, useQuery, useReactiveVar } from '@apollo/client'
import { IsLoggedInVar, NAV_QUERY } from '../lib/apollo-cache'
import { useEssGridAuth } from '../lib/authContext/authContext'
import { memo } from 'react'
import { mutations } from '../lib/apollo-mutations'

// const TOGGLE_NAV_GQL = gql`
//     mutation updateNavMutation($open: Boolean) {
//         updateNav(isOpen: $open)@client{
//             nav{
//                 isOpen
//             }
//         }
//     }
// `;

function Test(){
  const isLoggedIn = useReactiveVar(IsLoggedInVar)
  const {toggleIsLoggedIn} = mutations
  console.log('login test', isLoggedIn)

  const {logUserIn, logoutAction}= useEssGridAuth()
  const {state} = useEssGridAuth()

  return (
    <div>
      TEST
      {/*<h2>Nav Status: {JSON.stringify(state.loggedIn)}</h2>*/}

      <button onClick={()=>{
        toggleIsLoggedIn()
      }}>LoginVar Test</button>

      <button onClick={async ()=>{
        logUserIn()
       // await toggleNav({ variables: { isOpen: true }})
       }}>Login</button>

      <button onClick={async ()=>{
        logoutAction()
        // await toggleNav({ variables: { isOpen: true }})
      }}>LogOut</button>

    </div>
  )
}
export default Test
