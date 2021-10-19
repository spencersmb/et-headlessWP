import { initializeApollo } from './apollo-client'
import { QUERY_ALL_POSTS, QUERY_POST_PER_PAGE } from '../graphqlData/postsData'

/**
 * getAllPosts
 */
export async function getAllPosts():Promise<{posts: IPost[], apolloClient: any}> {
  const apolloClient = initializeApollo();
  const {data} = await apolloClient.query({
    query: QUERY_ALL_POSTS,
  });

  const posts = data?.posts?.edges.map(({ node = {} }) => node);

  return {
    posts: Array.isArray(posts) && posts.map(mapPostData),
    apolloClient
  };
}
interface IApolloGetAllPostsNode{
  node:IPostRaw
}
interface IApolloGetAllPostsResponse {
  posts: {
    edges: IApolloGetAllPostsNode[]
  }
}
export function flattenAllPosts(posts:any): IPost[] {
  const postsFiltered = posts?.edges?.map(({ node = {} }) => node);
  return Array.isArray(postsFiltered) && postsFiltered.map(mapPostData)
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

export async function getPaginatedPosts(currentPage = 1): Promise<IPaginate> {
  const { posts, apolloClient } = await getAllPosts();
  const postsPerPage = await getPostsPerPage(apolloClient);
  const pagesCount = getPagesCount(posts.length, postsPerPage);

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
    apolloClient //must pass in order to cache
  };
}

// export async function getPaginatedPostsV2(currentPage = 1) {
//   const apolloClient = initializeApollo();
//
//   await apolloClient.query({
//     query: QUERY_ALL_POSTS,
//   });
//
//   await apolloClient.query({
//     query: QUERY_POST_PER_PAGE,
//   });
//
//   return {
//     initialApolloState: apolloClient.cache.extract()
//   }
//
// }
export function getPagesCount(postsLength: number, postsPerPage: number):number {
  return Math.ceil(postsLength / postsPerPage);
}
// export async function getPagesCount(posts: IPost[], postsPerPage = null):Promise<number> {
//   const _postsPerPage = postsPerPage ?? (await getPostsPerPage());
//   return Math.ceil(posts.length / _postsPerPage);
// }

export async function getPostsPerPage(apolloClient?: any ): Promise<number> {

  try {
    const _apolloClient = apolloClient && apolloClient || initializeApollo();
    const { data } = await _apolloClient.query({
      query: QUERY_POST_PER_PAGE,
    });

    return Number(data.allSettings.readingSettingsPostsPerPage);
  } catch (e) {
    console.log(`Failed to query post per page data: ${e.message}`);
    throw e;
  }
}

export async function getPostsPerPageV2(): Promise<number> {

  try {
    const apolloClient = initializeApollo();
    const { data } = await apolloClient.query({
      query: QUERY_POST_PER_PAGE,
    });

    return Number(data.allSettings.readingSettingsPostsPerPage);
  } catch (e) {
    console.log(`Failed to query post per page data: ${e.message}`);
    throw e;
  }
}

export function sortStickyPosts(posts):IPost[] {
  return [...posts].sort((post) => (post.isSticky ? -1 : 1));
}
