import React, { ReactNode } from 'react'
import { BlogJsonLd, BreadcrumbJsonLd, NextSeo } from 'next-seo'
import useSite from '../../hooks/useSite'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { jsonldImageObject, jsonldPerson, jsonldWebpage, jsonldWebsite } from '../../lib/utilities/seo'
import Nav from '../nav/nav'
import Footer from '../footer/footer'

interface IProps {
  children: ReactNode
  post: IPost
}
function Layout ({children, post}: IProps){
  const router = useRouter();
  const { asPath } = router;
  const { metadata } = useSite();
  // console.log('pageSeo', post)

  const seoSettings = {
    defaultTitle: metadata.title,
    title: post.seo.title,
    description: post.seo.metaDesc,
    canonical: `${metadata.domain}${asPath}`,
    openGraph: {
      type: 'article',
      title: post.seo.title,
      description: post.seo.metaDesc,
      images: [
        // have up to 4 images...
        {
          url: post.featuredImage?.sourceUrl, // need default image
          width: 1920,
          height: 928,
          alt: post.featuredImage?.altText
        }
      ],
      article: {
        publishedTime: post.seo.opengraphPublishedTime,
        modifiedTime: post.seo.opengraphModifiedTime,
        authors: [
          `${metadata.domain}${post.author.uri}`
        ],
        tags: post.tags.map(tag => tag.name),
        // video: 'https://youtube.com',
      },
    },
    twitter:{
      cardType: 'summary_large_image',
      site: `@${metadata.social.twitter.username}`,
      handle: `@${metadata.social.twitter.username}`
    },
    additionalLinkTags: [
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        href: '/feed.xml',
      },

      // Favicon sizes and manifest generated via https://favicon.io/

      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
    additionalMetaTags:[
      {
        name: 'twitter:label1',
        content: 'Written By'
      },
      {
        name: 'twitter:data1',
        content: post.author.name
      },
      {
        name: 'twitter:label2',
        content: 'Est. reading time'
      },
      {
        name: 'twitter:data2',
        content: `${post.seo.readingTime} minutes`
      }
    ],
  }
  const jsonWebsiteSettings = {
    domain:metadata.domain,
    description:metadata.description,
    siteTitle:metadata.siteTitle,
  }
  const jsonImageOSettings = {
    pageUrl:metadata.domain + asPath,
    image:{
      url: post.featuredImage?.sourceUrl , // need default image
        altText: post.featuredImage?.altText,
        width: 1920,
        height:928
    },
  }
  const jsonWebpageSettings = {
    pageUrl:metadata.domain + asPath,
    title:post.seo.title,
    domain:metadata.domain,
    publishTime:post.seo.opengraphPublishedTime,
    modifiedTime:post.seo.opengraphModifiedTime,
    description:post.seo.metaDesc,
  }
  const jsonPersonSettings = {
    domain:metadata.domain,
    description: metadata.description,
    avatarUrl:post.author.avatar.url,
  }
  const jsonBlogSettings ={
    url:`${metadata.domain}${asPath}`,
    title:post.seo.title,
    images:[
      `${post.featuredImage?.sourceUrl}` // need default image
      ],
    datePublished:post.seo.opengraphPublishedTime,
    dateModified:post.seo.opengraphModifiedTime,
    authorName:post.author.name,
    description:post.seo.metaDesc,
  }
  const jsonBreadCrumbs = {
    itemListElements:[
      {
        position: 1,
        name: 'Home',
        item: `${metadata.domain}`,
      },
      {
        position: 2,
        name: 'Blog',
        item: `${metadata.domain}/blog`,
      },
      {
        position: 3,
        name: `${post.title}`,
        item: `${metadata.domain}${asPath}`
      },
    ]
  }

  return (
    <div>
      <Head>
        <link rel="profile" href="https://gmpg.org/xfn/11"/>
        <title>${post.title}</title>

        {jsonldWebsite(jsonWebsiteSettings)}

        {/*  JSONLD IMAGE OBJECT  */}
        {jsonldImageObject(jsonImageOSettings)}

        {/*  JSONLD WEBPAGE  */}
        {jsonldWebpage(jsonWebpageSettings)}

        {/*  JSONLD PERSON  */}
        {jsonldPerson(jsonPersonSettings)}

      </Head>
      <NextSeo
        {...seoSettings}
        robotsProps={{
          maxSnippet: -1,
          maxImagePreview: 'large',
          maxVideoPreview: -1,
        }}
      />
      <BlogJsonLd {...jsonBlogSettings} />
      <BreadcrumbJsonLd {...jsonBreadCrumbs}/>
      <Nav/>
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
