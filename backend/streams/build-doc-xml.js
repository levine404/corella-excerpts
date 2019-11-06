// Demonstrates elegantly converting a very complicated task into
// smaller manageable processes

// Demonstrates a solution to potentially process large files
// which could very well overload the server's memory by handling every process
// and sub process via streams

// Demonstrates an emphasis of code reusabiliy (see build-task.js)

// Imports
const { createWriteStream } = require('fs')
const DocSaxTransformStream = require('../custom-streams/doc-sax-transform-stream')
const BuildDocItemsTransformStream = require('../custom-streams/build-doc-items-transform-stream')
const DocItemsToStringStream = require('../custom-streams/doc-items-to-string-stream')

// Function to merge original uploaded word document with provided
// translation data from the database; returns xml in word document format
const buildDocXml = (readStream, taskId, writePath) => {
  return new Promise((resolve, reject) => {
    
    /// Create custom doc sax stream (a hacked version of a 3rd party package)
    // Custom transform stream also reused in build-task.js
    const docSaxTransformStream = new DocSaxTransformStream()

    // Create a stream to build the doc items based on document xml;
    // Combines translation data from database with contents of
    // file originally provided by user
    const buildDocItemsTransformStream = new BuildDocItemsTransformStream(taskId)
    
    // Create a stream to convert doc items to string
    // Coverts data into string data that can be written to file
    const docItemsToStringStream = new DocItemsToStringStream()

    // Create write stream to create new file to write strings
    // (Will then be processed/zipped and sent to requester)
    const writeStream = createWriteStream(writePath)
    
    // Where the magic starts to happen...
    readStream
      .pipe(docSaxTransformStream)
      .pipe(buildDocItemsTransformStream)
      .pipe(docItemsToStringStream)
      .pipe(writeStream)
      .on('finish', resolve)
      .on('error', reject)
  })
}

module.exports = buildDocXml
