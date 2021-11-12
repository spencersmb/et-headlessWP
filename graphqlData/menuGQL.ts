import { gql } from '@apollo/client';
export const MENU_ITEM_FIELDS = gql`
    fragment MenuItemFields on MenuItem {
        __typename
        id
        title
        cssClasses
        id
        parentId
        label
        path
        target
        title
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
`;
export const QUERY_ALL_MENUS = gql`
    ${MENU_ITEM_FIELDS}
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
                                ...MenuItemFields
                                childItems {
                                    edges {
                                        node {
                                            ...MenuItemFields
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
