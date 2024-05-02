import type { ECLevel } from './index'
import type { QrCodeData } from './qrcode'

/* ========================================================================== *
 * INTERNALS                                                                  *
 * ========================================================================== */

// Initialize a matrix with all zeros
function init(version: number): number[][] {
  const n = (version * 4) + 17
  const matrix = new Array<number[]>(n)
  for (let i = 0; i < n; i++) {
    matrix[i] = new Array<number>(n).fill(0)
  }
  return matrix
}

/* ========================================================================== */

// Put finders into matrix
function fillFinders(matrix: number[][]): void {
  const n = matrix.length
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      const max = Math.max(i, j)
      const min = Math.min(i, j)
      const pixel = (max == 2 && min >= -2) || (min == -2 && max <= 2) ? 0x80 : 0x81
      matrix[3 + i]![3 + j] = pixel
      matrix[3 + i]![n - 4 + j] = pixel
      matrix[n - 4 + i]![3 + j] = pixel
    }
  }
  for (let i = 0; i < 8; i++) {
    matrix[7]![i] = matrix[i]![7] =
        matrix[7]![n - i - 1] = matrix[i]![n - 8] =
        matrix[n - 8]![i] = matrix[n - 1 - i]![7] = 0x80
  }
}

/* ========================================================================== */

// Put align and timinig
function fillAlignAndTiming(matrix: number[][]): void {
  const n = matrix.length
  if (n > 21) {
    const len = n - 13
    let delta = Math.round(len / Math.ceil(len / 28))
    // coverage ignore if // can't seem to cover it...
    if (delta % 2) delta++
    const res = []
    for (let p = len + 6; p > 10; p -= delta) {
      res.unshift(p)
    }
    res.unshift(6)
    for (let i = 0; i < res.length; i++) {
      for (let j = 0; j < res.length; j++) {
        const x = res[i]!
        const y = res[j]!
        if (matrix[x]![y]) continue
        for (let r = -2; r <=2; r++) {
          for (let c = -2; c <=2; c++) {
            const max = Math.max(r, c)
            const min = Math.min(r, c)
            const pixel = (max == 1 && min >= -1) || (min == -1 && max <= 1) ? 0x80 : 0x81
            matrix[x + r]![y + c] = pixel
          }
        }
      }
    }
  }
  for (let i = 8; i < n - 8; i++) {
    matrix[6]![i] = matrix[i]![6] = i % 2 ? 0x80 : 0x81
  }
}

/* ========================================================================== */

// Fill reserved areas with zeroes
function fillStub(matrix: number[][]): void {
  const n = matrix.length
  for (let i = 0; i < 8; i++) {
    if (i != 6) {
      matrix[8]![i] = matrix[i]![8] = 0x80
    }
    matrix[8]![n - 1 - i] = 0x80
    matrix[n - 1 - i]![8] = 0x80
  }
  matrix[8]![8] = 0x80
  matrix[n - 8]![8] = 0x81

  if (n < 45) return

  for (let i = n - 11; i < n - 8; i++) {
    for (let j = 0; j < 6; j++) {
      matrix[i]![j] = matrix[j]![i] = 0x80
    }
  }
}

/* ========================================================================== */

// Fill reserved areas
const fillReserved = ((): ((matrix: number[][], ec_level: ECLevel, mask: number) => void) => {
  const FORMATS = new Array<number>(32)
  const VERSIONS = new Array<number>(40)

  const gf15 = 0x0537
  const gf18 = 0x1f25
  const formatsMask = 0x5412

  for (let format = 0; format < 32; format++) {
    let res = format << 10
    for (let i = 5; i > 0; i--) {
      if (res >>> (9 + i)) {
        res = res ^ (gf15 << (i - 1))
      }
    }
    FORMATS[format] = (res | (format << 10)) ^ formatsMask
  }

  for (let version = 7; version <= 40; version++) {
    let res = version << 12
    for (let i = 6; i > 0; i--) {
      if (res >>> (11 + i)) {
        res = res ^ (gf18 << (i - 1))
      }
    }
    VERSIONS[version] = (res | (version << 12))
  }

  const EC_LEVELS = { L: 1, M: 0, Q: 3, H: 2 }

  return function fillReserved(matrix: number[][], ecLevel: ECLevel, mask: number) {
    const N = matrix.length
    const format = FORMATS[EC_LEVELS[ecLevel] << 3 | mask]!
    function _f(k: number): number {
      return format >> k & 1 ? 0x81 : 0x80
    }
    for (let i = 0; i < 8; i++) {
      matrix[8]![N - 1 - i] = _f(i)
      if (i < 6) matrix[i]![8] = _f(i)
    }
    for (let i = 8; i < 15; i++) {
      matrix[N - 15 + i]![8] = _f(i)
      if (i > 8) matrix[8]![14 - i] = _f(i)
    }
    matrix[7]![8] = _f(6)
    matrix[8]![8] = _f(7)
    matrix[8]![7] = _f(8)

    const version = VERSIONS[(N - 17)/4]!
    if (!version) return

    function _v(k: number): number {
      return version >> k & 1 ? 0x81 : 0x80
    }
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        matrix[N - 11 + j]![i] = matrix[i]![N - 11 + j] = _v(i * 3 + j)
      }
    }
  }
})()

/* ========================================================================== */

