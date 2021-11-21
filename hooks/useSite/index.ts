import { useContext, createContext} from 'react'

export interface IMenu{
  menuItems: IMenuItem[]
  name: string
  slug: string
}

interface IMenuCourse {
  details: {
    url: string
    name: string
  }
}

export interface IMenuItem {
  featured:{
    courses: IMenuCourse[]
  }
  childItems: {
    edges: {node: IMenuItem}[]
  }
  id: string
  label: string
  path: string
  target: string
  title: string
  parentId: string | null
}

export interface ISiteContextState {
  recentPosts: IPost[]
  categories: any[]
  metadata: IMetaData
  menus: IMenu[]
}
export const siteInitialState: ISiteContextState  = {
  recentPosts: [],
  categories:[],
  metadata: {
    domain: '',
    description: '',
    language: '',
    siteTitle: '',
    social: {},
    title: '',
  },
  menus:[]
}
export const SiteContext = createContext<ISiteContextState>(siteInitialState)
SiteContext.displayName = 'SiteContext'

/**
 * useSite
 */

export default function useSite() {
  const site = useContext(SiteContext);
  return site;
}

