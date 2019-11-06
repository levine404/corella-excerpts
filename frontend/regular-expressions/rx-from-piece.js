// Demonstrates usage of regular expressions, this project is actually very inundated with
// regular expressions throughout the entire project and drives a lof of very powerful
// algorithms, including newer regex operations such as positive/negative look-aheads/look-behinds
// and unicode based searching

// Imports
import replaceShortcuts from './replace-shortcuts'

// Function to generate a regular expression from a small piece of translation data
const rxFromPiece = (piece, separators, shortcutMap) => {
  if (piece && piece.length) {
    // Escape ?, ) char within matching group
    const separatorMatcher = '(' + separators.replace(/[?)]/g, '\\$&') + ')|\\s|^|$'
    let rxString = piece + ''
    rxString = replaceShortcuts(rxString, shortcutMap)
    // Escape all regexp chars accept for pipes
    rxString = rxString.replace(/[.*+?^${}[\]\\]/g, '\\$&')
    // Escape pipes not associated with an actual group
    rxString = rxString.replace(/(?<=\(.+)[/, ](?=.+\))/g, '|')
    const isSuffix = piece[0] === '-' || (!separators || !separators.length)
    rxString = rxString.replace(/^-/, '')
    const isPrefix = piece[piece.length - 1] === '-' || (!separators || !separators.length)
    rxString = rxString.replace(/-$/, '')
    if (!isSuffix) {
      rxString = `(?<=${separatorMatcher})` + rxString
    }
    if (!isPrefix) {
      rxString = rxString + `(?=${separatorMatcher})`
    }
    return new RegExp(rxString, 'ig')
  } else {
    return null
  }
}

export default rxFromPiece
