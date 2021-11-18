import cookie from 'cookie';
import { IAuthToken, loginUser, refreshUser } from '../../lib/auth/authApi'
import { getAuthToken } from '../../lib/utilities/cookies'
import { isEmpty } from 'lodash'

export default async function refreshAuth( req, res ) {

  const { redirect } = req?.body ?? {};
  const currentToken: IAuthToken | string = getAuthToken(req)

  if(typeof currentToken === 'string'){
    console.log('redirect to', redirect)

    return
  }
  console.log('currentToken to refresh', currentToken)

  try {
    const data = await refreshUser(currentToken);
    /**
     * SET COOKIE FOR SERVERSIDE ROUTE CHECK
     * Note when you run 'npm run start' locally, cookies won't be set, because locally process.env.NODE_ENV = 'production'
     * so secure will be true, but it will still be http and not https , when tested locally.
     * So when testing locally both in dev and prod, set the value of 'secure' to be false.
     */
    console.log('data.refresu User axios', data)

    res.setHeader( 'Set-Cookie', cookie.serialize( 'auth', JSON.stringify({
      token: String( data?.login?.authToken ?? '' ),
      refresh: String( currentToken.refresh ),
      cmid: String( currentToken.cmid  )
    }), {
      httpOnly: true,
      // secure: 'development' !== process.env.NODE_ENV,
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    } ) );

    // Only sending a message that successful, because we dont want to send JWT to client.
    res.status( 200 ).json( { success: Boolean( data?.login?.authToken )} );
  }catch (e){
    console.log('e', e)
    // return res.status(401).json({error: "Bad login"})
    res.status(401).send({
      error: {
        status: 401,
        message: "Wrong Login error",
      },
    });
  }

}
