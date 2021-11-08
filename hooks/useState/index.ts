import { useContext, createContext} from 'react'
import { IMetaData } from '../../lib/wp/site'

export interface ISiteContextState {
  recentPosts: IPost[]
  categories: any[]
  metadata: IMetaData
  menus: any
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
  menus:{}
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

