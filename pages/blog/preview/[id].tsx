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

const PostPreview = (props) => {
  console.log('props', props)
  const {data} = props
  // const post = mapPostData(data.post)
  // console.log('post', post)

  return(
    // <Layout post={data.post}>
      <div>
        <h1>{data.post.title}</h1>
        <div dangerouslySetInnerHTML={{__html: data.post.content}} />
        <Link href='/'>
          <a>home</a>
        </Link>
      </div>
    // </Layout>
  )
}

export default PostPreview

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo()
  const authToken = getAuthToken(context.req)
  const {params} = context
  const loginRedirectURL = getLoginPreviewRedirectUrl( 'post', params?.id.toString() ?? '' );
  const cookies = new Cookies(context.req, context.res)
  console.log('authToken', authToken)

  if(typeof authToken === 'string'){
    return {
      redirect: {
        destination: loginRedirectURL,
        permanent: false,
      },
      props: {}
    }

  }

  let defaultProps = {
    props: {
      data:{
        post: {
          title: '',
          content: ''
        }
      }
    }
  };

  try {
    const { data, errors } = await apolloClient.query( {
      query: GET_POST_BY_ID,
      variables: {
        id: Number( params?.id ?? '' ),
      },
      context: {
        headers: {
          authorization: authToken ? `Bearer ${authToken.token}` : '',
        }
      }
    } );
    defaultProps = {
      props: {
        data: data || {}
      }
    };
    return defaultProps
  }catch (e){
    console.log('error', e)
    // refresh token mutation
  }
  console.log('REFRESH attempt')

try {

  const data = await refreshUser(authToken);

  console.log('refresh data', data)
  cookies.set('myCookieName', 'some-value', {
    httpOnly: true // true by default
  })
  cookies.set('auth', JSON.stringify({
    token: String( data?.refreshJwtAuthToken?.authToken ?? '' ),
    refresh: String( authToken.token),
    cmid: String( authToken.cmid )
  }))

  return {
    redirect: {
      destination: getPreviewRedirectUrl('post', params?.id.toString()),
      permanent: false,
    },
    props: {}
  }

}catch(e){
    console.log('refresh e', e)

  // delete cookie
  cookies.set('auth')
  return {
    redirect: {
      destination: loginRedirectURL,
      permanent: false,
    },
    props: {}
  }
  // return to login page

}

  // return await axios( {
  //   data: {
  //     redirect: loginRedirectURL
  //   },
  //   method: 'post',
  //   url: '/api/refreshAuth'
  // } )
  //   .then( ( data ) => {
  //     const {success} = data?.data ?? {};
  //
  //     // refresh the window?
  //     if ( success ) {
  //       return {
  //         redirect: {
  //           destination: getPreviewRedirectUrl('post', params?.id.toString()),
  //           permanent: false,
  //         },
  //         props: {}
  //       }
  //     }
  //   } )
  //   .catch( (e) => {
  //     console.log('eee', e.response.statusText)
  //
  //     // return {
  //     //   redirect: {
  //     //     destination: loginRedirectURL,
  //     //     permanent: false,
  //     //   },
  //     //   props: {}
  //     // }
  //     return defaultProps
  //   } );


  /*
    handleRedirectsAndReturnData - checks response to redirect before allowing to view page in_case user is not logged in ?
   */
  // return handleRedirectsAndReturnData( {
  //   defaultProps,
  //   data: data || {},
  //   errors,
  //   field:'post',
  //   isPreview:true,
  //   loginRedirectURL
  // } );
}
