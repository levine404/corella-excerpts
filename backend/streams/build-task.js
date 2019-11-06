// Demonstrates elegantly converting a very complicated task into
// smaller manageable processes

// Demonstrates a solution to potentially process large files
// which could very well overload the server's memory by handling every process
// and sub process via streams

// Demonstrates an emphasis of code reusabiliy (see build-doc-xml.js)

// Imports
const DocSaxTransformStream = require('../custom-streams/doc-sax-transform-stream')
const CollectPsTransformStream = require('../custom-streams/collect-ps-transform-stream')
const PsToPackagesTransformStream = require('../custom-streams/ps-to-packages-transform-stream')
const SavePackagesReadStream = require('../custom-streams/save-packages-read-stream')

// Function to build task data from a read stream (Word document)
const buildTask = (task, readStream) => {
  return new Promise((resolve, reject) => {

    // Create custom doc sax stream (a hacked version of a 3rd party package)
    // Custom transform stream also reused in build-doc-xml.js
    const docSaxTransformStream = new DocSaxTransformStream()

    // Create stream to collect relevant paragraphs with runs (including text and style data)
    const collectPsTransformStream = new CollectPsTransformStream()

    // Create stream to convert paragraphs to (manageable) packages (including task header navigation data)
    const psToPackagesTransformStream = new PsToPackagesTransformStream(task)

    // Create stream to manage the saving packages (on remote servers via AWS)
    const savePackagesReadStream = new SavePackagesReadStream(task._id)

    // Where the magic starts to happen...
    readStream
      .pipe(docSaxTransformStream)
      .pipe(collectPsTransformStream)
      .pipe(psToPackagesTransformStream)
      .pipe(savePackagesReadStream)
      .on('finish', () => resolve(task))
      .on('error', reject)
  })
}

module.exports = buildTask
