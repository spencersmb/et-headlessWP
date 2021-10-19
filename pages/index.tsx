import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import { flattenAllPosts, getAllPosts, getPaginatedPosts } from '../lib/posts'
import Pagination from '../components/pagination';
import { addApolloState, initializeApollo, useApollo } from '../lib/apollo-client'
import { QUERY_ALL_POSTS, QUERY_POST_PER_PAGE } from '../graphqlData/postsData'
import { useQuery } from '@apollo/client'
export default function Home(props) {
  console.log('props', props)



  // 1st ATTEMPT
  // const {posts} = props
  // const { loading, error, data } = useQuery(QUERY_ALL_POSTS,{
  //
  // });
  //


  // const postsPerPage = Number(postData.data.allSettings.readingSettingsPostsPerPage);
  // const pagesCount = Math.ceil(posts.length / postsPerPage);
  //
  // let page = Number(1);
  // if (typeof page === 'undefined' || isNaN(page) || page > pagesCount) {
  //   page = 1;
  // }
  //
  // const offset = postsPerPage * (page - 1);
  // const sortedPosts = sortStickyPosts(posts);
  // const newPosts = sortedPosts.slice(offset, offset + postsPerPage);

  /*
  WITH-APOLLO
   */
  // const { loading, error, data, fetchMore, networkStatus } = useQuery(
  //   QUERY_ALL_POSTS,
  //   {
  //     // variables: allPostsQueryVars,
  //     // Setting this value to true will make the component rerender when
  //     // the "networkStatus" changes, so we are able to know if it is fetching
  //     // more data
  //     notifyOnNetworkStatusChange: true,
  //   }
  // )

  const posts = []

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Welcome to our demo blog!</h1>
      <p>
        You can find more articles on the{' '}
        <Link href='/blog'>
          <a>blog articles page</a>
        </Link>
      </p>

      <div>
        <h3>Posts</h3>
        <ul>
          {posts
            // .filter((post,index) => (index < 10))
            .map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Pagination</h3>
        {/*<Pagination*/}
        {/*  postsLength={posts.length}*/}
        {/*  basePath={props.basePath}*/}
        {/*/>*/}
      </div>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
//
export async function getStaticProps(context){
  // Colby way
  // const { posts, pagination } = await getPaginatedPostsV2();

  // 1st attempt
  // const {initialApolloState} =  await getPaginatedPostsV2()

  /**
   * WITH-APOLLO
   */
  const apolloClient = initializeApollo()

  const {posts, pagination} = await getPaginatedPosts()
  // const {data} = await apolloClient.query({
  //   query: QUERY_ALL_POSTS,
  //   // variables: allPostsQueryVars,
  // })
  //
  // await apolloClient.query({
  //   query: QUERY_POST_PER_PAGE,
  // });
  //
  //
  // const posts = flattenAllPosts(data.posts) || []


  return addApolloState(apolloClient, {
    props: {
      posts,
      pagination,
      basePath: '/blog'
    },
    revalidate: 5,
  })

  /*
  Following Apollo blog
   */
  // return {
  //   props: {
  //     initialApolloState: apolloClient.cache.extract(),
  //     posts:[]
  //   },
  //   revalidate: 1,
  // };
  //
  // return {
  //   props: {
  //     // initialApolloState,
  //     posts: [],
  //     // pagination: {
  //     //   ...pagination,
  //     //   basePath: '/blog',
  //     // },
  //   },
  //   revalidate: 5
  // };
}
