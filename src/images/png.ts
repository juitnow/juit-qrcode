import { crc32 } from '../utils/crc32'
import { deflate } from '../utils/deflate'

import type { QrCode, QrCodeImageOptions } from '../index'

/* ========================================================================== *
 * TYPES                                                                      *
 * ========================================================================== */

interface Bitmap {
  data: Uint8Array,
  size: number,
}

/* ========================================================================== *
 * CONSTANTS                                                                  *
 * ========================================================================== */

const PNG_HEAD = new Uint8Array([ 137, 80, 78, 71, 13, 10, 26, 10 ])
const PNG_IHDR = new Uint8Array([ 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0 ])
const PNG_IDAT = new Uint8Array([ 0, 0, 0, 0, 73, 68, 65, 84 ])
const PNG_IEND = new Uint8Array([ 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130 ])

/* ========================================================================== *
 * INTERNALS                                                                  *
 * ========================================================================== */

// Encode a PNG bitmap into a Uint8Array
async function png(bitmap: Bitmap): Promise<Uint8Array> {
  const chunks: Uint8Array[] = []

  // push the PNG header
  chunks.push(PNG_HEAD)

  // create the image header
  const imageHeader = new Uint8Array(PNG_IHDR)
  const imageHeaderView = new DataView(imageHeader.buffer)

  imageHeaderView.setUint32(8, bitmap.size, false) // width of the PNG image
  imageHeaderView.setUint32(12, bitmap.size, false) // height of the PNG image
  imageHeaderView.setUint32(21, crc32(imageHeader, 4, -4), false) // crc at the end

  chunks.push(imageHeader) // push our first "chunk"

  // compress our image data
  const data = await deflate(bitmap.data)

  // create our image data array (header, compressed data, crc)
  const imageData = new Uint8Array(PNG_IDAT.length + data.length + 4)
  const imageDataView = new DataView(imageData.buffer)

  imageData.set(PNG_IDAT, 0) // first is the image data preamble
  imageData.set(data, PNG_IDAT.length) // then is the compressed data
  imageDataView.setUint32(0, imageData.length - 12, false) // length goes at the beginning
  imageDataView.setUint32(imageData.length - 4, crc32(imageData, 4, -4), false) // then crc at the end

  chunks.push(imageData) // second "chunk"

  // push the PNG trailer "as is"
  chunks.push(PNG_IEND)

  // combine our chunks into a single array
  return new Uint8Array(await new Blob(chunks).arrayBuffer())
}

// Convert a matrix to a PNG bitmap
function bitmap(matrix: readonly boolean[][], scale: number, margin: number): Bitmap {
  const n = matrix.length
  const x = (n + 2 * margin) * scale
  const data = new Uint8Array((x + 1) * x).fill(255)

  for (let i = 0; i < x; i++) {
    data[i * (x + 1)] = 0
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i]![j]) {
        const offset = ((margin + i) * (x + 1) + (margin + j)) * scale + 1
        data.fill(0, offset, offset + scale)
        for (let c = 1; c < scale; c++) {
          const chunk = data.subarray(offset, offset + scale)
          data.set(chunk, offset + c * (x + 1))
        }
      }
    }
  }

  return {
    data: data,
    size: x,
  }
}

/* ========================================================================== *
 * EXPORTED                                                                   *
 * ========================================================================== */

/** Generate a PNG image for the given {@link QrCode} */
export async function generatePng(code: QrCode, options?: QrCodeImageOptions): Promise<Uint8Array> {
  const { margin = 4, scale = 1 } = { ...options }
  const result = bitmap(code.matrix, scale, margin)
  const image = await png(result)
  return image
}
