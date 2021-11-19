import { gql } from '@apollo/client'

export const GET_PAGE_BY_ID = gql`
    query postById($id: ID!) {
        page(idType: DATABASE_ID, id: $id) {
            author {
                node {
                    avatar {
                        height
                        url
                        width
                    }
                    id
                    name
                    slug
                    uri
                }
            }
            id
            content
            date
            featuredImage {
                node {
                    altText
                    caption
                    sourceUrl
                    srcSet
                    sizes
                    id
                }
            }
            title
            content
            seo{
                title
                opengraphPublishedTime
                opengraphModifiedTime
                metaDesc
                readingTime
            }
        }
    }
`;
