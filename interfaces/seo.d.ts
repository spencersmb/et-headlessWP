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
  additionalMetaTags?: any[],
}

interface IjsonldWebpage {
  pageUrl: string
  title: string
  domain: string
  publishTime?: string
  modifiedTime: string
  description: string
}
