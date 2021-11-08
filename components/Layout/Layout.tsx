import React, { ReactNode } from 'react'
import { BlogJsonLd, BreadcrumbJsonLd, NextSeo } from 'next-seo'
import useSite from '../../hooks/useState'
import { useRouter } from 'next/router'
import parse from 'html-react-parser'
import Head from 'next/head'

interface IProps {
  children: ReactNode
  post: IPost
}
function Layout ({children, post}: IProps){
  const router = useRouter();
  const { asPath } = router;
  const { metadata } = useSite();
  console.log('metadata', metadata)
  console.log('pageSeo', post)
  const yeostSeo = parse(post.seo.fullHead)
  console.log('yeostSeo', yeostSeo)
  const text = {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'WebSite',
      '@id': 'https://etheadless.local/#website',
      'url': 'https://etheadless.local/',
      'name': 'Every-Tuesday',
      'description': 'Graphic Design Tips, Tricks, Tutorials and Freebies',
      'potentialAction': [{
        '@type': 'SearchAction',
        'target': {'@type': 'EntryPoint', 'urlTemplate': 'https://etheadless.local/?s={search_term_string}'},
        'query-input': 'required name=search_term_string'
      }],
      'inLanguage': 'en-US'
    }, {
      '@type': 'ImageObject',
      '@id': 'https://etheadless.local/freebie-march-2019-desktop-wallpapers#primaryimage',
      'inLanguage': 'en-US',
      'url': 'https://res.cloudinary.com/every-tuesday/images/f_auto,q_auto/v1633831042/posts_2019/March/freebie-March-2019-desktop-wallpapers/freebie-March-2019-desktop-wallpapers.jpg?_i=AA',
      'contentUrl': 'https://res.cloudinary.com/every-tuesday/images/f_auto,q_auto/v1633831042/posts_2019/March/freebie-March-2019-desktop-wallpapers/freebie-March-2019-desktop-wallpapers.jpg?_i=AA',
      'width': 1920,
      'height': 928,
      'caption': 'freebie-March-2019-desktop-wallpapers'
    },
      ,

    ]
  }

  const seoSettings = {
    defaultTitle: metadata.title,
    title: post.seo.title,
    description: metadata.description,
    canonical: `${metadata.domain}${asPath}`,
    openGraph: {
      type: 'article',
      title: post.seo.title,
      description: 'Open Graph Spencer Description',
      images: [
        // have up to 4 images...
        {
          url: post.featuredImage.sourceUrl,
          width: 1920,
          height: 928,
          alt: post.featuredImage.altText
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
    additionalMetaTags:[],
    link: [
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
        href: '/site.webmanifest',
      },
    ],
  }
  return (
    <div>
      <Head>
        <title>Spencer</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/*  JSONLD PERSON  */}
        <script type="application/ld+json">
          {`{
      "@type": "WebPage",
      "@id": "${metadata.domain}${post.slug}#webpage",
      "url": "${metadata.domain}${post.slug}",
      "name": "${post.seo.title}",
      "isPartOf": {"@id": "${metadata.domain}#website"},
      "primaryImageOfPage": {"@id": "https://etheadless.local/freebie-march-2019-desktop-wallpapers#primaryimage"},
      "datePublished": "2019-02-28T13:00:40+00:00",
      "dateModified": "2021-11-07T22:32:12+00:00",
      "author": {"@id": "https://etheadless.local/#/schema/person/335aa8508f8baa38bcaf8be0a46d6ecb"},
      "description": "It\\"s the end of February! That means it\\"s time for your free March 2019 desktop wallpapers (in two sizes, with and without dates)!",
      "breadcrumb": {"@id": "https://etheadless.local/freebie-march-2019-desktop-wallpapers#breadcrumb"},
      "inLanguage": "en-US",
      "potentialAction": [{
        "@type": "ReadAction",
        "target": ["https://etheadless.local/freebie-march-2019-desktop-wallpapers"]
      }]
    }`}
          {`{
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "https://etheadless.local/#/schema/person/335aa8508f8baa38bcaf8be0a46d6ecb",
            "name": "Teela",
            "image": {
            "@type": "ImageObject",
            "@id": "${metadata.domain}/#personlogo",
            "inLanguage": "en-US",
            "url": "${post.author.avatar.url}",
            "contentUrl": "${post.author.avatar.url}",
            "caption": "Teela"
          },
            "description": "${metadata.description}"
          }`}
        </script>

      </Head>
      <NextSeo
        {...seoSettings}
      />
      <BlogJsonLd
        url={`${metadata.domain}${asPath}`}
        title={post.seo.title}
        images={[
          `${post.featuredImage.sourceUrl}`
        ]}
        datePublished={post.seo.opengraphPublishedTime}
        dateModified={post.seo.opengraphModifiedTime}
        authorName={post.author.name}
        description={post.seo.metaDesc}
      />
      <BreadcrumbJsonLd
        itemListElements={[
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
            name: `${post.author.name}`,
            item: `${metadata.domain}${post.author.uri}`
          },
        ]}
      />
      {/*<Helmet />*/}
      {/*<Helmet {...helmetSettings} />*/}
      <nav>Navigation</nav>
      <main>
        {children}
      </main>
      <footer>
        Create footer
      </footer>
    </div>
  )
}

export default Layout
