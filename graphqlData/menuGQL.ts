import { gql } from '@apollo/client';

export const QUERY_ALL_MENUS = gql`
    {
        menus {
            edges {
                node {
                    name
                    slug
                    locations
                    menuItems {
                        edges {
                            node {
                                cssClasses
                                id
                                parentId
                                label
                                path
                                featured {
                                    courses {
                                        __typename
                                        ... on Course {
                                            id
                                            details {
                                                url
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
