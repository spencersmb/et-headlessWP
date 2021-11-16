import path from 'path'
import fs from 'fs/promises'
import { initializeApollo } from '../apollo-client'
import { flattenAllPosts, flattenPost, mapPostData } from '../wp/posts'
import { QUERY_ALL_POSTS, QUERY_PAGE_BY_ID, QUERY_POST_BY_SLUG } from '../../graphqlData/postsData'

export async function getStaticFile({fileName, dir}){
  let result: any = {}
  let foundFile = false
  const postsDirectory = path.join(process.cwd(), dir)
  const filenames = await fs.readdir(postsDirectory)
  const dataJsonfile = filenames.find(file => file === fileName)
  if(dataJsonfile) {
    try {
      foundFile = true
      const filePath = path.join(postsDirectory, dataJsonfile)
      const jsonData: any = await fs.readFile(filePath, 'utf8')
      result = await JSON.parse(jsonData)
    }catch (e){

    }
  }

  return {
    result,
    foundFile
  }
}

export async function getSingleStaticPost(pageParams){
  const apolloClient = initializeApollo()
  let post = {}
  let data: any = {}
  let foundStaticFile = false
  const slug = pageParams.slug
  const {result, foundFile} = await getStaticFile({
    fileName: 'wp-static-data.json',
    dir: 'public'
  })

  if(foundFile && typeof result.posts[slug] === "object") {
    foundStaticFile = true
    post = mapPostData(result.posts[slug])
  }else {
    data = await apolloClient.query({
      query: QUERY_POST_BY_SLUG,
      variables: {
        slug
      },
    })
    post = flattenPost(data?.data?.postBy)
  }

  return {
    post,
    apolloClient,
    foundStaticFile
  }
}

export async function getAllStaticPaths(){
  const apolloClient = initializeApollo()
  let posts = []
  let data: any = {}
  const {result, foundFile} = await getStaticFile({
    fileName: 'wp-search.json',
    dir: 'public'
  })

  if(foundFile && Array.isArray(result.posts)) {
    posts = result.posts.map(post => mapPostData(post))
  }else {
    data = await apolloClient.query({
      query: QUERY_ALL_POSTS,
      variables: {
        count: parseInt(process.env.NEXT_GET_ALL_PAGES_COUNT)
      },
    })
    posts = flattenAllPosts(data?.data.posts) || []
  }

  return {
    posts,
    apolloClient,
  }
}

export async function getAllStaticPosts(){
  const apolloClient = initializeApollo()
  let posts = []
  let data: any = {}
  const {result, foundFile} = await getStaticFile({
    fileName: 'wp-static-data.json',
    dir: 'public'
  })

  if(foundFile && Array.isArray(result.posts)) {
    posts = result.posts.map(post => mapPostData(post))
  }else {
    data = await apolloClient.query({
      query: QUERY_ALL_POSTS,
      variables: {
        count: parseInt(process.env.NEXT_GET_ALL_PAGES_COUNT)
      },
    })
    posts = flattenAllPosts(data?.data.posts) || []
  }

  return {
    posts,
    apolloClient,
  }
}

export async function getSingleStaticPage({pageSlug, pageID}){
  const apolloClient = initializeApollo()
  let page = {}
  let data: any = {}
  let foundStaticFile = false
  const {result, foundFile} = await getStaticFile({
    fileName: 'wp-static-data.json',
    dir: 'public'
  })

  if(foundFile && result.pages && typeof result.pages[pageSlug] === "object") {
    foundStaticFile = true
    page = mapPostData(result.pages[pageSlug])
  }else {
    data = await apolloClient.query({
      query: QUERY_PAGE_BY_ID,
      variables: {
        pageID
      },
    })
    page = flattenPost(data?.data?.pageBy)
  }

  return {
    page,
    apolloClient,
    foundStaticFile
  }
}
