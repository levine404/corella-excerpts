// Demonstrates usage of implementing web workers to
// attempt to divide complex proceses into a different thread
// to minimize blocking, also demonstrates usage of IndexedDB

// Imports
import registerPromiseWorker from 'promise-worker/register'
import Dexie from 'dexie'
import idbConfig from './idb-config'
import axios from 'axios'
import config from '../config/axios.config'

// Web worker message handlers
import test from './message-handler-methods/test'
import setToken from './message-handler-methods/set-token'
import getUserData from './message-handler-methods/get-user-data'
import saveSingleItem from './message-handler-methods/save-single-item'
import preDeleteSingleItem from './message-handler-methods/pre-delete-single-item'
import deleteSingleItem from './message-handler-methods/delete-single-item'
import postDeleteSingleItem from './message-handler-methods/post-delete-single-item'
import getPackagedData from './message-handler-methods/get-packaged-data'
import getTranslation from './message-handler-methods/get-translation'
import getTerms from './message-handler-methods/get-terms'
import getTerm from './message-handler-methods/get-term'
import getSuggestions from './message-handler-methods/get-suggestions'
import getUser from './message-handler-methods/get-user'
import syncDown from './message-handler-methods/sync-down'
import syncUp from './message-handler-methods/sync-up'
import install from './message-handler-methods/install'

const messageHandler = {
  test,
  setToken,
  getUserData,
  saveSingleItem,
  preDeleteSingleItem,
  deleteSingleItem,
  postDeleteSingleItem,
  getPackagedData,
  getTranslation,
  getTerms,
  getTerm,
  getSuggestions,
  getUser,
  syncDown,
  syncUp,
  install
}

// Manage IndexedDB via Dexie
const idb = new Dexie('idb')
idb
  .version(idbConfig.version)
  .stores(idbConfig.stores)
idb.open().catch((err) => {
  console.error('Opening local db failed:', err)
})

let token = null
const api = axios.create(config)

export default function worker (self) {
  self.idb = idb
  self.token = token
  self.api = api
  self.api.interceptors.request.use((reqConfig) => {
    reqConfig.headers.token = self.token
    return reqConfig
  })

  registerPromiseWorker(async (message) => {
    try {
      if (!message || !message.call || !messageHandler.hasOwnProperty(message.call)) {
        console.error('Invalid call! ' + message.call)
        throw new Error('Invalid call! ' + message.call)
      }
      return messageHandler[message.call].call(self, message.payload)
    } catch (err) {
      return null
    }
  })
}
