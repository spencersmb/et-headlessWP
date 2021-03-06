import { initializeApollo } from '../apollo-client'
import { QUERY_SEO_DATA, QUERY_SITE_DATA } from '../../graphqlData/siteGQL'
import { getLocalJsonFile } from '../utilities/localApi'
import { metadata } from './seo'

export async function getSiteMetadata() {
  const apolloClient = initializeApollo();

  let siteData;
  let seoData;

  try {
    siteData = await apolloClient.query({
      query: QUERY_SITE_DATA,
    });
  } catch (e) {
    console.log(`[site][getSiteMetadata] Failed to query site data: ${e.message}`);
    throw e;
  }

  const { generalSettings } = siteData?.data;
  let { title, description, language } = generalSettings;

  const settings: IMetaData = {
    domain: process.env.NEXT_PUBLIC_APP_ROOT_URL,
    title,
    siteTitle: title,
    description,
    language: ''
  };

  // It looks like the value of `language` when US English is set
  // in WordPress is empty or "", meaning, we have to infer that
  // if there's no value, it's English. On the other hand, if there
  // is a code, we need to grab the 2char version of it to use ofr
  // the HTML lang attribute

  if (!language || language === '') {
    settings.language = 'en';
  } else {
    settings.language = language.split('_')[0];
  }

  // If the SEO plugin is enabled, look up the data
  // and apply it to the default settings

    try {
      seoData = await apolloClient.query({
        query: QUERY_SEO_DATA,
      });
    } catch (e) {
      console.log(`[site][getSiteMetadata] Failed to query SEO plugin: ${e.message}`);
      console.log('Is the SEO Plugin installed? If not, disable WORDPRESS_PLUGIN_SEO in next.config.js.');
      throw e;
    }

    const { webmaster, social } = seoData?.data?.seo;

    if (social) {
      settings.social = {}
      // console.log('social pre', social)


      Object.keys(social).forEach((key) => {
        const { url } = social[key];
        const keysArray = Object.keys(social[key])

        if(key === 'twitter'){
          settings.social[key] = {
            url: `https://twitter.com/${social.twitter.username}`,
            username: social.twitter.username,
            cardType: social.twitter.cardType,
          }
          return
        }

        if(key === 'pinterest'){
          settings.social[key] = url;
          return
        }

        if (!url || key === '__typename') return;

        if(keysArray.length > 2){
          settings.social[key] = {
            ...social[key]
          }
          return
        }
        settings.social[key] = url;

      });
    }

    if (webmaster) {
      settings.webmaster = {};

      Object.keys(webmaster).forEach((key) => {
        if (!webmaster[key] || key === '__typename') return;
        settings.webmaster[key] = webmaster[key];
      });
    }

  settings.title = decodeHtmlEntities(settings.title);

  return settings;
}

export function getMetadata() {

  const { generalSettings } = metadata;

  let { title, description, language } = generalSettings;

  const settings: IMetaData = {
    domain: process.env.NEXT_PUBLIC_APP_ROOT_URL,
    title,
    siteTitle: title,
    description,
    language: ''
  };

  // It looks like the value of `language` when US English is set
  // in WordPress is empty or "", meaning, we have to infer that
  // if there's no value, it's English. On the other hand, if there
  // is a code, we need to grab the 2char version of it to use ofr
  // the HTML lang attribute

  if (!language || language === '') {
    settings.language = 'en';
  } else {
    settings.language = language.split('_')[0];
  }

  const { webmaster, social } = metadata.seo;

  if (social) {
    settings.social = {}

    Object.keys(social).forEach((key) => {
      const { url } = social[key];
      const keysArray = Object.keys(social[key])

      if(key === 'twitter'){
        settings.social[key] = {
          url: `https://twitter.com/${social.twitter.username}`,
          username: social.twitter.username,
          cardType: social.twitter.cardType,
        }
        return
      }

      if(key === 'pinterest'){
        settings.social[key] = url;
        return
      }

      if (!url || key === '__typename') return;

      if(keysArray.length > 2){
        settings.social[key] = {
          ...social[key]
        }
        return
      }
      settings.social[key] = url;

    });
  }

  if (webmaster) {
    settings.webmaster = {};

    Object.keys(webmaster).forEach((key) => {
      if (!webmaster[key] || key === '__typename') return;
      settings.webmaster[key] = webmaster[key];
    });
  }

  settings.title = decodeHtmlEntities(settings.title);

  return settings;
}

