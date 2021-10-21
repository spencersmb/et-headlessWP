import { gql } from '@apollo/client';

export const QUERY_ALL_POSTS = gql`
    query AllPosts {
        posts(first: 40) {
            __typename
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
    }
`;

export const QUERY_POST_PER_PAGE = gql`
    query PostPerPage {
        allSettings {
            readingSettingsPostsPerPage
        }
    }
`;
