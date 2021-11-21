
/*
url ex: https://every-tuesday.com/api/preview/?postType=page&postId=8333
 */
import {isEmpty} from "lodash"
import { getPreviewRedirectUrl } from '../../lib/utilities/redirects'
export default async function preview(req, res){

  /*
  WORDPRESS NATIVE COOKIE METHOD
   */
  const {postType, postId} = req.query
  const previewUrl = getPreviewRedirectUrl( postType, postId );
  res.writeHead( 307, {Location: previewUrl} );
  res.end();

  /*
  JWT METHOD
   */

  // const {postType, postId} = req.query
  // const authToken = getAuthToken(req)
  //
  // if ( isEmpty( authToken ) ) {
  //   res.writeHead( 307, {Location: `/login/?postType=${postType}&previewPostId=${postId ?? ''}`} );
  // } else {
  //   const previewUrl = getPreviewRedirectUrl( postType, postId );
  //   res.writeHead( 307, {Location: previewUrl} );
  // }
  // res.end();
}
