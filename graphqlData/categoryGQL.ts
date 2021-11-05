import { gql } from '@apollo/client'

export const QUERY_ALL_CATEGORIES = gql`
    {
        categories(first: 10000) {
            edges {
                node {
                    databaseId
                    description
                    id
                    name
                    slug
                }
            }
        }
    }
`;
