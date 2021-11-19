import AuthContent from '../../../components/auth/AuthContent'
import PreviewPost from '../../../components/previewPage/previewPost'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import Layout from '../../../components/Layout/Layout'
import { GET_PAGE_BY_ID } from '../../../lib/graphql/queries/page'
const PagePreview = () => {
  const router = useRouter()
  const id = router.query.id.toString()
  const { data, loading, error, refetch } = useQuery(GET_PAGE_BY_ID, {
    variables:{
      id
    }
  });
  return(
    <Layout page={data?.page}>
      <AuthContent>
        <PreviewPost page={data?.page} loading={loading}/>
      </AuthContent>
    </Layout>
  )
}

export default PagePreview
