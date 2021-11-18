import { CORE_POST_FIELDS } from '../../../graphqlData/postsData'
import { gql } from '@apollo/client';

export const GET_POST_BY_ID = gql`
    ${CORE_POST_FIELDS}
    query postById($id: ID!) {
        post(idType: DATABASE_ID, id: $id) {
            ...CorePostFields
        }
    }
`;
