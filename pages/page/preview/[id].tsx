import AuthContent from '../../../components/auth/AuthContent'
import PreviewPost from '../../../components/previewPage/previewPost'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'
import Layout from '../../../components/Layout/Layout'
import { GET_PAGE_BY_ID } from '../../../lib/graphql/queries/pages'
import { useEffect } from 'react'
import { useCookieAuth } from '../../../lib/authContext/authProvider'
import { contextWithCredentials } from '../../../lib/auth/authApi'
const PagePreview = () => {
  const router = useRouter()
  const {wpAuth} = useCookieAuth()
  const id = router.query.id.toString()

    const [getPage, { data, loading, error}] = useLazyQuery(GET_PAGE_BY_ID, {
      notifyOnNetworkStatusChange: true,
      variables:{
        id
      },
      ...contextWithCredentials
    });

  useEffect(() => {
    if(wpAuth.loggedIn){
      getPage()
    }
  }, [wpAuth.loggedIn, getPage])

  return(
    <Layout page={data?.page}>
      <AuthContent>
        <PreviewPost page={data?.page} loading={loading}/>
      </AuthContent>
    </Layout>
  )
}

export default PagePreview