// Fill data
const fillData = ((): ((matrix: number[][], data: any, mask: number) => void) => {
  const MASK_FUNCTIONS = [
    function(i: number, j: number): boolean {
      return (i + j) % 2 == 0
    },
    function(i: number, j: number): boolean {
      void j
      return i % 2 == 0
    },
    function(i: number, j: number): boolean {
      void i
      return j % 3 == 0
    },
    function(i: number, j: number): boolean {
      return (i + j) % 3 == 0
    },
    function(i: number, j: number): boolean {
      return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0
    },
    function(i: number, j: number): boolean {
      return (i * j) % 2 + (i * j) % 3 == 0
    },
    function(i: number, j: number): boolean {
      return ( (i * j) % 2 + (i * j) % 3) % 2 == 0
    },
    function(i: number, j: number): boolean {
      return ( (i * j) % 3 + (i + j) % 2) % 2 == 0
    },
  ]

  return function fillData(matrix: number[][], data: QrCodeData, mask: number): void {
    const N = matrix.length
    let row: number
    let col: number
    let dir = -1
    row = col = N - 1
    const maskFn = MASK_FUNCTIONS[mask]!
    let len = data.blockData[data.blockData.length - 1]!.length

    for (let i = 0; i < len; i++) {
      for (let b = 0; b < data.blockData.length; b++) {
        if (data.blockData[b]!.length <= i) continue
        put(data.blockData[b]![i]!)
      }
    }

    len = data.ecData[0]!.length
    for (let i = 0; i < len; i++) {
      for (let b = 0; b < data.ecData.length; b++) {
        put(data.ecData[b]![i]!)
      }
    }

    if (col > -1) {
      do {
        matrix[row]![col] = maskFn(row, col) ? 1 : 0
      } while (next())
    }

    function put(byte: number): void {
      for (let mask = 0x80; mask; mask = mask >> 1) {
        let pixel = !!(mask & byte)
        if (maskFn(row, col)) pixel = !pixel
        matrix[row]![col] = pixel ? 1 : 0
        next()
      }
    }

    function next(): boolean {
      do {
        if ((col % 2) ^ (col < 6 ? 1 : 0)) {
          if (dir < 0 && row == 0 || dir > 0 && row == N - 1) {
            col--
            dir = -dir
          } else {
            col++
            row += dir
          }
        } else {
          col--
        }
        if (col == 6) {
          col--
        }
        if (col < 0) {
          return false
        }
      } while (matrix[row]![col]! & 0xf0)
      return true
    }
  }
})()

/* ========================================================================== */

// Calculate penalty
function calculatePenalty(matrix: number[][]): number {
  const N = matrix.length
  let penalty = 0
  // Rule 1
  for (let i = 0; i < N; i++) {
    let pixel = matrix[i]![0]! & 1
    let len = 1
    for (let j = 1; j < N; j++) {
      const p = matrix[i]![j]! & 1
      if (p == pixel) {
        len++
        continue
      }
      if (len >= 5) {
        penalty += len - 2
      }
      pixel = p
      len = 1
    }
    if (len >= 5) {
      penalty += len - 2
    }
  }
  for (let j = 0; j < N; j++) {
    let pixel = matrix[0]![j]! & 1
    let len = 1
    for (let i = 1; i < N; i++) {
      const p = matrix[i]![j]! & 1
      if (p == pixel) {
        len++
        continue
      }
      if (len >= 5) {
        penalty += len - 2
      }
      pixel = p
      len = 1
    }
    if (len >= 5) {
      penalty += len - 2
    }
  }

  // Rule 2
  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < N - 1; j++) {
      const s = matrix[i]![j]! + matrix[i]![j + 1]! + matrix[i + 1]![j]! + matrix[i + 1]![j + 1]! & 7
      if (s == 0 || s == 4) {
        penalty += 3
      }
    }
  }

  // Rule 3
  let i: number
  let j: number

  function _i(k: number): number {
    return matrix[i]![j + k]! & 1
  }
  function _j(k: number): number {
    return matrix[i + k]![j]! & 1
  }
  for (i = 0; i < N; i++) {
    for (j = 0; j < N; j++) {
      if (j < N - 6 && _i(0) && !_i(1) && _i(2) && _i(3) && _i(4) && !_i(5) && _i(6)) {
        if (j >= 4 && !(_i(-4) || _i(-3) || _i(-2) || _i(-1))) {
          penalty += 40
        }
        if (j < N - 10 && !(_i(7) || _i(8) || _i(9) || _i(10))) {
          penalty += 40
        }
      }

      if (i < N - 6 && _j(0) && !_j(1) && _j(2) && _j(3) && _j(4) && !_j(5) && _j(6)) {
        if (i >= 4 && !(_j(-4) || _j(-3) || _j(-2) || _j(-1))) {
          penalty += 40
        }
        if (i < N - 10 && !(_j(7) || _j(8) || _j(9) || _j(10))) {
          penalty += 40
        }
      }
    }
  }

  // Rule 4
  let numDark = 0
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (matrix[i]![j]! & 1) numDark++
    }
  }
  penalty += 10 * Math.floor(Math.abs(10 - 20 * numDark/(N * N)))

  return penalty
}

/* ========================================================================== *
 * EXPORTED                                                                   *
 * ========================================================================== */

/** Generate a matrix from a QR code data structure */
export function generateQrCodeMatrix(code: QrCodeData): boolean[][] {
  const matrix = init(code.version)
  fillFinders(matrix)
  fillAlignAndTiming(matrix)
  fillStub(matrix)

  let penalty = Infinity
  let bestMask = 0
  for (let mask = 0; mask < 8; mask++) {
    fillData(matrix, code, mask)
    fillReserved(matrix, code.ecLevel, mask)
    const p = calculatePenalty(matrix)
    if (p < penalty) {
      penalty = p
      bestMask = mask
    }
  }

  fillData(matrix, code, bestMask)
  fillReserved(matrix, code.ecLevel, bestMask)

  return matrix.map((row) => {
    return row.map((cell) => {
      return !! (cell & 1)
    })
  })
}
