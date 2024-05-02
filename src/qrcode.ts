import { calculateEcc } from './utils/ecc'

import type { QRCodeMessage } from './encode'
import type { ECLevel } from './index'

/* ========================================================================== *
 * TYPES                                                                      *
 * ========================================================================== */

interface Template {
  readonly version: number,
  readonly ecLevel: ECLevel,
  readonly dataLen: number,
  readonly ecLen: number,
  readonly blockLengths: readonly number[],
}

type Version = {
  readonly [ k in ECLevel ] : Template
}

/** The internal structure of a QR code */
export interface QRCodeData {
  /** The version of the QR code (1...40) */
  readonly version: number,
  /** The error correction level for the QR code */
  readonly ecLevel: ECLevel,
  /** The data blocks of the QR code */
  readonly blockData: number[][],
  /** The ECC blocks of the QR code */
  readonly ecData: number[][],
}

/* ========================================================================== *
 * CONSTANTS                                                                  *
 * ========================================================================== */

// Error correction levels, in order
const EC_LEVELS = [ 'L', 'M', 'Q', 'H' ] as const

// Total number of codewords, (number of ec codewords, number of blocks) * ( L, M, Q, H )
const CODEWORDS = [
  [ -1, -1, -1, -1, -1, -1, -1, -1, -1 ], // there is no version 0
  [ 26, 7, 1, 10, 1, 13, 1, 17, 1 ],
  [ 44, 10, 1, 16, 1, 22, 1, 28, 1 ],
  [ 70, 15, 1, 26, 1, 36, 2, 44, 2 ],
  [ 100, 20, 1, 36, 2, 52, 2, 64, 4 ],
  [ 134, 26, 1, 48, 2, 72, 4, 88, 4 ], // 5
  [ 172, 36, 2, 64, 4, 96, 4, 112, 4 ],
  [ 196, 40, 2, 72, 4, 108, 6, 130, 5 ],
  [ 242, 48, 2, 88, 4, 132, 6, 156, 6 ],
  [ 292, 60, 2, 110, 5, 160, 8, 192, 8 ],
  [ 346, 72, 4, 130, 5, 192, 8, 224, 8 ], // 10
  [ 404, 80, 4, 150, 5, 224, 8, 264, 11 ],
  [ 466, 96, 4, 176, 8, 260, 10, 308, 11 ],
  [ 532, 104, 4, 198, 9, 288, 12, 352, 16 ],
  [ 581, 120, 4, 216, 9, 320, 16, 384, 16 ],
  [ 655, 132, 6, 240, 10, 360, 12, 432, 18 ], // 15
  [ 733, 144, 6, 280, 10, 408, 17, 480, 16 ],
  [ 815, 168, 6, 308, 11, 448, 16, 532, 19 ],
  [ 901, 180, 6, 338, 13, 504, 18, 588, 21 ],
  [ 991, 196, 7, 364, 14, 546, 21, 650, 25 ],
  [ 1085, 224, 8, 416, 16, 600, 20, 700, 25 ], // 20
  [ 1156, 224, 8, 442, 17, 644, 23, 750, 25 ],
  [ 1258, 252, 9, 476, 17, 690, 23, 816, 34 ],
  [ 1364, 270, 9, 504, 18, 750, 25, 900, 30 ],
  [ 1474, 300, 10, 560, 20, 810, 27, 960, 32 ],
  [ 1588, 312, 12, 588, 21, 870, 29, 1050, 35 ], // 25
  [ 1706, 336, 12, 644, 23, 952, 34, 1110, 37 ],
  [ 1828, 360, 12, 700, 25, 1020, 34, 1200, 40 ],
  [ 1921, 390, 13, 728, 26, 1050, 35, 1260, 42 ],
  [ 2051, 420, 14, 784, 28, 1140, 38, 1350, 45 ],
  [ 2185, 450, 15, 812, 29, 1200, 40, 1440, 48 ], // 30
  [ 2323, 480, 16, 868, 31, 1290, 43, 1530, 51 ],
  [ 2465, 510, 17, 924, 33, 1350, 45, 1620, 54 ],
  [ 2611, 540, 18, 980, 35, 1440, 48, 1710, 57 ],
  [ 2761, 570, 19, 1036, 37, 1530, 51, 1800, 60 ],
  [ 2876, 570, 19, 1064, 38, 1590, 53, 1890, 63 ], // 35
  [ 3034, 600, 20, 1120, 40, 1680, 56, 1980, 66 ],
  [ 3196, 630, 21, 1204, 43, 1770, 59, 2100, 70 ],
  [ 3362, 660, 22, 1260, 45, 1860, 62, 2220, 74 ],
  [ 3532, 720, 24, 1316, 47, 1950, 65, 2310, 77 ],
  [ 3706, 750, 25, 1372, 49, 2040, 68, 2430, 81 ], // 40
]

