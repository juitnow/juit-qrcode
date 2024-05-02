import { QR_CODE_DEFAULTS } from './defaults'
import { encodeQrCodeMessage } from './encode'
import { generatePdf } from './images/pdf'
import { generatePng } from './images/png'
import { generateSvg } from './images/svg'
import { generateQrCodeMatrix } from './matrix'
import { generateQrCodeData } from './qrcode'
import { generateDataUrl } from './utils/dataurl'

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
export interface QrCode {
  /** The version of the QR code (1...40) */
  readonly version: number,
  /** The error correction level for the QR code */
  readonly ecLevel: ECLevel,
  /** The size (in pixels) of the QR code */
  readonly size: number,
  /** The QR code matrix */
  readonly matrix: readonly boolean[][]
}

/** Options for the generation of a {@link QrCode} */
export interface QrCodeGenerationOptions {
  /** The error correction level for the QR code (default: `M`) */
  ecLevel?: ECLevel,
  /** Whether to optimize URLs in QR codes (default: `false`) */
  url?: boolean,
}

/** Options to render a {@link QrCode} into an image */
export interface QrCodeImageOptions {
  /** The number of pixels used for each dot in the matrix (default: `1` for PNG/SVG and `9` for PDF) */
  scale?: number,
  /** The size of the margin around the QR code in matrix dots (default: `1`) */
  margin?: number,
}

/** QR code options */
export interface QrCodeOptions extends QrCodeGenerationOptions, QrCodeImageOptions {}

/** Generate a {@link QrCode} from a string or binary message */
export function generateQrCode(message: string | Uint8Array, options?: QrCodeGenerationOptions): QrCode {
  const { ecLevel, url = false } = { ...QR_CODE_DEFAULTS, ...options }

  const encoded = encodeQrCodeMessage(message, url)
  const qrcode = generateQrCodeData(encoded, ecLevel)
  const matrix = generateQrCodeMatrix(qrcode)

  return {
    version: qrcode.version,
    ecLevel: qrcode.ecLevel,
    size: matrix.length,
    matrix,
  }
}

/* ===== SINGLE FORMAT (MORE "BUNDLE FRIENDLY" FOR TREE SHAKING) ============ */

/** Generate a QR code in PNG format from a string or binary message */
export async function generatePngQrCode(message: string | Uint8Array, options?: QrCodeOptions): Promise<Uint8Array> {
  return await generatePng(generateQrCode(message, options), options)
}

/** Generate a QR code in PDF format from a string or binary message */
export async function generatePdfQrCode(message: string | Uint8Array, options?: QrCodeOptions): Promise<Uint8Array> {
  return await generatePdf(generateQrCode(message, options), options)
}

/** Generate a QR code in SVG format from a string or binary message */
export function generateSvgQrCode(message: string | Uint8Array, options?: QrCodeOptions): string {
  return generateSvg(generateQrCode(message, options), options)
}

/** Generate a QR code as a PNG data URL from a string or binary message */
export async function generatePngDataQrCode(message: string | Uint8Array, options?: QrCodeOptions): Promise<string> {
  return generateDataUrl(await generatePng(generateQrCode(message, options), options), 'image/png')
}

/** Generate a QR code as a PDF data URL from a string or binary message */
export async function generatePdfDataQrCode(message: string | Uint8Array, options?: QrCodeOptions): Promise<string> {
  return generateDataUrl(await generatePdf(generateQrCode(message, options), options), 'application/pdf')
}

/** Generate a QR code as a SVG data URL from a string or binary message */
export function generateSvgDataQrCode(message: string | Uint8Array, options?: QrCodeOptions): string {
  return generateDataUrl(generateSvg(generateQrCode(message, options), options), 'image/svg+xml')
}

/* ===== DEFINITELY NOT "BUNDLE FRIENDLY" =================================== */

/** Generate a QR code in PNG format from a string or binary message */
export function generate(message: string | Uint8Array, format: 'png', options?: QrCodeOptions): Promise<Uint8Array>
/** Generate a QR code in PDF format from a string or binary message */
export function generate(message: string | Uint8Array, format: 'pdf', options?: QrCodeOptions): Promise<Uint8Array>
/** Generate a QR code in SVG format from a string or binary message */
export function generate(message: string | Uint8Array, format: 'svg', options?: QrCodeOptions): Promise<string>
/** Generate a QR code as a PNG data URL from a string or binary message */
export function generate(message: string | Uint8Array, format: 'pngData', options?: QrCodeOptions): Promise<string>
/** Generate a QR code as a PDF data URL from a string or binary message */
export function generate(message: string | Uint8Array, format: 'pdfData', options?: QrCodeOptions): Promise<string>
/** Generate a QR code as a SVG data URL from a string or binary message */
export function generate(message: string | Uint8Array, format: 'svgData', options?: QrCodeOptions): Promise<string>
// Method overload implementation
export async function generate(
    message: string | Uint8Array,
    format: 'png' | 'pdf' | 'svg' | 'pngData' | 'pdfData' | 'svgData',
    options?: QrCodeOptions,
): Promise<Uint8Array | string> {
  switch (format) {
    // plain images
    case 'png': return await generatePngQrCode(message, options)
    case 'pdf': return await generatePdfQrCode(message, options)
    case 'svg': return generateSvgQrCode(message, options)
    // images as data URLs
    case 'pngData': return await generatePngDataQrCode(message, options)
    case 'pdfData': return await generatePdfDataQrCode(message, options)
    case 'svgData': return generateSvgDataQrCode(message, options)
    // coverage ignore next
    default: throw new Error(`Unsupported format "${format}"`)
  }
}
