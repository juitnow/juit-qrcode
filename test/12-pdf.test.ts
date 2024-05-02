import { writeFile } from 'node:fs/promises'
import { inflate } from 'node:zlib'

import { generate, generatePdf, generateQrCode } from '../src/index'

describe('QR Code as a PDF', () => {
  let data: Uint8Array | undefined = undefined

  it('should generate a PDF QR code for a simple message', async () => {
    const code = generateQrCode('foo')
    const pdf = await generatePdf(code)

    const preamble = new TextDecoder().decode(pdf.slice(0, 277)).split('\n')
    expect(preamble).toEqual([
      '%PDF-1.0', // newline after header
      '', // newline after header
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Count 1 /Kids [ 3 0 R ] >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /Resources <<>> /Contents 4 0 R /MediaBox [ 0 0 261 261 ] >> endobj',
      expect.toMatch(/^4 0 obj << \/Length \d\d\d \/Filter \/FlateDecode >> stream$/),
      '', // rest is the deflated content after a newline...
    ])

    const length = parseInt(preamble[5]!.substring(19, 22))

    const inflated = await new Promise<Buffer>((resolve, reject) => {
      const buffer = Buffer.from(pdf.slice(277, 277 + length))
      inflate(buffer, (error, result) => {
        if (error) return reject(error)
        return resolve(result)
      })
    })

    expect(inflated.toString('utf-8')).toEqual([
      '9 0 0 9 0 0 cm',
      '4 25 m 11 25 l 11 18 l 4 18 l h',
      '15 25 m 17 25 l 17 24 l 16 24 l 16 23 l 15 23 l h',
      '18 25 m 25 25 l 25 18 l 18 18 l h',
      '5 24 m 5 19 l 10 19 l 10 24 l h',
      '13 24 m 14 24 l 14 22 l 13 22 l 13 20 l 14 20 l 14 19 l 13 19 l 13 18 l 14 18 l 14 19 l 15 19 l 15 17 l 16 17 l 16 16 l 18 16 l 18 17 l 23 17 l 23 16 l 22 16 l 22 14 l 23 14 l 23 13 l 21 13 l 21 16 l 19 16 l 19 15 l 20 15 l 20 14 l 19 14 l 19 13 l 17 13 l 17 11 l 16 11 l 16 13 l 14 13 l 14 12 l 13 12 l 13 13 l 11 13 l 11 14 l 12 14 l 12 15 l 15 15 l 15 14 l 16 14 l 16 15 l 15 15 l 15 16 l 14 16 l 14 17 l 12 17 l 12 23 l 13 23 l h',
      '19 24 m 19 19 l 24 19 l 24 24 l h',
      '6 23 m 9 23 l 9 20 l 6 20 l h',
      '16 23 m 17 23 l 17 20 l 16 20 l h',
      '20 23 m 23 23 l 23 20 l 20 20 l h',
      '15 20 m 16 20 l 16 19 l 15 19 l h',
      '16 19 m 17 19 l 17 18 l 16 18 l h',
      '4 17 m 5 17 l 5 16 l 6 16 l 6 17 l 11 17 l 11 16 l 8 16 l 8 15 l 9 15 l 9 14 l 6 14 l 6 13 l 5 13 l 5 14 l 4 14 l h',
      '11 16 m 12 16 l 12 15 l 11 15 l h',
      '24 16 m 25 16 l 25 15 l 24 15 l h',
      '10 15 m 11 15 l 11 14 l 10 14 l h',
      '17 15 m 17 14 l 18 14 l 18 15 l h',
      '23 15 m 24 15 l 24 14 l 23 14 l h',
      '24 14 m 25 14 l 25 13 l 24 13 l h',
      '4 13 m 5 13 l 5 12 l 4 12 l h',
      '6 13 m 8 13 l 8 12 l 6 12 l h',
      '9 13 m 11 13 l 11 12 l 9 12 l h',
      '19 13 m 20 13 l 20 11 l 19 11 l h',
      '23 13 m 24 13 l 24 12 l 23 12 l h',
      '12 12 m 13 12 l 13 11 l 12 11 l h',
      '14 12 m 15 12 l 15 11 l 14 11 l h',
      '21 12 m 22 12 l 22 10 l 21 10 l 21 8 l 20 8 l 20 9 l 19 9 l 19 10 l 20 10 l 20 11 l 21 11 l h',
      '24 12 m 25 12 l 25 11 l 24 11 l h',
      '4 11 m 11 11 l 11 4 l 4 4 l h',
      '15 11 m 16 11 l 16 10 l 15 10 l h',
      '17 11 m 18 11 l 18 10 l 17 10 l h',
      '23 11 m 24 11 l 24 10 l 25 10 l 25 9 l 23 9 l 23 8 l 22 8 l 22 10 l 23 10 l h',
      '5 10 m 5 5 l 10 5 l 10 10 l h',
      '12 10 m 14 10 l 14 8 l 13 8 l 13 6 l 12 6 l h',
      '6 9 m 9 9 l 9 6 l 6 6 l h',
      '15 9 m 16 9 l 16 8 l 17 8 l 17 9 l 18 9 l 18 8 l 19 8 l 19 7 l 20 7 l 20 6 l 19 6 l 19 5 l 17 5 l 17 4 l 16 4 l 16 5 l 15 5 l 15 4 l 12 4 l 12 5 l 13 5 l 13 6 l 16 6 l 16 7 l 15 7 l h',
      '21 8 m 22 8 l 22 7 l 21 7 l h',
      '17 7 m 17 6 l 18 6 l 18 7 l h',
      '21 6 m 22 6 l 22 5 l 21 5 l h',
      '19 5 m 20 5 l 20 4 l 19 4 l h',
      '22 5 m 24 5 l 24 4 l 22 4 l h',
      'f',
      '', // final newline
    ].join('\n'))

    expect(new TextDecoder().decode(pdf.slice(277 + length))).toEqual([
      '', // the deflated content ends and a newline is added
      'endstream',
      'endobj',
      'xref',
      '0 5',
      '0000000000 65535 f ',
      '0000000010 00000 n ',
      '0000000059 00000 n ',
      '0000000118 00000 n ',
      '0000000223 00000 n ',
      'trailer << /Root 1 0 R /Size 5 >>',
      'startxref',
      `${length + 295}`,
      '%%EOF',
      '', // there's always a newline at the end of the file
    ].join('\n'))
  })

  it('should generate a PDF QR code', async () => {
    const pdf = await generate('https://www.juit.com/', 'pdf', { ecLevel: 'L', url: true, scale: 3, margin: 1 })

    await writeFile('./test.pdf', pdf)

    const preamble = new TextDecoder().decode(pdf.slice(0, 275)).split('\n')
    expect(preamble).toEqual([
      '%PDF-1.0', // newline after header
      '', // newline after header
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Count 1 /Kids [ 3 0 R ] >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /Resources <<>> /Contents 4 0 R /MediaBox [ 0 0 69 69 ] >> endobj',
      expect.toMatch(/^4 0 obj << \/Length \d\d\d \/Filter \/FlateDecode >> stream$/),
      '', // rest is the deflated content after a newline...
    ])

    const length = parseInt(preamble[5]!.substring(19, 22))

    const inflated = await new Promise<Buffer>((resolve, reject) => {
      const buffer = Buffer.from(pdf.slice(275, 275 + length))
      inflate(buffer, (error, result) => {
        if (error) return reject(error)
        return resolve(result)
      })
    })

    expect(inflated.toString('utf-8')).toEqual([
      '3 0 0 3 0 0 cm',
      '1 22 m 8 22 l 8 15 l 1 15 l h',
      '12 22 m 14 22 l 14 19 l 13 19 l 13 21 l 12 21 l h',
      '15 22 m 22 22 l 22 15 l 15 15 l h',
      '2 21 m 2 16 l 7 16 l 7 21 l h',
      '11 21 m 12 21 l 12 18 l 11 18 l h',
      '16 21 m 16 16 l 21 16 l 21 21 l h',
      '3 20 m 6 20 l 6 17 l 3 17 l h',
      '17 20 m 20 20 l 20 17 l 17 17 l h',
      '9 19 m 10 19 l 10 18 l 11 18 l 11 16 l 10 16 l 10 17 l 9 17 l h',
      '12 18 m 14 18 l 14 14 l 13 14 l 13 13 l 14 13 l 14 12 l 12 12 l 12 15 l 13 15 l 13 16 l 12 16 l h',
      '9 16 m 10 16 l 10 15 l 9 15 l h',
      '11 16 m 12 16 l 12 15 l 11 15 l h',
      '1 14 m 3 14 l 3 13 l 2 13 l 2 12 l 1 12 l h',
      '6 14 m 9 14 l 9 13 l 7 13 l 7 12 l 4 12 l 4 13 l 6 13 l h',
      '17 14 m 19 14 l 19 13 l 17 13 l h',
      '10 13 m 11 13 l 11 12 l 12 12 l 12 10 l 10 10 l h',
      '16 13 m 17 13 l 17 12 l 18 12 l 18 11 l 16 11 l h',
      '7 12 m 9 12 l 9 10 l 8 10 l 8 11 l 7 11 l h',
      '14 12 m 15 12 l 15 10 l 18 10 l 18 11 l 21 11 l 21 10 l 22 10 l 22 7 l 21 7 l 21 8 l 20 8 l 20 4 l 19 4 l 19 3 l 18 3 l 18 5 l 19 5 l 19 6 l 16 6 l 16 7 l 17 7 l 17 8 l 18 8 l 18 9 l 16 9 l 16 8 l 15 8 l 15 4 l 14 4 l 14 5 l 13 5 l 13 4 l 12 4 l 12 3 l 10 3 l 10 4 l 11 4 l 11 6 l 14 6 l 14 10 l 13 10 l 13 11 l 14 11 l h',
      '21 12 m 22 12 l 22 11 l 21 11 l h',
      '5 11 m 6 11 l 6 10 l 5 10 l h',
      '1 10 m 5 10 l 5 9 l 1 9 l h',
      '6 10 m 8 10 l 8 9 l 6 9 l h',
      '9 10 m 10 10 l 10 9 l 11 9 l 11 7 l 10 7 l 10 6 l 9 6 l h',
      '12 10 m 13 10 l 13 9 l 12 9 l h',
      '19 10 m 19 9 l 20 9 l 20 10 l h',
      '1 8 m 8 8 l 8 1 l 1 1 l h',
      '12 8 m 13 8 l 13 7 l 12 7 l h',
      '2 7 m 2 2 l 7 2 l 7 7 l h',
      '3 6 m 6 6 l 6 3 l 3 3 l h',
      '21 6 m 22 6 l 22 5 l 21 5 l h',
      '16 5 m 17 5 l 17 4 l 16 4 l h',
      '15 4 m 16 4 l 16 3 l 17 3 l 17 2 l 16 2 l 16 1 l 15 1 l h',
      '20 4 m 22 4 l 22 2 l 21 2 l 21 3 l 20 3 l h',
      '9 3 m 10 3 l 10 1 l 9 1 l h',
      '12 3 m 13 3 l 13 2 l 12 2 l h',
      '19 3 m 20 3 l 20 2 l 19 2 l h',
      '13 2 m 14 2 l 14 1 l 13 1 l h',
      '17 2 m 19 2 l 19 1 l 17 1 l h',
      'f',
      '', // final newline
    ].join('\n'))

    expect(new TextDecoder().decode(pdf.slice(275 + length))).toEqual([
      '', // the deflated content ends and a newline is added
      'endstream',
      'endobj',
      'xref',
      '0 5',
      '0000000000 65535 f ',
      '0000000010 00000 n ',
      '0000000059 00000 n ',
      '0000000118 00000 n ',
      '0000000221 00000 n ',
      'trailer << /Root 1 0 R /Size 5 >>',
      'startxref',
      `${length + 293}`,
      '%%EOF',
      '', // there's always a newline at the end of the file
    ].join('\n'))

    // used for the data URL test
    data = pdf
  })

  it('should generate a PDF QR code as a data URL', async () => {
    if (! data) return skip()

    const pdf = await generate('https://www.juit.com/', 'pdfData', { ecLevel: 'L', url: true, scale: 3, margin: 1 })
    expect(pdf).toMatch(/^data:application\/pdf;base64,/)

    expect(new Uint8Array(Buffer.from(pdf.substring(28), 'base64'))).toEqual(data)
  })
})
