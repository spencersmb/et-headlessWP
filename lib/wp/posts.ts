import { APOLLO_STATE_PROP_NAME, initializeApollo } from '../apollo-client'
import { QUERY_ALL_POSTS, QUERY_POST_PER_PAGE } from '../../graphqlData/postsData'
import { sortObjectsByDate } from '../utilities/dateTime'

/**
 * getAllPosts
 */
export async function getAllPosts():Promise<{posts: IPost[]}> {

  const apolloClient = initializeApollo();
  const data = await apolloClient.query({
    query: QUERY_ALL_POSTS,
  });

  const posts = data?.data?.posts?.edges.map(({ node = {} }) => node);

  return {
    posts: Array.isArray(posts) && posts.map(mapPostData)
  };
}

export function flattenAllPosts(posts:any): IPost[] {
  const postsFiltered = posts?.edges?.map(({ node = {} }) => node);
  return Array.isArray(postsFiltered) && postsFiltered.map(mapPostData)
}

export function flattenPost(post: IPostRaw): IPost {
  return mapPostData(post)
}

export function mapPostData(post:IPostRaw | {} = {}): IPost {
  const data = { ...post };
  let modifiedData: any = {...post}

  // Clean up the author object to avoid someone having to look an extra
  // level deeper into the node
  if (data.author)  {
    modifiedData.author = {
        ...data.author.node,
      }
    }

  // Clean up the categories to make them more easy to access
  if (data.categories) {
    modifiedData.categories = data.categories.edges.map(({ node }) => {
      return {
        ...node,
      };
    });
  }

  // Clean up the featured image to make them more easy to access
  if (data.featuredImage) {
    modifiedData.featuredImage = data.featuredImage.node;
  }

  if (data.tags) {
    modifiedData.tags = data.tags.edges.map(({ node }) => {
      return {
        name: node.name,
      };
    });
  }

  return modifiedData

}

export function getCurrentPage({
                                    pagesCount,
                                    currentPage = 1
                                  }:{pagesCount: number, currentPage?: number}) {
  let page = Number(currentPage);
  if (typeof page === 'undefined' || isNaN(page) || page > pagesCount) {
    page = 1;
  }
  return page
}

// export async function getPaginatedPosts(currentPage = 1) {
//   const apolloClient = initializeApollo();
//   const {posts} = await getAllPosts()
//   const postsPerPage = await getPostsPerPage()
//   const pagesCount = await getPagesCount(posts, postsPerPage)
//
//   let page = Number(currentPage);
//   if (typeof page === 'undefined' || isNaN(page) || page > pagesCount) {
//     page = 1;
//   }
//   const offset = postsPerPage * (page - 1);
//   const sortedPosts = sortStickyPosts(posts);
//   return {
//     [APOLLO_STATE_PROP_NAME]: apolloClient.cache.extract(),
//     posts: sortedPosts.slice(offset, offset + postsPerPage),
//     pagination: {
//       currentPage: page,
//       pagesCount,
//     },
//   }
// }

export function createPaginatedPosts(posts, postsPerPage, currentPage = 1){
  const pagesCount = Math.ceil(posts.length / postsPerPage);

  let page = Number(currentPage);
  if (typeof page === 'undefined' || isNaN(page) || page > pagesCount) {
    page = 1;
  }
  const offset = postsPerPage * (page - 1);
  const sortedPosts = sortStickyPosts(posts);
  return {
    posts: sortedPosts.slice(offset, offset + postsPerPage),
    pagination: {
      currentPage: page,
      pagesCount,
    },
  }
}

export async function getPostsPerPage(): Promise<number> {

  try {
    const _apolloClient = initializeApollo();
    const {data} = await _apolloClient.query({
      query: QUERY_POST_PER_PAGE,
    });
    return Number(data?.allSettings.readingSettingsPostsPerPage);
  } catch (e) {
    console.log(`Failed to query post per page data: ${e.message}`);
    throw e;
  }
}

export async function getPagesCount(posts: IPost[], postsPerPage = null):Promise<number> {
  const _postsPerPage = postsPerPage ?? (await getPostsPerPage());
  return Math.ceil(posts.length / _postsPerPage);
}

export function sortStickyPosts(posts):IPost[] {
  if(!posts){
    return []
  }
  return [...posts].sort((post) => (post.isSticky ? -1 : 1));
}

/**
 * getRecentPosts
 */

export async function getRecentPosts({ count }) {
  const { posts } = await getAllPosts();
  return {
    posts: posts.slice(0, count),
  };
}

export const getAllPostsApollo = async () => {
  const count = process.env.NEXT_GET_ALL_PAGES_COUNT;
  const apolloClient = initializeApollo()
  const data = await apolloClient.query({
    query: QUERY_ALL_POSTS,
    variables:{
      count: parseInt(count, 10)
    }
  })

  return {
    apolloClient,
    data
  }
}

export const getPaginatedPosts = async (currentPage = 1) => {
  const {apolloClient, data} = await getAllPostsApollo()
  const flattendPosts = flattenAllPosts(data?.data.posts) || []
  const postsPerPage = data?.data.allSettings.readingSettingsPostsPerPage
  const {posts, pagination} = createPaginatedPosts(flattendPosts, data?.data.allSettings.readingSettingsPostsPerPage, currentPage)

  return {
    postsPerPage,
    apolloClient,
    posts,
    pagination
  }
}


