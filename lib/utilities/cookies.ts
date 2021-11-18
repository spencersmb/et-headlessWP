import cookie from 'cookie';
import { IAuthToken } from '../auth/authApi'

export function parseCookies( req ) {
  return cookie.parse( req ? req.headers.cookie : '' );
}

export function getAuthToken( req ): IAuthToken | string {
  const cookies = parseCookies( req );
  return cookies.auth ? JSON.parse(cookies.auth) : '' ;
}