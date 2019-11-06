<!-- Demonstrates implementation of a "renderless" component -->

<script>
export default {
  name: 'UserData',
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser(this.userId)
    }
  },
  created () {
    if (!this.user) {
      this.$store.commit('initItem', {
        itemType: 'user',
        itemKey: this.userId
      })
    }
    if (!this.user || ['unloaded', 'failed'].indexOf(this.user.status) !== -1) {
      this.$store.dispatch('loadUser', this.userId)
    }
  },
  render () {
    return this.$scopedSlots.default({
      user: {
        _id: this.userId,
        ...this.user
      }
    })
  }
}
</script>
