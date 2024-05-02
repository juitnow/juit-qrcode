import { QR_CODE_DEFAULTS } from '../defaults'
import { deflate } from '../utils/deflate'
import { mergeArrays } from '../utils/merge'
import { generatePaths } from './path'

import type { QRCode, QRCodeImageOptions } from '..'

/** Generate a PDF document for the given {@link QRCode} */
export async function generatePdf(code: QRCode, options?: QRCodeImageOptions): Promise<Uint8Array> {
  const { margin, scale } = { ...QR_CODE_DEFAULTS, ...{ scale: 9 }, ...options }
  const size = (code.size + 2 * margin) * scale

  // Our text encoder used throughout
  const encoder = new TextEncoder()

  // PDF header and preamble
  const chunks: Uint8Array[] = [
    encoder.encode('%PDF-1.0\n\n'), // PDF header
    encoder.encode('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n'),
    encoder.encode('2 0 obj << /Type /Pages /Count 1 /Kids [ 3 0 R ] >> endobj\n'),
    encoder.encode(`3 0 obj << /Type /Page /Parent 2 0 R /Resources <<>> /Contents 4 0 R /MediaBox [ 0 0 ${size} ${size} ] >> endobj\n`),
  ]

  // Convert paths into a streamed PDF object
  let path = `${scale} 0 0 ${scale} 0 0 cm\n`
  path += generatePaths(code).map(function(subpath) {
    let x: number = NaN
    let y: number = NaN
    let res: string = ''

    for (let k = 0; k < subpath.length; k++) {
      const item = subpath[k]!
      switch (item[0]) {
        case 'M':
          x = item[1] + margin
          y = code.size - item[2] + margin
          res += x + ' ' + y + ' m '
          break
        case 'h':
          x += item[1]
          res += x + ' ' + y + ' l '
          break
        case 'v':
          y -= item[1]
          res += x + ' ' + y + ' l '
          break
      }
    }
    res += 'h'
    return res
  }).join('\n')
  path += '\nf\n'

  // Encode the path as our 4th object
  const deflated = await deflate(encoder.encode(path))
  chunks.push(mergeArrays(
      encoder.encode(`4 0 obj << /Length ${deflated.length} /Filter /FlateDecode >> stream\n`), // start the stream
      deflated, // the path is deflated
      encoder.encode('\nendstream\nendobj\n'), // end the stream
  ))

  // Calculate the offsets of our objects (XREFs)
  let xref = 'xref\n0 5\n0000000000 65535 f \n'
  let offset = chunks[0]!.length
  for (let i = 1; i < 5; i++) {
    xref += `0000000000${offset}`.slice(-10) + ' 00000 n \n'
    offset += chunks[i]!.length
  }

  chunks.push(
      encoder.encode(xref),
      encoder.encode('trailer << /Root 1 0 R /Size 5 >>\n'),
      encoder.encode('startxref\n' + offset + '\n%%EOF\n'),
  )

  return mergeArrays(...chunks)
}
