import { generatePaths } from './path'

import type { QrCode, QrCodeImageOptions } from '..'

/** Generate a SVG image for the given {@link QrCode} */
export function generateSvg(code: QrCode, options?: QrCodeImageOptions): string {
  const { margin = 4, scale = 1 } = { ...options }
  const size = code.size + 2 * margin
  const scaled = size * scale

  const chunks: (string | number)[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${scaled}" height="${scaled}" viewBox="0 0 ${size} ${size}">`,
    '<path d="', // beginning of the path "d" attribute...
  ]

  // Push all the SVG path components...
  generatePaths(code).forEach((path) => {
    for (let k = 0; k < path.length; k++) {
      const item = path[k]!
      switch (item[0]) {
        case 'M': // move
          chunks.push(`M${item[1] + margin} ${item[2] + margin}`)
          break
        default: // draw path
          chunks.push(...item)
      }
    }
    chunks.push('z') // done
  })

  chunks.push('"/></svg>') // close the path "d" attribute
  return chunks.join('')
}