export function getMenu(){
  return {
    menus: [
      {
        name: "Primary",
        slug: "primary",
        locations: [
          "PRIMARY_MENU"
        ],
        menuItems: [
          {
            childItems: {
              edges: []
            },
            id: "cG9zdDo4Njk2",
            title: null,
            cssClasses: [],
            parentId: null,
            label: "Courses",
            path: "/courses",
            target: null,
            featured: {
              courses: [
                {
                  id: "cG9zdDo4MzM5",
                  details: {
                    url: "http://learn.every-tuesday.com/3d-lettering-in-procreate"
                  }
                },
                {
                  id: "cG9zdDo4MTI2",
                  details: {
                    url: null
                  }
                },
                {
                  id: "cG9zdDo3Njk5",
                  details: {
                    url: null
                  }
                }
              ]
            }
          },
          {
            childItems: {
              edges: []
            },
            id: "cG9zdDo4NzAw",
            title: null,
            cssClasses: [],
            parentId: null,
            label: "Products",
            path: "http://google.com",
            target: "_blank",
            featured: {
              courses: null
            }
          },
          {
            childItems: {
              edges: [
                {
                  node: {
                    id: "cG9zdDo4NzAy",
                    title: null,
                    cssClasses: [],
                    parentId: "cG9zdDo4NzAx",
                    label: "About Us",
                    path: "/about-us",
                    target: null,
                    featured: {
                      courses: null
                    }
                  }
                }
              ]
            },
            id: "cG9zdDo4NzAx",
            title: null,
            cssClasses: [],
            parentId: null,
            label: "Blog",
            path: "/blog",
            target: null,
            featured: {
              courses: null
            }
          },
          {
            childItems: {
              edges: []
            },
            id: "cG9zdDo4NzAy",
            title: null,
            cssClasses: [],
            parentId: "cG9zdDo4NzAx",
            label: "About Us",
            path: "/about-us",
            target: null,
            featured: {
              courses: null
            }
          },
          {
            childItems: {
              edges: []
            },
            id: "cG9zdDo4Njk3",
            title: null,
            cssClasses: [],
            parentId: null,
            label: "Resource Library",
            path: "/resource-library",
            target: null,
            featured: {
              courses: [
                {
                  id: "cG9zdDo4MzM5",
                  details: {
                    url: "http://learn.every-tuesday.com/3d-lettering-in-procreate"
                  }
                },
                {
                  id: "cG9zdDo4MTI2",
                  details: {
                    url: null
                  }
                },
                {
                  id: "cG9zdDo3Njk5",
                  details: {
                    url: null
                  }
                }
              ]
            }
          },
        ]
      }
    ],
  }
}

export async function getStaticSiteMetadata() {

  let seoData;
  let globalData

  try {
    globalData = await getLocalJsonFile('public', 'wp-static-data.json')
  } catch (e) {
    console.log(`[site][getSiteMetadata] Failed to query site data: ${e.message}`);
    throw e;
  }

  let { title, description, language } = globalData?.generalSettings;

  const settings: IMetaData = {
    domain: process.env.NEXT_PUBLIC_APP_ROOT_URL,
    title,
    siteTitle: title,
    description,
    language: ''
  };

  // It looks like the value of `language` when US English is set
  // in WordPress is empty or "", meaning, we have to infer that
  // if there's no value, it's English. On the other hand, if there
  // is a code, we need to grab the 2char version of it to use ofr
  // the HTML lang attribute

  if (!language || language === '') {
    settings.language = 'en';
  } else {
    settings.language = language.split('_')[0];
  }

  // If the SEO plugin is enabled, look up the data
  // and apply it to the default settings

  // try {
  //   seoData = await getLocalJsonFile('public', 'wp-static-data.json')
  // } catch (e) {
  //   console.log(`[site][getSiteMetadata] Failed to query SEO plugin: ${e.message}`);
  //   console.log('Is the SEO Plugin installed? If not, disable WORDPRESS_PLUGIN_SEO in next.config.js.');
  //   throw e;
  // }

  const { webmaster, social } = globalData?.seo;

  if (social) {
    settings.social = {}
    // console.log('social pre', social)

    Object.keys(social).forEach((key) => {
      const { url } = social[key];
      const keysArray = Object.keys(social[key])

      if(key === 'twitter'){
        settings.social[key] = {
          url: `https://twitter.com/${social.twitter.username}`,
          username: social.twitter.username,
          cardType: social.twitter.cardType,
        }
        return
      }

      if(key === 'pinterest'){
        settings.social[key] = url;
        return
      }

      if (!url || key === '__typename') return;

      if(keysArray.length > 2){
        settings.social[key] = {
          ...social[key]
        }
        return
      }
      settings.social[key] = url;

    });
  }

  if (webmaster) {
    settings.webmaster = {};

    Object.keys(webmaster).forEach((key) => {
      if (!webmaster[key] || key === '__typename') return;
      settings.webmaster[key] = webmaster[key];
    });
  }

  settings.title = decodeHtmlEntities(settings.title);

  return settings;
}

/**
 * decodeHtmlEntities
 */

export function decodeHtmlEntities(text) {
  if (typeof text !== 'string') {
    throw new Error(`Failed to decode HTML entity: invalid type ${typeof text}`);
  }

  let decoded = text;

  const entities = {
    '&amp;': '\u0026',
    '&quot;': '\u0022',
    '&#039;': '\u0027',
  };

  return decoded.replace(/&amp;|&quot;|&#039;/g, (char) => entities[char]);
}
