/**
 * getCategories
 */
import { initializeApollo } from '../apollo-client'
import { QUERY_ALL_CATEGORIES } from '../graphql/queries/categories'

export async function getCategories({ count }: {count: number} = {count: 1}) {
  const { categories } = await getAllCategories();
  return {
    categories: categories.slice(0, count),
  };
}

/**
 * getAllCategories
 */

export async function getAllCategories() {
  const apolloClient = initializeApollo();

  const data = await apolloClient.query({
    query: QUERY_ALL_CATEGORIES,
  });

  const categories = data?.data.categories.edges.map(({ node = {} }) => node);

  return {
    categories,
  };
}

