interface ICategories {
  databaseId: number
  id: string
  name: string
  slug: string
}

interface ICategoryRaw {
  node: ICategories
}

interface IFeaturedImage {
  altText: string
  caption: string
  id: string
  sizes: string
  sourceUrl: string
  srcSet: null | any[]
}

interface IFeaturedImageRaw {
  node: IFeaturedImage
}

interface IPostRaw {
  author: {
    node: {
      avatar: {
        height: number
        url: string
        width: number
      }
      id: string
      name: string,
      slug: string
    }
  }
  categories: {
    edges: ICategoryRaw[]
  }
  featuredImage: IFeaturedImageRaw
}

interface IPost {
  author?: {
    avatar: {
      height: number
      url: string
      width: number
    }
    id: string
    name: string,
    slug: string
  }
  categories?: ICategories[]
  featuredImage: IFeaturedImage
  title: string
  slug: string
  id: string
}

interface IPaginate {
  apolloClient,
  posts: IPost[]
  pagination:{
    currentPage: number
    pagesCount: number
  }
}

