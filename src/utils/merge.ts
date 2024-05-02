/** Merge a number of different {@link Uint8Array}s */
export function mergeArrays(...arrays: Uint8Array[]): Uint8Array {
  const chunks: [ offset: number, array: Uint8Array ][] = []

  const size = arrays.reduce((size, array) => {
    chunks.push([ size, array ])
    return size + array.length
  }, 0)

  const result = new Uint8Array(size)
  for (const [ offset, array ] of chunks) result.set(array, offset)
  return result
}
