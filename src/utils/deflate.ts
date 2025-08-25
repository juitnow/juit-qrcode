/** Compress a Uint8Array using "deflate" */
export function deflate(data: Uint8Array<ArrayBuffer>): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const chunks: Uint8Array<ArrayBuffer>[] = []

    const writer = new WritableStream<Uint8Array<ArrayBuffer>>({
      write: (chunk) => void chunks.push(chunk),
    })

    return new Blob([ data ]).stream() // stream the data
        .pipeThrough(new CompressionStream('deflate')) // compress it
        .pipeTo(writer) // write it to our "writer" collecting chungs
        .then(() => new Blob(chunks).arrayBuffer()) // merge the chunks
        .then((buffer) => new Uint8Array(buffer)) // make a new array
        .then(resolve, reject) // resolve or reject
  })
}
