import { generatePaths } from './path'

import type { QrCode, QrCodeImageOptions } from '..'

/* ========================================================================== *
 * INTERNALS                                                                  *
 * ========================================================================== */

function convertPath(
    chunks: (string | number)[],
    code: QrCode,
    margin: number,
): (string | number)[] {
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

  return chunks
}

/* ========================================================================== *
 * EXPORTED                                                                   *
 * ========================================================================== */

/**
 * Generate a SVG _path_ for the given {@link QrCode}.
 *
 * The returned SVG path will be a simple conversion of the QR code's own
 * {@link QrCode.matrix matrix} into a square path of _**N**_ "pixels"
 * (where _**N**_ is the size of the {@link QrCode.size size} of the matrix).
 *
 * This can be scaled and positioned into a final SVG using the `scale(...)` and
 * `translate(...)` (basic SVG transformations)[https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Transformations].
 *
 * This is also particulary useful with (PDFKit)[https://pdfkit.org/]'s own
 * implementation of (SVG paths)[https://pdfkit.org/docs/vector.html#svg_paths].
 *
 * We can use it together with `translate(...)` and `scale(...)` to draw our QR
 * code anywhere on the page, in any size. For example, to prepare a simple A4
 * document with a 10cm QR code smack in the middle we can:
 *
 * ```typescript
 * // generate the QR code _structure_ for our message
 * const code = generateQrCode('https://www.juit.com/')
 *
 * // generate the SVG path for our QR code
 * const path = generateSvgPath(code)
 *
 * // calculate how to translate and scale our QR code in the page
 * const dpcm = 72 / 2.54             // PDFKit uses 72dpi (inches) we want metric!
 * const size = 10 * dpcm             // 10 cm (size of our QR code) in dots
 * const scale = size / code.size     // scale factor for our QR code to be 10 cm
 * const x = ((21 - 10) / 2) * dpcm   // center horizontally
 * const y = ((29.7 - 10) / 2) * dpcm // center vertically
 *
 * // create a new A4 document, and stream it to "test.pdf"
 * const document = new PDFDocument({ size: 'A4' })
 * const stream = createWriteStream('test.pdf')
 * document.pipe(stream)
 *
 * // draw our 10cm QR code right in the middle of the page
 * document
 *   .translate(x, y) // move to x = 5.5cm, y = 9.85cm
 *   .scale(scale)    // scale our QR code to 10cm width and height
 *   .path(path)      // draw our QR code smack in the middle of the page
 *   .fill('black')   // fill our QR code in black
 *   .end()           // finish up and close the document
 *
 * // wait for the stream to finish
 * stream.on('finish', () => {
 *   // your PDF file is ready!
 * })
 * ```
 */
export function generateSvgPath(code: QrCode): string {
  return convertPath([], code, 0).join()
}

/** Generate a SVG image for the given {@link QrCode} */
export function generateSvg(code: QrCode, options?: QrCodeImageOptions): string {
  const { margin = 4, scale = 1 } = { ...options }
  const size = code.size + 2 * margin
  const scaled = size * scale

  const chunks = convertPath([
    `<svg xmlns="http://www.w3.org/2000/svg" width="${scaled}" height="${scaled}" viewBox="0 0 ${size} ${size}">`,
    '<path d="', // beginning of the path "d" attribute...
  ], code, margin)

  chunks.push('"/></svg>') // close the path "d" attribute
  return chunks.join('')
}
