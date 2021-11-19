import { useRouter } from 'next/router'
import React, { ReactElement, ReactNode, useEffect } from 'react'
import { useCookieAuth } from '../../lib/authContext/authProvider'
import { getLoginPreviewRedirectUrl } from '../../lib/utilities/redirects'

export default function AuthContent({ children }: { children: ReactNode }) {
  const { loggedIn, loading } = useCookieAuth();
  const router = useRouter();
  const postType = router.pathname.split('/').splice(1).shift()
  console.log('postType', postType)

  const {id} = router.query
  const redirectUrl = getLoginPreviewRedirectUrl( postType, id.toString() );
  // const childrenWithProps = React.Children.map(
  //   children,
  //   (child) =>
  //     React.cloneElement(child, {
  //       postType,
  //     })
  // );

  // Navigate unauthenticated users to Log In page.
  useEffect(() => {
    if (!loading && !loggedIn) {
      router.push(redirectUrl);
    }
  }, [loggedIn, loading, router]);

  if (loggedIn) {
    return <>{children}</>;
  }

  return <p>Checking Login Status...</p>;
}
