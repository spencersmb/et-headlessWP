import _ from 'lodash'
import { IMetaData } from './site'

export interface IOGType {
  property: string,
  content: string,
}
interface IFacebookOptions {
  path?: string
}
export function defaultFacebookSeo(siteMetadata: IMetaData, options: IFacebookOptions, addedTags: IOGType[]){
  const meta = [

    {
      property: 'og:site_name',
      content: siteMetadata.siteTitle
    }
  ]

  if(addedTags){
      return _.unionBy(addedTags, meta, 'property')
  }
  return meta
}
