
import { gql } from "@apollo/client";

export const Auth = gql`
    mutation LOGIN ( $input: LoginInput!) {
        login(input: $input) {
            authToken
            refreshToken
            clientMutationId
            user {
                id
                username
                name
                email
                firstName
                lastName
            }
        }
    }
`;

export const REFRESH_LOGIN = gql`
    mutation RefreshAuthToken( $input: RefreshJwtAuthTokenInput!) {
        refreshJwtAuthToken(input: $input) {
            authToken
        }
    }
`;

