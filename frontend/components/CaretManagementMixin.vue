<!-- Demonstrates focus on code reusability (Vue currenty uses "mixins"), also demonstrates
  a solution to a frustrating problem of using HTML5 contenteditable elements by manually managing caret position -->

<script>
export default {
  data () {
    return {
      pCaret: null,
      caret: null,
      ignorePlacement: false
    }
  },
  beforeUpdate () {
    const isActive = this.$el.contains(document.activeElement)
    if (isActive && this.pCaret === null) {
      this.$_caretManagement_captureCaret()
    }
  },
  updated () {
    if (this.pCaret !== null) {
      this.$_caretManagement_placeCaretAt(this.pCaret)
    }
  },
  methods: {
    $_caretManagement_walk (node, fn) {
      if (fn(node) === false) {
        return false
      }
      node = node.firstChild
      while (node !== null) {
        if (this.$_caretManagement_walk(node, fn) === false) {
          return false
        }
        node = node.nextSibling
      }
    },
    $_caretManagement_resetCaret () {
      this.pCaret = null
    },
    $_caretManagement_placeCaretAt (caret) {
      if (!this.ignorePlacement) {
        const selection = window.getSelection()
        if (selection.rangeCount) {
          const range = selection.getRangeAt(0)
          let nodeToSelect = null
          let traversed = 0
          let nodeOffset = 0
          this.$_caretManagement_walk(this.$el, (nd) => {
            if (!nodeToSelect) {
              if (nd.nodeType === 3) {
                const incrementedLength = traversed + nd.length
                if (incrementedLength >= caret) {
                  nodeToSelect = nd
                  nodeOffset = caret - traversed
                } else {
                  traversed += nd.length
                }
              }
            }
          })
          if (nodeToSelect) {
            range.setStart(nodeToSelect, nodeOffset)
            range.collapse(true)
            selection.removeAllRanges()
            selection.addRange(range)
          } else {
            console.error('A valid node to append was not found!', caret)
          }
          this.$_caretManagement_resetCaret()
        }
      }
    },
    $_caretManagement_captureCaret (ignore = false) {
      const caret = this.$_caretManagement_getCaret()
      this.$_caretManagement_setCaret(caret, ignore)
    },
    $_caretManagement_getCaret () {
      const element = this.$el
      if (!element) {
        throw Error(`No element has been found,
        please ensure that a "mainTarget" reference has been
        added to the template!`)
      }
      const selection = window.getSelection()
      if (selection.rangeCount) {
        const range = selection.getRangeAt(0)
        const preCaretRange = range.cloneRange()
        preCaretRange.selectNodeContents(element)
        preCaretRange.setEnd(range.startContainer, range.startOffset)
        const preText = preCaretRange.toString().normalize()
        const caretOffset = [...preText].length
        return caretOffset
      }
      return 0
    },
    $_caretManagement_setCaret (caret, ignore = false) {
      const c = Math.max(caret, 0)
      if (!ignore) {
        this.pCaret = c
      }
      this.caret = c
    }
  }
}
</script>
