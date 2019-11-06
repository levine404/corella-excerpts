// Typical auth mutations for state

import { isString } from 'lodash'

export function registerUser (state, payload) {
  const userData = isString(payload)
    ? JSON.parse(payload)
    : payload
  state.displayName = userData.displayName
  state.token = userData.token
  state.userId = userData.userId
  state.userType = userData.userType
  state.status = userData.status
  state.subscriptionStatus = userData.subscriptionStatus
  state.usage = userData.usage
  state.profileImg = userData.profileImg
}
