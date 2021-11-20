import { getAuthToken } from '../../../lib/utilities/cookies'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { initializeApollo } from '../../../lib/apollo-client'
import Cookies from 'cookies'
import {
  getLoginPreviewRedirectUrl,
  getPreviewRedirectUrl,
  handleRedirectsAndReturnData
} from '../../../lib/utilities/redirects'
import { GET_POST_BY_ID } from '../../../lib/graphql/queries/posts'
import Link from 'next/link'
import Layout from '../../../components/Layout/Layout'
import { mapPostData } from '../../../lib/wp/posts'
import { isEmpty } from 'lodash'
import axios from 'axios'
import { refreshUser } from '../../../lib/auth/authApi'
import { useRouter } from 'next/router'
import AuthContent from '../../../components/auth/AuthContent'
import PreviewPost from '../../../components/previewPage/previewPost'
import { useLazyQuery } from '@apollo/client'
import { useCookieAuth } from '../../../lib/authContext/authProvider'
import { useEffect } from 'react'

const PostPreview = () => {
  const router = useRouter()
  const {loggedIn} = useCookieAuth()
  const id = router.query.id.toString()

  const [getPost, { data, loading, error}] = useLazyQuery(GET_POST_BY_ID, {
    notifyOnNetworkStatusChange: true,
    variables:{
      id
    }
  });

  useEffect(() => {
    if(loggedIn){
      console.log('refetch')
      getPost()
    }
  }, [loggedIn, getPost])
  return(
    <Layout post={data?.post}>
      <AuthContent>
        <PreviewPost post={data?.post} loading={loading}/>
      </AuthContent>
    </Layout>
  )
}

export default PostPreview

/*
 JWT COOKIE REFERENCE
 */
// export const JWTCOOKIEgetServerSideProps: GetServerSideProps = async (context) => {
//   const apolloClient = initializeApollo()
//   const authToken = getAuthToken(context.req)
//   const {params} = context
//   const loginRedirectURL = getLoginPreviewRedirectUrl( 'post', params?.id.toString() ?? '' );
//   const cookies = new Cookies(context.req, context.res)
//   console.log('authToken', authToken)
//
//   if(typeof authToken === 'string'){
//     return {
//       redirect: {
//         destination: loginRedirectURL,
//         permanent: false,
//       },
//       props: {}
//     }
//
//   }
//
//   let defaultProps = {
//     props: {
//       data:{
//         post: {
//           title: '',
//           content: ''
//         }
//       }
//     }
//   };
//
//   try {
//     const { data, errors } = await apolloClient.query( {
//       query: GET_POST_BY_ID,
//       variables: {
//         id: Number( params?.id ?? '' ),
//       },
//       context: {
//         headers: {
//           authorization: authToken ? `Bearer ${authToken.token}` : '',
//         }
//       }
//     } );
//     defaultProps = {
//       props: {
//         data: data || {}
//       }
//     };
//     return defaultProps
//   }catch (e){
//     console.log('Apollo GET POST BY ID error ', e.response)
//     // refresh token mutation
//   }
//   console.log('REFRESH attempt')
//
//   try {
//     const oldCookie = authToken
//     const data = await refreshUser(authToken);
//
//
//     console.log('refresh data', data)
//     cookies.set('myCookieName', 'some-value', {
//       httpOnly: true // true by default
//     })
//     cookies.set('auth', JSON.stringify({
//       token: String( data?.refreshJwtAuthToken?.authToken ?? '' ),
//       refresh: String( authToken.refresh),
//       cmid: String( authToken.cmid )
//     }))
//
//     return {
//       redirect: {
//         destination: getPreviewRedirectUrl('post', params?.id.toString()),
//         permanent: false,
//       },
//       props: {}
//     }
//
//   }catch(e){
//       console.log('refresh e', e)
//
//     // delete cookie
//     cookies.set('auth')
//     return {
//       redirect: {
//         destination: loginRedirectURL,
//         permanent: false,
//       },
//       props: {}
//     }
//     // return to login page
//
//   }
//
//   /*
//     handleRedirectsAndReturnData - checks response to redirect before allowing to view page in_case user is not logged in ?
//    */
//   // return handleRedirectsAndReturnData( {
//   //   defaultProps,
//   //   data: data || {},
//   //   errors,
//   //   field:'post',
//   //   isPreview:true,
//   //   loginRedirectURL
//   // } );
// }
