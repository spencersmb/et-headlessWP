import AuthContent from '../../../components/auth/AuthContent'
import PreviewPost from '../../../components/previewPage/previewPost'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'
import Layout from '../../../components/Layout/Layout'
import { GET_PAGE_BY_ID } from '../../../lib/graphql/queries/page'
import { useEffect } from 'react'
import { useCookieAuth } from '../../../lib/authContext/authProvider'
const PagePreview = () => {
  const router = useRouter()
  const {loggedIn} = useCookieAuth()
  const id = router.query.id.toString()

  const [getPage, { data, loading, error}] = useLazyQuery(GET_PAGE_BY_ID, {
    notifyOnNetworkStatusChange: true,
    variables:{
      id
    },
    context:{
      credentials: 'include'
    }
  });

  useEffect(() => {
    if(loggedIn){
      console.log('refetch')
      getPage()
    }
  }, [loggedIn])
  console.log('parent loggedIn', loggedIn)
  console.log('render page parent', data)

  return(
    <Layout page={data?.page}>
      <AuthContent>
        <PreviewPost page={data?.page} loading={loading}/>
      </AuthContent>
    </Layout>
  )
}

export default PagePreview
