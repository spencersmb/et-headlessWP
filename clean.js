
const fs = require('fs');
const path = require('path')

function clearStaticJson(){
  const files = [
    './public/wp-search.json',
    './public/wp-static-data.json',
    './public/feed.xml',
    './public/robots.txt',
    './public/sitemap.xml',
  ]

  files.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log('deleting file: ', file )
      fs.unlinkSync(file)
    }
  })
}

console.log('deleting static json files')
clearStaticJson()
console.log('files deleted')
