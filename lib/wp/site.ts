/**
 * getSiteMetadata
 */
import { initializeApollo } from '../apollo-client'
import { QUERY_SEO_DATA, QUERY_SITE_DATA } from '../../graphqlData/siteGQL'
import { getLocalJsonFile } from '../utilities/localApi'

export interface ISocialTwitter {
  username: string
  cardType: string
  url: string
}
export interface ISocialFacebook {
  url: string
  defaultImage: {
    altText: string
    mediaDetails: {
      height: number
      width: number
    }
    sourceUrl: string
  }
}

type ISocialSettings = {
  twitter?: ISocialTwitter
  facebook?: ISocialFacebook
  pinterest?: string
  instagram?: string
  youtube?: string
}

export interface IMetaData {
  title: string
  domain: string
  siteTitle: string
  description: string
  language: string
  social?: ISocialSettings
  webmaster?: any
}
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
