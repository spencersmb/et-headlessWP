import cookie from 'cookie';
import { loginUser } from '../../lib/auth/authApi'

export default async function login( req, res ) {

  const { username, password } = req?.body ?? {};


  try {
    const data = await loginUser( {username, password} );
    /**
     * SET COOKIE FOR SERVERSIDE ROUTE CHECK
     * Note when you run 'npm run start' locally, cookies won't be set, because locally process.env.NODE_ENV = 'production'
     * so secure will be true, but it will still be http and not https , when tested locally.
     * So when testing locally both in dev and prod, set the value of 'secure' to be false.
     */
    console.log('data.login', data)

    res.setHeader( 'Set-Cookie', cookie.serialize( 'auth', JSON.stringify({
      token: String( data?.login?.authToken ?? '' ),
      refresh: String( data?.login?.refreshToken ?? '' ),
      cmid: String( data?.login?.clientMutationId ?? '' )
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
