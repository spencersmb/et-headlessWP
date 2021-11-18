import {isEmpty} from 'lodash';

export const getPreviewRedirectUrl = ( postType = '', previewPostId = '' ) => {

  if ( isEmpty( postType ) || isEmpty( previewPostId ) ) {
    return '';
  }

  switch ( postType ) {
    case 'post':
      return `/blog/preview/${previewPostId}/`;
    case 'page':
      return `/page/preview/${previewPostId}/`;
    default:
      return '/';
  }
};

export const getLoginPreviewRedirectUrl = ( postType = '', previewPostId = '' ) => {
  return `/login/?postType=${postType || ''}&previewPostId=${previewPostId || ''}`;
};

interface IRedirectReturn{
  defaultProps: any
  data: any // page from WP backend Query Call response
  errors: any
  field: string
  isPreview?: boolean
  loginRedirectURL?: string
}
export const handleRedirectsAndReturnData = ( {defaultProps, data, errors, field, isPreview = false, loginRedirectURL = ''}: IRedirectReturn ) => {

  //TODO: CREATE NEW REDIRECTS

  // if ( isPreview && null === data?.[field] ) {
  //   return {
  //     redirect: {
  //       destination: loginRedirectURL || '/',
  //       statusCode: 307
  //     }
  //   };
  // }

  // if ( isEmpty( data ) ) {
  //   return {
  //     redirect: {
  //       destination: '/503',
  //       statusCode: 301
  //     }
  //   };
  // }

  // if ( field && isEmpty( data?.[field] ) ) {
  // if ( field ) {
  //   return {
  //     // returns the default 404 page with a status code of 404
  //     notFound: true
  //   };
  // }

  return defaultProps;
};
