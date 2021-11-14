/**
 * getAllMenus
 */
import { initializeApollo } from '../apollo-client'
import { QUERY_ALL_MENUS } from '../../graphqlData/menuGQL'
import { getLocalJsonFile } from '../utilities/localApi'

export const MENU_LOCATION_NAVIGATION_DEFAULT = 'DEFAULT_NAVIGATION';
export async function getAllMenus() {

  const apolloClient = initializeApollo();

  const data = await apolloClient.query({
    query: QUERY_ALL_MENUS,
  });

  const menus = data?.data.menus.edges.map(mapMenuData);

  return {
    menus,
  };
}


export async function getStaticMenus() {

  const {menus}: any = await getLocalJsonFile('public', 'wp-static-data.json')

  return {
    menus
  };
}



/**
 * mapMenuData
 */
interface IMenuItem{
  id: string
  label: string
}
interface IRawMenus {
  node:{
    id: string
    menuItems: {
      edges: {node: IMenuItem}[]
    }
  }
}

export function mapMenuData(menu:IRawMenus) {

  const { node } = menu;
  const data: any = { ...node };

  data.menuItems = data.menuItems.edges.map(({ node }) => {
    return { ...node };
  });

  return data;
}

/**
 * createMenuFromPages
 */

export function createMenuFromPages({ locations, pages }) {
  return {
    menuItems: mapPagesToMenuItems(pages),
    locations,
  };
}


/**
 * mapPagesToMenuItems
 */

export function mapPagesToMenuItems(pages) {
  return pages.map(({ id, uri, title }) => {
    return {
      label: title,
      path: uri,
      id,
    };
  });
}
