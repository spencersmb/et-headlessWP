import { GetServerSidePropsContext } from 'next'
import { getLoginPreviewRedirectUrl } from '../../lib/utilities/redirects'
import { initializeApollo } from '../../lib/apollo-client'
import { QUERY_NEXT_POSTS } from '../../lib/graphql/queries/posts'
import { contextWithCredentials } from '../../lib/auth/authApi'
import { GET_USER } from '../../lib/graphql/queries/user'

const PreviewAuthSSR = () => async ({query, params, req, resolvedUrl}: GetServerSidePropsContext) => {

  const postType = resolvedUrl.split('/').splice(1).shift()
  const id = query.toString()
  const redirectUrl = getLoginPreviewRedirectUrl( postType, id );

  console.log('redirectUrl', redirectUrl)

  const apolloClient = initializeApollo()

  const data = await apolloClient.query({
    query: GET_USER,
    ...contextWithCredentials
  })

  console.log('data', req.cookies)


  return {
    props: {
      test: 'spencer'
    }
  }

}
export default PreviewAuthSSR

