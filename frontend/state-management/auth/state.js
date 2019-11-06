// Typical state structure for auth state

import generateUid from '../../common/generate-uid'

let bid = localStorage.getItem('bid')
if (!bid) {
  bid = generateUid(15)
  localStorage.setItem('bid', bid)
}

export default {
  userId: null,
  displayName: null,
  userType: null,
  token: null,
  bid,
  binstance: generateUid(13),
  subscriptionStatus: {
    type: 'none',
    validStartDate: 0,
    validEndDate: 0
  },
  usage: {
    storage: 0,
    transfer: 0,
    termCollections: 0,
    termCollectionSize: 0,
    tasks: 0,
    taskSize: 0
  },
  profileImg: null
}
