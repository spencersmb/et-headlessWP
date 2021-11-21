import cookie from 'cookie';
import { sha256 } from 'crypto-hash'
export default async function resourceLibraryAPI( req, res ) {
  const { password } = req?.body ?? {};

  if(password !== process.env.RESOURCE_LIBRARY_PW){
    res.status(401).send({
      error: {
        status: 401,
        message: `Incorrect password`,
      },
    });
    return
  }
  try {
    /**
     * SET COOKIE FOR SERVERSIDE ROUTE CHECK
     * Note when you run 'npm run start' locally, cookies won't be set, because locally process.env.NODE_ENV = 'production'
     * so secure will be true, but it will still be http and not https , when tested locally.
     * So when testing locally both in dev and prod, set the value of 'secure' to be false.
     */

    res.setHeader( 'Set-Cookie', cookie.serialize( 'resourceAuth', JSON.stringify({
      token: String( sha256 ),
    }), {
      httpOnly: true,
      // secure: 'development' !== process.env.NODE_ENV,
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    } ) );

    // Only sending a message that successful, because we dont want to send JWT to client.
    res.status( 200 ).json( { success: true} );
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
