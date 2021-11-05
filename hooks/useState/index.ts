import { useContext, createContext} from 'react'

export interface ISiteContextState {
  recentPosts: IPost[]
  categories: any[]
  metadata: any
  menus: any
}
export const siteInitialState: ISiteContextState  = {
  recentPosts: [],
  categories:[],
  metadata: {},
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

