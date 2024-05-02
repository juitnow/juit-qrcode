/* ========================================================================== *
 * CONSTANTS                                                                  *
 * ========================================================================== */

// Initialization table for CRC32
const CRC_TABLE: number[] = (() => {
  const table: number[] = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1)
      } else {
        c = c >>> 1
      }
    }
    table[n] = c >>> 0
  }
  return table
})()

/* ========================================================================== *
 * EXPORTED                                                                   *
 * ========================================================================== */

/**
 * Calculate the CRC32 checksum for a given `Uint8Array`
 *
 * @param array The `Uint8Array` to use for checksum calculation
 * @param offset The offset in the array to start calculating from
 * @param length The number of bytes to use for calculation, if _negative_
 *               this be considered to be relative to the end of the array.
 * */
export function crc32(
    array: Uint8Array,
    offset: number = 0,
    length?: number,
): number {
  let crc = -1
  const end =
    length === undefined ? array.length :
    length > 0 ? offset + length :
    array.length + length

  for (let i = offset; i < end; i ++) {
    crc = CRC_TABLE[(crc ^ array[i]!) & 0x0FF]! ^ (crc >>> 8)
  }

  return (crc ^ -1) >>> 0
}
