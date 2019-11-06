// Demonstrates the usage of 3rd party software and adapting it
// to fit my own needs.  This 3rd party software acted like a typical
// stream in some ways, but as it handles processing of data via events.
// This posed a difficulty in piping processes together, so I prevented
// the typical writes and pushed out my own

// Imports
const { createStream } = require('sax')

// Options expected by the sax package
const saxOptions = {
  trim: false,
  position: false,
  xmlns: true
}

// Function to create a stream which wraps around a stream provided
// by the sax package,  the processes a word document into root items
// which are later processed by other transform/write streams
const DocSaxStream = function () {
  // Create need objects for this method
  this.currentRootItem = null
  this.currentChild = []

  // Create function to handle processing
  const getCurrentNode = () => {
    if (this.currentRootItem) {
      let currentNode = this.currentRootItem
      this.currentChild.forEach(nodeIndex => {
        currentNode = currentNode.children[nodeIndex]
      })
      return currentNode
    }
  }

  const handleOpenTag = function (node) {
    switch (node.name) {
      case 'w:document':
      case 'w:body':
        this.saxStream.writeObj({
          ...node,
          start: true
        })
        break

      default:
        if (!this.currentRootItem) {
          this.currentRootItem = {
            ...node,
            children: []
          }
          this.currentChild = []
        } else {
          if (!this.currentChild.length) {
            this.currentRootItem.children.push({
              ...node,
              children: []
            })
            this.currentChild = [this.currentRootItem.children.length - 1]
          } else {
            let currentNode = getCurrentNode()
            currentNode.children.push({
              ...node,
              children: []
            })
            this.currentChild.push(currentNode.children.length - 1)
          }
        }
    }
  }

  const handleCloseTag = function (nodeName) {
    switch (nodeName) {
      case 'w:documemt':
        break
      case 'w:body':
        this.saxStream.writeObj({
          name: nodeName,
          end: true
        })
        break

      default:
        if (this.currentRootItem) {
          if (nodeName === this.currentRootItem.name && !this.currentChild.length) {
            this.saxStream.writeObj(this.currentRootItem)
            this.currentRootItem = null
            this.currentChild = []
          } else {
            if (this.currentChild.length) {
              this.currentChild.pop()
            }
          }
        }
    }
  }

  const handleText = function (text) {
    if (this.currentRootItem) {
      let currentNode = getCurrentNode()
      currentNode.children.push(text)
    }
  }

  const handleEnd = function () {
    this.saxStream.writeObj({
      name: 'w:document',
      end: true
    })
  }

  const handleError = function (err) {
    console.error(err)
  }

  // Create typical sax stream
  this.saxStream = createStream(true, saxOptions)

  // Hijack write method for SAXStream writer
  this.saxStream.write = function (data) {
    // Original
    if (typeof Buffer === 'function' &&
      typeof Buffer.isBuffer === 'function' &&
      Buffer.isBuffer(data)) {
      if (!this._decoder) {
        var SD = require('string_decoder').StringDecoder
        this._decoder = new SD('utf8')
      }
      data = this._decoder.write(data)
    }
    this._parser.write(data.toString())

    // Prevent the emitting data, instead defer to writeObj method
    // this.emit('data', data) - original
    return true
  }

  // Create new function to emit own object data
  this.saxStream.writeObj = function (data) {
    // A different context for 'this', referring to the saxStream object
    this.emit('data', data)
  }

  // Attach handlers
  this.saxStream.on('opentag', handleOpenTag.bind(this))
  this.saxStream.on('closetag', handleCloseTag.bind(this))
  this.saxStream.on('error', handleError.bind(this))
  this.saxStream.on('text', handleText.bind(this))
  this.saxStream.on('end', handleEnd.bind(this))

  return this.saxStream
}

module.exports = DocSaxStream
