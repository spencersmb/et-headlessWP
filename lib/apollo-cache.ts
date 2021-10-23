import { InMemoryCache, Reference, makeVar, gql } from '@apollo/client'

// Initializes to true if localStorage includes a 'token' key,
// false otherwise
export const NavVar = makeVar<{isOpen: boolean}>({
  isOpen: false
});

export const IsLoggedInVar = makeVar<boolean>(false);


// Initializes to an empty array
export const cartItemsVar = makeVar<string[]>([]);
export const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read(){
              return IsLoggedInVar()
            }
          }
          // nav:{
          //   read () {
          //     return NavVar();
          //   }
          // }
          // cartItems: {
          //   read () {
          //     return cartItemsVar();
          //   }
          // },
        }
      },
    },
  })

export const NAV_QUERY = gql`
    query Settings {
        nav @client
    }
`;
cache.writeQuery({
  query: NAV_QUERY,
  data: {
    nav:{
      isOpen: false
    }
  },
});