const VERSIONS: Version[] = CODEWORDS.map((v: number[], index): Version => {
  if (! index) return null as any

  const res: Record<string, Template> = {}
  for (let i = 1; i < 8; i += 2) {
    const length = v[0]! - v[i]!
    const template = v[i+1]!
    const ecLevel = EC_LEVELS[(i/2)|0]!
    const blocks: number[] = []

    for (let k = template, n = length; k > 0; k--) {
      const block = (n / k) | 0
      blocks.push(block)
      n -= block
    }

    res[ecLevel] = {
      version: index,
      ecLevel: ecLevel,
      dataLen: length,
      ecLen: v[i]! / template,
      blockLengths: blocks,
    }
  }
  return res as Version
})

/* ========================================================================== *
 * INTERNALS                                                                  *
 * ========================================================================== */

// Get the template for the specified message and error correction level
function getTemplate(message: QRCodeMessage, ecLevel: ECLevel): Template {
  let len: number = NaN
  let i = 1

  if (message.data1) {
    len = Math.ceil(message.data1.length / 8)
  } else {
    i = 10
  }

  for (/* i */; i < 10; i++) {
    const version = VERSIONS[i]![ecLevel]
    if (version.dataLen >= len) {
      return structuredClone(version)
    }
  }

  if (message.data10) {
    len = Math.ceil(message.data10.length / 8)
  } else {
    i = 27
  }

  for (/* i */; i < 27; i++) {
    const version = VERSIONS[i]![ecLevel]
    if (version.dataLen >= len) {
      return structuredClone(version)
    }
  }

  len = Math.ceil(message.data27.length / 8)
  for (/* i */; i < 41; i++) {
    const version = VERSIONS[i]![ecLevel]
    if (version.dataLen >= len) {
      return structuredClone(version)
    }
  }

  throw new Error('Too much data to encode in QR code')
}

// Fill in a template and prepare a QR code
function fillTemplate(encoded: QRCodeMessage, template: Template): QRCodeData {
  const blocks = new Array<number>(template.dataLen).fill(0)

  let message: boolean[]
  if (template.version < 10) {
    message = encoded.data1!
  } else if (template.version < 27) {
    message = encoded.data10!
  } else {
    message = encoded.data27!
  }

  const len = message.length

  for (let i = 0; i < len; i += 8) {
    let b = 0
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | (message[i + j] ? 1 : 0)
    }
    blocks[i / 8] = b
  }

  let pad = 236
  for (let i = Math.ceil((len + 4) / 8); i < blocks.length; i++) {
    blocks[i] = pad
    pad = (pad == 236) ? 17 : 236
  }

  let offset = 0
  const ecData: number[][] = []
  const blockData = template.blockLengths.map((n) => {
    const b = blocks.slice(offset, offset + n)
    offset += n
    ecData.push(calculateEcc(b, template.ecLen))
    return b
  })

  return {
    version: template.version,
    ecLevel: template.ecLevel,
    ecData,
    blockData,
  }
}

/* ========================================================================== *
 * EXPORTED                                                                   *
 * ========================================================================== */

/**
 * Create the QR code structure for the given text or binary data.
 *
 * @param data The {@link QRCodeMessage} structure containing the message
 * @param ecLevel The error correction level for the QR code
 */
export function generateQRCodeData(data: QRCodeMessage, ecLevel: ECLevel): QRCodeData {
  return fillTemplate(data, getTemplate(data, ecLevel))
}
