import { assert } from './assert'

/* ========================================================================== *
 * CONSTANTS                                                                  *
 * ========================================================================== */

// Galois Field Math
const GF256_BASE = 285
const EXP_TABLE: number[] = [ 1 ]
const LOG_TABLE: number[] = []

// Generator Polynomials
const POLYNOMIALS = [
  [ 0 ], // a^0 x^0
  [ 0, 0 ], // a^0 x^1 + a^0 x^0
  [ 0, 25, 1 ], // a^0 x^2 + a^25 x^1 + a^1 x^0
  // and so on...
]

// Prepare the exp table
for (let i = 1; i < 256; i++) {
  let n = EXP_TABLE[i - 1]! << 1
  if (n > 255) n = n ^ GF256_BASE
  EXP_TABLE[i] = n
}

// Prepare the log table
for (let i = 0; i < 255; i++) {
  LOG_TABLE[EXP_TABLE[i]!] = i
}

/* ========================================================================== *
 * INTERNALS                                                                  *
 * ========================================================================== */

// Get the exp for a number
function exp(k: number): number {
  // coverage ignore next
  while (k < 0) k += 255
  while (k > 255) k -= 255
  return EXP_TABLE[k]!
}

// Get the log for a number
function log(k: number): number {
  assert((k > 0) && (k < 256), `Bad log(${k})`)
  return LOG_TABLE[k]!
}


// Generate the polynomial up to N (recursively)
function generatePolynomial(num: number): number[] {
  const poly = POLYNOMIALS[num]
  if (poly) return poly

  const prev = generatePolynomial(num - 1)
  const res: number[] = []

  res[0] = prev[0]!
  for (let i = 1; i <= num; i++) {
    res[i] = log(exp(prev[i]!) ^ exp(prev[i - 1]! + num - 1))
  }

  return POLYNOMIALS[num] = res
}

/* ========================================================================== *
 * EXPORTED                                                                   *
 * ========================================================================== */

/** Calculate the Error Correction Code (Reed Solomon) for the given data */
export function calculateEcc(buf: number[], length: number): number[] {
  // `msg` could be array or buffer
  // convert `msg` to array
  const msg = ([] as number[]).slice.call(buf)

  // Generator Polynomial
  const poly = generatePolynomial(length)

  // Extend the array...
  for (let i = 0; i < length; i++) msg.push(0)

  while (msg.length > length) {
    if (!msg[0]) {
      msg.shift()
      continue
    }
    const logK = log(msg[0])
    for (let i = 0; i <= length; i++) {
      msg[i] = msg[i]! ^ exp(poly[i]! + logK)
    }
    msg.shift()
  }

  return msg
}
