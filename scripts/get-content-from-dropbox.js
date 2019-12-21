require('dotenv').load()
require('isomorphic-fetch')
const path = require('path')
const fs = require('fs-extra')
const Dropbox = require('dropbox').Dropbox
const extract = require('extract-zip')

// Setup our interface for the Dropbox API with our token
// If there's no token, we'll just go ahead and exit this script now.
if (!process.env.DBX_ACCESS_TOKEN) {
  console.log(
    "Error: could not find a Dropbox access token. Make sure you have a `.env` file with a `DBX_ACCESS_TOKEN` key/value pair for accessing the Dropbox API."
  )
  process.exit(1)
}
const dbx = new Dropbox({
  accessToken: process.env.DBX_ACCESS_TOKEN,
  fetch
})

const pathsMap = {
  'Pages': path.resolve(__dirname, '../src/pages'),
  'Drafts': path.resolve(__dirname, '../src/_drafts'),
  'Posts': path.resolve(__dirname, '../src/_posts'),
  'Images': path.resolve(__dirname, '../src/assets/images')
}

// Clean anything up that exists already, since we'll re-build
Object.values(pathsMap).forEach(folder => fs.removeSync(folder))

// Get all the posts in the root of our our Dropbox App's directory and save
// them all to our local posts folder.
dbx.filesListFolder({ path: '' }).then(response => Promise.all(
  response.entries
    .filter(entry => entry['.tag'] === 'folder' && entry.name in pathsMap)
    .map(entry => {
      const { name, path_lower } = entry
      const zipDest = path.join(pathsMap[name], '..')
      const zipFileName = path.join(zipDest, name+'.zip')
      
      return dbx.filesDownloadZip({ path: path_lower })
      .then(data => fs.outputFile(zipFileName, data.fileBinary))
      .then(() => new Promise((resolve, reject) => {
        extract(zipFileName, {dir: zipDest}, error => {
          fs.removeSync(zipFileName) // delete anyway
          if (error) throw error
          else resolve()
        })
      }))
      .then(() => {
        // Dropbox sometimes gives two folders with different cases,
        // so pick the one with things in it...
        const firstLetter = name.charAt(0).toLowerCase(),
          end = name.slice(1)
        return [firstLetter+end, firstLetter.toUpperCase()+end]
          .map(dirName => path.join(zipDest, dirName))
          .reduce((correctDir, potentialDir) => {
            if (correctDir == null) {
              return potentialDir // default to thinking this is right
            } else if ( // check if this dir contains files
              fs.readdirSync(potentialDir, { withFileTypes: true })
              .some(dirent => dirent.isFile() || dirent.isDirectory())
            ) {
              return potentialDir
            } else {
              fs.removeSync(potentialDir)
              return correctDir
            }
          }, null)
      })
      .then(correctDir => new Promise((resolve, reject) => {
        fs.rename(correctDir, pathsMap[name], error => {
          if (error) reject(error)
          else resolve()
        })
      }))
    })
))
.catch(error => {
  console.log(error)
})