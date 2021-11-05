import { InMemoryCache, makeVar, gql } from '@apollo/client'

export const IsLoggedInVar = makeVar<boolean>(false);

// Initializes to an empty array
export const cartItemsVar = makeVar<string[]>([]);

/*
Example: How to query local data from cache
 */
export const NAV_QUERY = gql`
    query Settings {
        nav @client
    }
`;

/*
Example: How to write local data to cache - **causes a render on client side**
 */
// cache.writeQuery({
//   query: NAV_QUERY,
//   data: {
//     nav:{
//       isOpen: false
//     }
//   },
// });
