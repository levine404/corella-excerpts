// Demonstrates strategy to miminize database calls by caching frequently manipulated
// data into local cache

// Mongoose models (MongoDB)
const Task = require('../models/task.model')
const TermCollection = require('../models/termcollection.model')
const Translation = require('../models/translation.model')
const Term = require('../models/term.model')

// Cache
const cache = require('./cache')
const { cacheExpiryTime } = require('../config/app.config')

// Function to free cache (called via setInterval)
const freeCache = () => {
  const N = Date.now()
  const expires = N - cacheExpiryTime
  for (const modelType in cache) {
    let model
    switch (modelType) {
      case 'task':
        model = Task
        break
      case 'termCollection':
        model = TermCollection
        break
      case 'translation':
        model = Translation
        break
      case 'term':
        model = Term
        break
      default:
    }
    if (model) {
      for (const itemKey in cache[modelType]) {
        const item = cache[modelType][itemKey]
        if (item.time <= expires) {
          if (item.touched) {
            const query = {
              _id: item.doc._id
            }
            const queryData = {
              ...item.doc, st: N
            }
            const queryOptions = {
              upsert: true
            }
            model
              .findOneAndUpdate(query, queryData, queryOptions)
              .catch(err => {
                console.error(err)
              })
              .finally(() => {
                delete cache[modelType][itemKey]
              })
          } else {
            delete cache[modelType][itemKey]
          }
        }
      }
    }
  }
}

module.exports = freeCache
