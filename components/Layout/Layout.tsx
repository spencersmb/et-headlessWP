import React, { ReactNode } from 'react'
import { BlogJsonLd, BreadcrumbJsonLd, NextSeo } from 'next-seo'
import useSite from '../../hooks/useSite'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { jsonldImageObject, jsonldPerson, jsonldWebpage, jsonldWebsite } from '../../lib/utilities/seo'
import Nav from '../nav/nav'
import Footer from '../footer/footer'
import { defaultSeoImages } from '../../lib/wp/seo'

interface IProps {
  children: ReactNode
  post?: IPost
  page?: {
    seo:{
      title: string
      opengraphModifiedTime: string
    }
  }
}
function Layout ({children, post, page}: IProps){
  const router = useRouter();
  const { asPath } = router;
  const { metadata } = useSite();

  const seoSettings:ISEOSETTINGS = {
    defaultTitle: metadata.title,
    title: metadata.title,
    description: metadata.description,
    canonical: `${metadata.domain}${asPath}`,
    openGraph: {
      type: 'website',
      title: metadata.title,
      description: metadata.description,
      images: [{...defaultSeoImages.generic}],
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
    ]
  }
  const jsonWebsiteSettings = {
    domain:metadata.domain,
    description:metadata.description,
    siteTitle:metadata.siteTitle,
  }
  const jsonImageOSettings = {
    pageUrl:metadata.domain + asPath,
    image:{
      url: defaultSeoImages.generic.url,
      altText: defaultSeoImages.generic.alt,
      width: defaultSeoImages.generic.width,
      height: defaultSeoImages.generic.height
    },
  }
  let jsonWebpageSettings: IjsonldWebpage = {
    pageUrl:metadata.domain + asPath,
    title:metadata.title,
    domain:metadata.domain,
    modifiedTime: Date.now().toString(), //TODO GET MODIFIED TIME FROM PAGE PROPS?
    description:metadata.description
  }
  const jsonPersonSettings = {
    domain:metadata.domain,
    description: metadata.description,
    avatarUrl: "https://secure.gravatar.com/avatar/64857a955396b7ae5131db1265407d77?s=96&d=mm&r=g",
  }
  const jsonBreadCrumbs = {
    itemListElements:[
      {
        position: 1,
        name: 'Home',
        item: `${metadata.domain}`,
      },
    ]
  }

  if(post){
    seoSettings.title = post.seo.title
    seoSettings.description = post.seo.metaDesc
    seoSettings.openGraph = {
      type: 'article',
      title: post.seo.title,
      description: post.seo.metaDesc,
      images: [
        {
          url: post ? post.featuredImage?.sourceUrl : defaultSeoImages.generic.url, // need default image
          width: post ? 1920 : defaultSeoImages.generic.width,
          height: post ? 928 : defaultSeoImages.generic.height,
          alt: post ? post.featuredImage?.altText : defaultSeoImages.generic.alt
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
    }
    seoSettings.additionalMetaTags = [
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
    ]

    jsonImageOSettings.image = {
      url: post.featuredImage?.sourceUrl , // need default image
      altText: post.featuredImage?.altText,
      width: 1920,
      height:928
    }

    jsonWebpageSettings = {
      ...jsonWebpageSettings,
      title: post.seo.title,
      publishTime: post.seo.opengraphPublishedTime,
      modifiedTime: post.seo.opengraphModifiedTime,
      description: post.seo.metaDesc,
    }

    jsonBreadCrumbs.itemListElements.concat([
      {
        position: 2,
        name: 'Blog',
        item: `${metadata.domain}/blog`,
      },
      {
        position: 3,
        name: `${post.title}`,
        item: `${metadata.domain}${asPath}`
      },])
  }

  if(page){
    seoSettings.title = page.seo.title
    seoSettings.openGraph = {
      ...seoSettings.openGraph,
      title: page.seo.title,
    }
    seoSettings.additionalMetaTags = [
      {
        property: 'article:modified_time',
        content: page.seo.opengraphModifiedTime
      }
    ]
  }

  return (
    <div>
      <Head>
        <link rel="profile" href="https://gmpg.org/xfn/11"/>
        <title>${seoSettings.title}</title>

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
      {post && <BlogJsonLd
        url={`${metadata.domain}${asPath}`}
        title={post.seo.title}
        images={[
          `${post.featuredImage?.sourceUrl}` // need default image
        ]}
        datePublished={post.seo.opengraphPublishedTime}
        dateModified={post.seo.opengraphModifiedTime}
        authorName={post.author.name}
        description={post.seo.metaDesc}
      />}
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
