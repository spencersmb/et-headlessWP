import _ from 'lodash'
import { IMetaData } from './site'

export interface IOGType {
  property: string,
  content: string,
}
interface IFacebookOptions {
  path?: string
}

export const metadata = {
  generalSettings: {
    description: "Graphic Design Tips, Tricks, Tutorials and Freebies",
    language: "",
    title: "Every-Tuesday"
  },
  seo: {
    webmaster: {
      yandexVerify: "",
      msVerify: "",
      googleVerify: "",
      baiduVerify: ""
    },
    social: {
      youTube: {
        url: "http://youtube.com/everytues"
      },
      wikipedia: {
        url: ""
      },
      twitter: {
        username: "teelacunningham",
        cardType: "summary"
      },
      pinterest: {
        metaTag: "",
        url: "http://pinterest.com/teelac"
      },
      mySpace: {
        url: ""
      },
      linkedIn: {
        url: ""
      },
      instagram: {
        url: "http://instagram.com/everytuesday"
      },
      facebook: {
        url: "http://facebook.com/everytues",
        defaultImage: {
          altText: "Every-Tuesday Logo Black",
          sourceUrl: "http://etheadless.local/wp-content/uploads/2013/09/et-logo-black.png",
          mediaDetails: {
            "height": 143,
            "width": 510
          }
        }
      }
    }
  },
}

export const defaultSeoImages = {
  generic: {
    url: '',
    alt: '',
    width: 123,
    height: 123
  }
}
