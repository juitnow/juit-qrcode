import { QR_CODE_DEFAULTS } from './defaults'
import { encodeQRCodeData } from './encode'
import { generatePdf } from './images/pdf'
import { generatePng } from './images/png'
import { generateSvg } from './images/svg'
import { generateQRCodeMatrix } from './matrix'
import { generateQRCodeData } from './qrcode'
import { generateDataUri } from './utils/data'

export { generatePdf } from './images/pdf'
export { generatePng } from './images/png'
export { generateSvg } from './images/svg'

/**
 * The error correction level for QR codes (`L`, `M`, `Q`, or `H`)
 *
 * * `L`: approximately 7% of error correction capability
 * * `M`: approximately 15% of error correction capability
 * * `Q`: approximately 25% of error correction capability
 * * `H`: approximately 30% of error correction capability
 */
export type ECLevel = 'L' | 'M' | 'Q' | 'H'

/** The structure of a _generated_ QR code */
export interface QRCode {
  /** The version of the QR code (1...40) */
  readonly version: number,
  /** The error correction level for the QR code */
  readonly ecLevel: ECLevel,
  /** The size (in pixels) of the QR code */
  readonly size: number,
  /** The QR code matrix */
  readonly matrix: readonly boolean[][]
}

/** Options for the generation of a {@link QRCode} */
export interface QRCodeGenerationOptions {
  /** The error correction level for the QR code (default: `M`) */
  ecLevel?: ECLevel,
  /** Whether to optimize URLs in QR codes (default: `false`) */
  url?: boolean,
}

/** Options to render a {@link QRCode} into an image */
export interface QRCodeImageOptions {
  /** The number of pixels used for each dot in the matrix (default: `1` for PNG/SVG and `9` for PDF) */
  scale?: number,
  /** The size of the margin around the QR code in matrix dots (default: `1`) */
  margin?: number,
}

/** QR code options */
export interface QRCodeOptions extends QRCodeGenerationOptions, QRCodeImageOptions {}

/** Generate a {@link QRCode} from a string or binary message */
export function generate(message: string | Uint8Array, options?: QRCodeGenerationOptions): QRCode {
  const { ecLevel, url = false } = { ...QR_CODE_DEFAULTS, ...options }

  const encoded = encodeQRCodeData(message, url)
  const qrcode = generateQRCodeData(encoded, ecLevel)
  const matrix = generateQRCodeMatrix(qrcode)

  return {
    version: qrcode.version,
    ecLevel: qrcode.ecLevel,
    size: matrix.length,
    matrix,
  }
}

/** Generate a QR code in PNG format from a string or binary message */
export function qr(message: string | Uint8Array, format: 'png', options?: QRCodeOptions): Promise<Uint8Array>
/** Generate a QR code in PDF format from a string or binary message */
export function qr(message: string | Uint8Array, format: 'pdf', options?: QRCodeOptions): Promise<Uint8Array>
/** Generate a QR code in SVG format from a string or binary message */
export function qr(message: string | Uint8Array, format: 'svg', options?: QRCodeOptions): Promise<string>
/** Generate a QR code as a PNG data URI from a string or binary message */
export function qr(message: string | Uint8Array, format: 'pngData', options?: QRCodeOptions): Promise<string>
/** Generate a QR code as a PDF data URI from a string or binary message */
export function qr(message: string | Uint8Array, format: 'pdfData', options?: QRCodeOptions): Promise<string>
/** Generate a QR code as a SVG data URI from a string or binary message */
export function qr(message: string | Uint8Array, format: 'svgData', options?: QRCodeOptions): Promise<string>
// Method overload implementation
export async function qr(
    message: string | Uint8Array,
    format: 'png' | 'pdf' | 'svg' | 'pngData' | 'pdfData' | 'svgData',
    options?: QRCodeOptions,
): Promise<Uint8Array | string> {
  const code = generate(message, options)

  switch (format) {
    // plain images
    case 'png': return await generatePng(code, options)
    case 'pdf': return await generatePdf(code, options)
    case 'svg': return generateSvg(code, options)
    // images as data URIs
    case 'pngData': return generateDataUri(await generatePng(code, options), 'image/png')
    case 'pdfData': return generateDataUri(await generatePdf(code, options), 'application/pdf')
    case 'svgData': return generateDataUri(generateSvg(code, options), 'image/svg+xml')
    // coverage ignore next
    default: throw new Error(`Unsupported format "${format}"`)
  }
}
