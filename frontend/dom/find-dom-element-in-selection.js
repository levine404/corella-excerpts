// Demonstrates comfort of dom traversal and usage of newer APIs; in this case, TreeWalker and NodeFilter

// Function to find a dom element within a given selection
const findDOMElementInSelection = (selection, matcher) => {
  if (selection) {
    const range = selection.getRangeAt(0)
    if (range && range.commonAncestorContainer) {
      let lastElementFound = false
      let firstElementFound = false
      let matchedNode = false
      const top = range.commonAncestorContainer.nodeType !== 1
        ? range.commonAncestorContainer.parentElement
        : range.commonAncestorContainer
      const firstElement = range.startContainer.nodeType !== 1
        ? range.startContainer.parentElement
        : range.startContainer
      const lastElement = range.endContainer.nodeType !== 1
        ? range.endContainer.parentElement
        : range.endContainer
      const treeWalker = document.createTreeWalker(
        top,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode (node) {
            if (node === lastElement) {
              lastElementFound = true
            }
            if (node === firstElement) {
              firstElementFound = true
            }
            return NodeFilter.FILTER_ACCEPT
          }
        }
      )
      let current = null
      // eslint-disable-next-line no-unmodified-loop-condition
      while ((current = treeWalker.nextNode()) && !lastElementFound && !matchedNode) {
        matchedNode = firstElementFound && matcher(current)
        if ((current = treeWalker.firstChild()) && !matchedNode) {
          matchedNode = firstElementFound && matcher(current)
          while ((current = treeWalker.nextSibling()) && !matchedNode) {
            matchedNode = firstElementFound && matcher(current)
          }
          current = treeWalker.parentNode()
        }
      }
      return matchedNode
    }
  }
}

export default findDOMElementInSelection
