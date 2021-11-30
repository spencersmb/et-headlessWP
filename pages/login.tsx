import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { isEmpty } from 'lodash'
import { sanitize } from '../lib/utilities/dom'
import { getPreviewRedirectUrl } from '../lib/utilities/redirects'
import { validateAndSanitizeData } from '../lib/utilities/validation'
import { gql, useMutation } from '@apollo/client'
import { useCookieAuth } from '../lib/authContext/authProvider'
import { contextWithCredentials } from '../lib/auth/authApi'

/**
 *
 * @FLOW
 * How Login to preview works
 * Admin clicks preview btn -> redirect to url /api/preview with params of postType & postId to frontEnd based on plugin
 * the api/preview route checks for auth cookie and redirect either to Login page if no auth or preview page if auth is present
 *
 * No Auth flow
 * Admin submits wplogin -> form posts to a proxy url /api/login that allows both an apollo mutation to be made as well as setting
 * the headers response and checking for errors incase there is a bad password or user name
 *
 * If success -> create previewUrl and redirect router.push to the preview
 * If fail -> display error to user
 */

const Login = () => {
  const router = useRouter();
  const [ loginFields, setLoginFields ] = useState( {
    username: '',
    password: '',
  } );
  const [ errorMessage, setErrorMessage ] = useState( null );
  const { username, password } = loginFields;

  /**
   * Sets client side error.
   *
   * Sets error data to result received from our client side validation function,
   * and statusbar to true so that its visible to show the error.
   *
   * @param {Object} validationResult Validation Data result.
   */
  const setClientSideError = ( validationResult ) => {
    if ( validationResult.errors.password ) {
      setErrorMessage( validationResult.errors.password );
    }

    if ( validationResult.errors.username ) {
      setErrorMessage( validationResult.errors.username );
    }
  };
  const handleOnChange = ( event ) => {
    setLoginFields( { ...loginFields, [event.target.name]: event.target.value } );
  };
  const {wpAuth:{loggedIn}} = useCookieAuth()

  /*
  * Cookie Method
  */
  const {postType, previewPostId} = router?.query ?? {};

  const LOG_IN = gql`
      mutation logIn($login: String!, $password: String!) {
          loginWithCookies(input: {
              login: $login
              password: $password
          }) {
              status
          },
      }
  `;

  const GET_USER = gql`
      query getUser {
          viewer {
              id
              databaseId
              firstName
              lastName
              email
              capabilities
          }
      }
  `;

  const [logIn, { loading, error, data }] = useMutation(LOG_IN, {
    refetchQueries: [
      { query: GET_USER,
        ...contextWithCredentials
      },
    ],
    ...contextWithCredentials
  });

  function onCookieFormSubmit(event){
    event.preventDefault()

    // Validation and Sanitization.
    // const validationResult = validateAndSanitizeLoginForm( {
    //   username: loginFields?.username ?? '',
    //   password: loginFields?.password ?? '',
    // } );
    const validationResult = validateAndSanitizeData({data:{
      ...loginFields
      }, defaultData:{
        username: '',
        password: ''
      }})

    if ( validationResult.isValid ) {
      logIn({
        variables: {
          login: loginFields.username,
          password: loginFields.password,
        }
      }).then((result)=>{
        console.log('result', result)
      }).catch(error => {
        setErrorMessage(error)
        console.error(error);
      });

    }else{
      setClientSideError( validationResult );
    }
  }

  function tempLogin (){
    const user = {
      username: 'teelac',
      password: 'Sparkles0626311?!'
    }
    const query = `
  mutation logIn($login: String!, $password: String!) {
      loginWithCookies(input: {
          login: $login
          password: $password
      }) {
          status
      },
  }
  `
    const variables = {
      login: user.username,
      password: user.password
    }
    return fetch(process.env.NEXT_PUBLIC_WP_API_URL, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      // @ts-ignore
      // agent,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
  }

  useEffect(() => {
    if(loggedIn === true){
      router.push(getPreviewRedirectUrl(postType.toString(), previewPostId.toString()));
    }
  }, [loggedIn, postType, previewPostId, router])

  return (
    <Layout>
      <div className="login-form bg-gray-100 rounded-lg p-8 md:ml-auto mt-10 md:mt-12 w-5/12 m-auto">
        <h4 className="text-gray-900 text-lg font-medium title-font mb-5 block">Login</h4>
        {! isEmpty( errorMessage ) && (
          <div
            className="text-red-600"
            dangerouslySetInnerHTML={{ __html: sanitize( errorMessage ) }}
          />
        )}
        <form onSubmit={onCookieFormSubmit} className="mb-4">
          <label className="leading-7 text-sm text-gray-600">
            Username:
            <input
              type="text"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              name="username"
              value={username}
              onChange={handleOnChange}
            />
          </label>
          <br />
          <label className="leading-7 text-sm text-gray-600">
            Password:
            <input
              type="password"
              className="mb-8 w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              name="password"
              value={password}
              onChange={handleOnChange}
            />
          </label>
          <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" type="submit">
            Login
          </button>
          {loading ? <p>Loading...</p> : null  }
        </form>
      </div>
      <button onClick={tempLogin}>LOGIN</button>
    </Layout>
  );
};

export default Login
export function getStaticProps() {
  return {
    props: {

    }
  }
}
