// Demonstrates typical state management actions (async, non-mutating)

export function unregisterUser ({ commit }) {
  this._vm.$socket.disconnect()
  commit('registerUser', {
    userId: null,
    userType: null,
    displayName: null,
    token: null,
    profileImg: null
  })
  commit('resetData')
  this._vm.$q.localStorage.remove('user')
}

export function registerUser ({ commit }, payload) {
  commit('registerUser', payload)
  this._vm.$socket.connect()
  this._vm.$q.localStorage.set('user', payload)
}

export function loadUser ({ dispatch }) {
  const user = this._vm.$q.localStorage.getItem('user')
  if (user) {
    dispatch('registerUser', user)
  }
}
