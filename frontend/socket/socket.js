// Demonstration of implementing web sockets via socket.io
// Also, provides $socket object in all components with Vue.js

import * as io from 'socket.io-client'
import applySocketHandlers from '../socket/apply-socket-handlers'
const portNumber = '5005'

export default async ({ Vue, store }) => {
  const socket = {
    socket: null,
    connected: false,
    connect () {
      if (this.socket) {
        this.socket.disconnect()
      }
      const token = store.getters.token
      const bid = store.getters.bid
      const binstance = store.getters.binstance
      if (token && bid && binstance) {
        this.socket = io(
          location.hostname +
          (location.hostname.startsWith('localhost')
            ? (':' + portNumber)
            : ''),
          { query: `token=${token}&bid=${bid}&binstance=${binstance}` }
        )
        this.socket.on('connect', () => {
          this.connected = true
        })
        this.socket.on('disconnect', () => {
          store.commit('setSocketConnectionTime', 0)
        })
        this.socket.on('socketConnectionTime', time => {
          store.commit('setSocketConnectionTime', time)
        })
        this.socket.on('message', e => console.warn('ws', e))
        applySocketHandlers(this.socket, store)
      }
    },
    disconnect () {
      if (this.socket) {
        this.socket.disconnect()
      }
      this.socket = null
      this.connected = false
    },
    send (message, payload) {
      if (this.socket) {
        this.socket.emit(message, payload)
      }
    }
  }
  Vue.prototype.$socket = socket
}
