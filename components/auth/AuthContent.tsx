import { useRouter } from 'next/router'
import React, { ReactNode, useEffect } from 'react'
import { useCookieAuth } from '../../lib/authContext/authProvider'
import { getLoginPreviewRedirectUrl } from '../../lib/utilities/redirects'

export default function AuthContent({ children }: { children: ReactNode }) {
  const { wpAuth: {loggedIn, loading} } = useCookieAuth();
  const router = useRouter();
  const postType = router.pathname.split('/').splice(1).shift()
  const {id} = router.query
  const redirectUrl = getLoginPreviewRedirectUrl( postType, id.toString() );

  // Navigate unauthenticated users to Log In page.
  useEffect(() => {
    if (!loading && !loggedIn) {
      router.push(redirectUrl);
    }
  }, [loggedIn, loading, router, redirectUrl]);

  if (loggedIn) {
    return <>{children}</>;
  }

  return <p>Checking Login Status...</p>;
}
