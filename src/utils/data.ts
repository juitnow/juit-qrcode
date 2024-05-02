export function generateDataUri(data: string | Uint8Array, mimeType: string): string {
  // Do not use the text decoder here, otherwise UTF8 sequences will be
  // represented in proper characters, and we might loose some data...
  const string = typeof data === 'string' ? data : String.fromCharCode(...data)
  const encoded = btoa(string)
  return `data:${mimeType};base64,${encoded}`
}
