import { assert } from './utils/assert'

/* ========================================================================== *
 * TYPES                                                                      *
 * ========================================================================== */

/** Internal interface for encoding data */
export interface QRCodeMessage {
  /** Data for QR code version 27 or greater */
  data27: boolean[],
  /** Data for QR code version 10 or greater (shorter) */
  data10?: boolean[],
  /** Data for QR code version 1 or greater (shortest) */
  data1?: boolean[],
}

/* ========================================================================== *
 * CONSTANTS                                                                  *
 * ========================================================================== */

// Index for alphanumeric characters
const ALPHANUM: Record<string, number> = (function(s) {
  const res: Record<string, number> = {}
  for (let i = 0; i < s.length; i++) {
    res[s[i]!] = i
  }
  return res
})('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:')

/* ========================================================================== *
 * INTERNALS                                                                  *
 * ========================================================================== */

// Bush a number into a binary array (that is, 1s or 0s)
function pushBits(arr: boolean[], n: number, value: number): boolean[] {
  for (let bit = 1 << (n - 1); bit; bit = bit >>> 1) {
    arr.push(!! (bit & value))
  }
  return arr
}

// Encode binary data
function binaryEncode(data: Uint8Array): QRCodeMessage {
  const len = data.length
  const bits: boolean[] = []

  for (let i = 0; i < len; i++) {
    pushBits(bits, 8, data[i]!)
  }

  const d = pushBits([ false, true, false, false ], 16, len)

  const res: QRCodeMessage = {
    data27: d.concat(bits),
  }
  res.data10 = res.data27

  if (len < 256) {
    const d = pushBits([ false, true, false, false ], 8, len)
    res.data1 = d.concat(bits)
  }

  return res
}

// Encode alphanumeric data
function alphanumEncode(str: string): QRCodeMessage {
  const len = str.length
  const bits: boolean[] = []

  for (let i = 0; i < len; i += 2) {
    let b = 6
    let n = ALPHANUM[str[i]!]!
    if (str[i+1]) {
      b = 11
      n = n * 45 + ALPHANUM[str[i+1]!]!
    }
    pushBits(bits, b, n)
  }

  const d = pushBits([ false, false, true, false ], 13, len)

  const res: QRCodeMessage = {
    data27: d.concat(bits),
  }

  if (len < 2048) {
    const d = pushBits([ false, false, true, false ], 11, len)
    res.data10 = d.concat(bits)
  }

  if (len < 512) {
    const d = pushBits([ false, false, true, false ], 9, len)
    res.data1 = d.concat(bits)
  }

  return res
}

// Encode numeric data
function numericEncode(str: string): QRCodeMessage {
  const len = str.length
  const bits: boolean[] = []

  for (let i = 0; i < len; i += 3) {
    const s = str.substring(i, i + 3)
    const b = Math.ceil(s.length * 10 / 3)
    pushBits(bits, b, parseInt(s, 10))
  }

  const d = pushBits([ false, false, false, true ], 14, len)

  const res: QRCodeMessage = {
    data27: d.concat(bits),
  }

  if (len < 4096) {
    const d = pushBits([ false, false, false, true ], 12, len)
    res.data10 = d.concat(bits)
  }

  if (len < 1024) {
    const d = pushBits([ false, false, false, true ], 10, len)
    res.data1 = d.concat(bits)
  }

  return res
}

// Encode URLs (specific string format)
function urlEncode(str: string): QRCodeMessage {
  const slash = str.indexOf('/', 8) + 1 || str.length
  const res = encodeQRCodeData(str.slice(0, slash).toUpperCase(), false)

  if (slash >= str.length) return res

  const path = encodeQRCodeData(str.slice(slash), false)

  res.data27 = res.data27.concat(path.data27)

  if (res.data10 && path.data10) {
    res.data10 = res.data10.concat(path.data10)
  }

  if (res.data1 && path.data1) {
    res.data1 = res.data1.concat(path.data1)
  }

  return res
}

/* ========================================================================== *
 * EXPORTED                                                                   *
 * ========================================================================== */

/** Generate a message for the specified text or binary data */
export function encodeQRCodeData(message: string | Uint8Array, url: boolean): QRCodeMessage {
  let data: Uint8Array

  if (typeof message === 'string') {
    data = new TextEncoder().encode(message)

    if (/^[0-9]+$/.test(message)) {
      assert(data.length <= 7089, `Too much numeric data (len=${data.length})`)
      return numericEncode(message)
    }

    if (/^[0-9A-Z $%*+./:-]+$/.test(message)) {
      assert(data.length <= 4296, `Too much alphanumeric data (len=${data.length})`)
      return alphanumEncode(message)
    }

    if (url && /^https?:/i.test(message)) {
      return urlEncode(message)
    }
  } else {
    data = message
  }

  assert(data.length <= 2953, `Too much binary data (len=${data.length})`)
  return binaryEncode(data)
}
