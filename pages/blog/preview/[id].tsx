import { GET_POST_BY_ID } from '../../../lib/graphql/queries/posts'
import Layout from '../../../components/Layout/Layout'
import { contextWithCredentials } from '../../../lib/auth/authApi'
import { useRouter } from 'next/router'
import AuthContent from '../../../components/auth/AuthContent'
import PreviewPost from '../../../components/previewPage/previewPost'
import { useLazyQuery } from '@apollo/client'
import { useCookieAuth } from '../../../lib/authContext/authProvider'
import { useEffect } from 'react'
import PreviewAuthSSR from '../../../components/previewPage/previewAuthSSR'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

const PostPreview = () => {
  const router = useRouter()
  const {wpAuth} = useCookieAuth()
  const id = router.query.id.toString()

  const [getPost, { data, loading, error}] = useLazyQuery(GET_POST_BY_ID, {
    notifyOnNetworkStatusChange: true,
    variables:{
      id
    },
    ...contextWithCredentials
  });
  useEffect(() => {
    if(wpAuth.loggedIn){
      getPost()
    }
  }, [wpAuth.loggedIn, getPost])

  return(
    <Layout post={data?.post}>
      <AuthContent>
        <PreviewPost post={data?.post} loading={loading}/>
      </AuthContent>
    </Layout>
  )
}

export default PostPreview

// export const getServerSideProps = PreviewAuthSSR()

