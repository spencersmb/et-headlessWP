import { gql } from '@apollo/client';
export const CORE_POST_FIELDS = gql`
    fragment CorePostFields on Post {
        __typename
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
        categories {
            edges {
                node {
                    databaseId
                    id
                    name
                    slug
                }
            }
        }
        tags{
            edges{
                node{
                    name
                }
            }
        }
        content
        date
        excerpt
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
        modified
        databaseId
        title
        slug
        isSticky
        seo{
            fullHead
            title
            opengraphPublishedTime
            opengraphModifiedTime
            metaDesc
            readingTime
        }
    }
`;
export const QUERY_ALL_POSTS = gql`
    ${CORE_POST_FIELDS}
    query AllPosts($count: Int) {
        posts(first: $count) {
            __typename
            edges {
                __typename
                node {
                    ...CorePostFields
                }
            }
        }
        allSettings {
            readingSettingsPostsPerPage
        }
    }
`;

export const QUERY_NEXT_POSTS = gql`
    query NextPosts($after: String, $first: Int) {
        posts(first: $first, after: $after) {
            __typename
            pageInfo{
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
                __typename
            }
            edges {
                __typename
                node {
                    __typename
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
                        }
                    }
                    id
                    categories {
                        edges {
                            node {
                                databaseId
                                id
                                name
                                slug
                            }
                        }
                    }
                    content
                    date
                    excerpt
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
                    modified
                    databaseId
                    title
                    slug
                    isSticky
                }
            }
        }
        allSettings {
            readingSettingsPostsPerPage
        }
    }
`;

export const QUERY_POST_BY_SLUG = gql`
    ${CORE_POST_FIELDS}
    query postBySlug($slug: String!) {
        postBy(slug: $slug) {
            ...CorePostFields
        }
    }
`

export const QUERY_POST_PER_PAGE = gql`
    query PostPerPage {
        allSettings {
            readingSettingsPostsPerPage
        }
    }
`;
