import { gql } from '@apollo/client';

export const QUERY_ALL_PAGES = gql`
    {
        pages(first: 10000, where: { hasPassword: false }) {
            edges {
                node {
                    children {
                        edges {
                            node {
                                id
                                slug
                                uri
                                ... on Page {
                                    id
                                    title
                                }
                            }
                        }
                    }
                    content
                    featuredImage {
                        node {
                            altText
                            caption
                            id
                            sizes
                            sourceUrl
                            srcSet
                        }
                    }
                    id
                    menuOrder
                    parent {
                        node {
                            id
                            slug
                            uri
                            ... on Page {
                                title
                            }
                        }
                    }
                    slug
                    title
                    uri
                }
            }
        }
    }
`;

export const CORE_PAGE_FIELDS = gql`
    fragment CorePageFields on Page {
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
`

export const GET_PAGE_BY_ID = gql`
    ${CORE_PAGE_FIELDS}
    query pageById($id: ID!) {
        page(idType: DATABASE_ID, id: $id) {
            ...CorePageFields
        }
    }
`;
