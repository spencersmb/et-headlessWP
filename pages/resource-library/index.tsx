import Layout from '../../components/Layout/Layout'
import { isEmpty } from 'lodash'
import { sanitize } from '../../lib/utilities/dom'
import { useRouter } from 'next/router'
import { useState } from 'react'
import axios from 'axios'
import { useCookieAuth } from '../../lib/authContext/authProvider'
import UnAuth from '../../components/resourceLibrary/unAuth'
import { getResourceLibraryAuthToken } from '../../lib/utilities/cookies'
import { validateAndSanitizeData } from '../../lib/utilities/validation'

const resourceLibraryPage = {
  title: 'Resource Library',
  slug: 'resource-library',
  description: 'A jam packed resource library of design + lettering files',
  seo:{
    title: 'Resource Library - Every Tuesday',
    opengraphModifiedTime: '',
    metaDesc: 'When you join the Tuesday Tribe, you’ll receive instant access to the Resource Library, filled with textures, fonts, vectors, stationery, graphics, cheat sheets and more.'
  }
}
const CustomNav = () => {
  return(
    <nav>
      <li>Nav</li>
    </nav>
  )
}
const ResourceLibraryLandingPage = () => {
  const router = useRouter();
  const {resourceAuth} = useCookieAuth()
  const [ loginFields, setLoginFields ] = useState( {
    password: '',
  } );
  const [ errorMessage, setErrorMessage ] = useState( null );
  const [ loading, setLoading ] = useState( false );
  const { password } = loginFields;

  /**
   * Sets client side error.
   *
   * Sets error data to result received from our client side validation function,
   * and statusbar to true so that its visible to show the error.
   *
   * @param {Object} validationResult Validation Data result.
   */
  interface IValidationResult{
    errors: {
      password?: string
      username?:string
    }
  }
  const setClientSideError = ( validationResult:IValidationResult ) => {
    if ( validationResult.errors.password ) {
      setErrorMessage( validationResult.errors.password );
    }

    if ( validationResult.errors.username ) {
      setErrorMessage( validationResult.errors.username );
    }
  };
  function handleOnChange(event){
    setLoginFields( { ...loginFields, [event.target.name]: event.target.value } );
  }
  async function onFormSubmit(e){
    e.preventDefault()

    // Validation and Sanitization.
    const defaultData = {password: ''}
    const validationResult = validateAndSanitizeData({data: loginFields, defaultData})
    if ( validationResult.isValid ) {

      setLoading(true);
      return axios( {
        data: {
          password: validationResult.sanitizedData['password'],
        },
        method: 'post',
        url: '/api/resourceLibrary'
      } )
        .then( ( data ) => {
          setLoading( false );
          const {success} = data?.data ?? {};

          if ( success ) {
            router.push( '/resource-library/members' );
          }
          return data?.data?.success;
        } )
        .catch( (e) => {

          // POP-UP ERROR
          setLoading( false );
          setErrorMessage( e.response.data.error.message );
          return false;
        } );

    }else{
      console.log('validationResult', validationResult)

      setClientSideError( validationResult );
    }
  }

  return(
    <Layout page={resourceLibraryPage} alternateNav={<CustomNav />}>
      <UnAuth>
        <div>
          <div className="login-form bg-gray-100 rounded-lg p-8 md:ml-auto mt-10 md:mt-12 w-5/12 m-auto">
            <h4 className="text-gray-900 text-lg font-medium title-font mb-5 block">Login</h4>
            {! isEmpty( errorMessage ) && (
              <div
                className="text-red-600"
                dangerouslySetInnerHTML={{ __html: sanitize( errorMessage ) }}
              />
            )}
            <form onSubmit={onFormSubmit} className="mb-4">
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
        </div>
      </UnAuth>
    </Layout>
  )
}

export function getServerSideProps(context) {

  const resourceAuthToken = getResourceLibraryAuthToken(context.req)

  if(!isEmpty(resourceAuthToken)){
    context.res.writeHead( 307, {Location: '/resource-library/members'} );
    context.res.end();
  }

  return {
    props: {

    }
  }
}

export default ResourceLibraryLandingPage
