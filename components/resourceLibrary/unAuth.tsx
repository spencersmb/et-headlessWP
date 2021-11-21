import { useCookieAuth } from '../../lib/authContext/authProvider'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

const UnAuth = ({children}: any) => {
  const router = useRouter();
  const {resourceAuth} = useCookieAuth()

  useEffect(() => {
    if (resourceAuth.loggedIn) {
      router.push('/resource-library/members');
    }
  }, [router, resourceAuth.loggedIn]);

  return <>{children}</>;
}

export default UnAuth
