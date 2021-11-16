import React from 'react'

interface IjsonldWebProps {
  domain: string
  description: string
  siteTitle: string
}
export function jsonldWebsite (data: IjsonldWebProps) {
  const {domain, description, siteTitle} = data
  return (
      <script type="application/ld+json">
        {`{
            '@context': 'https://schema.org',
            '@graph': [{
              '@type': 'WebSite',
              '@id': '${domain}/#website',
              'url': '${domain}',
              'name': '${siteTitle}',
              'description': ${description},
              'potentialAction': [{
                '@type': 'SearchAction',
                'target': {
                  '@type': 'EntryPoint', 
                  'urlTemplate': '${domain}/?s={search_term_string}'
                  },
                'query-input': 'required name=search_term_string'
              }],
              'inLanguage': 'en-US'
            }`}
    </script>
  )
}

interface IjsonldImageProps {
  pageUrl: string
  image: {
    url: string
    width: number
    height: number
    altText: string
  }
}

export function jsonldImageObject (data: IjsonldImageProps) {
  const {pageUrl, image} = data
  return (
    <script type="application/ld+json">
      {`      
        '@type': 'ImageObject',
        '@id': '${pageUrl}#primaryimage',
        'inLanguage': 'en-US',
        'url': '${image.url}',
        'contentUrl': '${image.url}',
        'width': 1920,
        'height': 928,
        'caption': '${image.altText}'
      }`}
    </script>
  )
}

export function jsonldWebpage (props: IjsonldWebpage) {
  const {pageUrl, title, domain, publishTime, modifiedTime, description} = props
  return (
    <script type="application/ld+json">
      {`{
        "@type": "WebPage",
        "@id": "${pageUrl}#webpage",
        "url": "${pageUrl}",
        "name": "${title}",
        "isPartOf": {"@id": "${domain}#website"},
        "primaryImageOfPage": {"@id": "${pageUrl}#primaryimage"},
        "datePublished": "${publishTime}",
        "dateModified": "${modifiedTime}",
        "author": {"@id": "${domain}/#/schema/person/335aa8508f8baa38bcaf8be0a46d6ecb"},
        "description": "${description}",
        "breadcrumb": {"@id": "${pageUrl}#breadcrumb"},
        "inLanguage": "en-US",
        "potentialAction": [{
          "@type": "ReadAction",
          "target": ["${pageUrl}"]
        }]
      }`}
    </script>
  )
}

interface IjsonldPersonProps {
  domain: string
  description: string
  avatarUrl: string
}

export function jsonldPerson (props: IjsonldPersonProps) {
  const {avatarUrl, domain, description} = props
  return (
    <script type="application/ld+json">
      {`{
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": "${domain}/#/schema/person/335aa8508f8baa38bcaf8be0a46d6ecb",
          "name": "Teela",
          "image": {
          "@type": "ImageObject",
          "@id": "${domain}/#personlogo",
          "inLanguage": "en-US",
          "url": "${avatarUrl}",
          "contentUrl": "${avatarUrl}",
          "caption": "Teela"
        },
        "description": "${description}"
      }`}
    </script>
  )
}
