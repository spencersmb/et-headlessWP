interface IMetaTagName {
  name: string
  content: string
}

interface IMetaTagProperty {
  property: string
  content: string
}

type IMeta = IMetaTagName | IMetaTagProperty

interface ISEOSETTINGS {
  defaultTitle: string,
  title: string
  description: string
  canonical: string
  openGraph: {
    type: string,
    title: string
    description: string
    images: any[],
    article?:{
      publishedTime?: string
      modifiedTime?: string
      authors?: any[]
      tags?: any[]
      video?: string
    }
  },
  twitter:{
    cardType: string
    site: string
    handle: string
  },
  additionalLinkTags?: any[],
  additionalMetaTags?: IMeta[],
}

interface IjsonldWebpage {
  pageUrl: string
  title: string
  domain: string
  publishTime?: string
  modifiedTime: string
  description: string
}
