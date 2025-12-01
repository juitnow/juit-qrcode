import { createWriteStream } from 'node:fs'
import { writeFile } from 'node:fs/promises'

import PDFDocument from 'pdfkit'

import { generate, generateQrCode, generateSvg, generateSvgPath } from '../src/index'

describe('QR Code as a SVG', () => {
  it('should generate a SVG QR code for a simple message', async () => {
    const code = generateQrCode('foo')
    const svg = await generateSvg(code)

    expect(svg).toEqual([
      '<svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29">',
      '<path d="',
      /* */ 'M4 4h7v7h-7zM15 4h2v1h-1v1h-1zM18 4h7v7h-7zM5 5v5h5v-5zM13 5h1v2h',
      /* */ '-1v2h1v1h-1v1h1v-1h1v2h1v1h2v-1h5v1h-1v2h1v1h-2v-3h-2v1h1v1h-1v1h',
      /* */ '-2v2h-1v-2h-2v1h-1v-1h-2v-1h1v-1h3v1h1v-1h-1v-1h-1v-1h-2v-6h1zM19',
      /* */ ' 5v5h5v-5zM6 6h3v3h-3zM16 6h1v3h-1zM20 6h3v3h-3zM15 9h1v1h-1zM16 ',
      /* */ '10h1v1h-1zM4 12h1v1h1v-1h5v1h-3v1h1v1h-3v1h-1v-1h-1zM11 13h1v1h-1',
      /* */ 'zM24 13h1v1h-1zM10 14h1v1h-1zM17 14v1h1v-1zM23 14h1v1h-1zM24 15h1',
      /* */ 'v1h-1zM4 16h1v1h-1zM6 16h2v1h-2zM9 16h2v1h-2zM19 16h1v2h-1zM23 16',
      /* */ 'h1v1h-1zM12 17h1v1h-1zM14 17h1v1h-1zM21 17h1v2h-1v2h-1v-1h-1v-1h1',
      /* */ 'v-1h1zM24 17h1v1h-1zM4 18h7v7h-7zM15 18h1v1h-1zM17 18h1v1h-1zM23 ',
      /* */ '18h1v1h1v1h-2v1h-1v-2h1zM5 19v5h5v-5zM12 19h2v2h-1v2h-1zM6 20h3v3',
      /* */ 'h-3zM15 20h1v1h1v-1h1v1h1v1h1v1h-1v1h-2v1h-1v-1h-1v1h-3v-1h1v-1h3',
      /* */ 'v-1h-1zM21 21h1v1h-1zM17 22v1h1v-1zM21 23h1v1h-1zM19 24h1v1h-1zM2',
      /* */ '2 24h2v1h-2z"/>',
      '</svg>',
    ].join(''))
  })

  it('should generate a SVG QR code', async () => {
    const svg = await generate('https://www.juit.com/', 'svg', { ecLevel: 'L', url: true, scale: 3, margin: 1 })

    await writeFile('./test.svg', svg)

    expect(svg).toEqual([
      '<svg xmlns="http://www.w3.org/2000/svg" width="69" height="69" viewBox="0 0 23 23">',
      '<path d="',
      /* */ 'M1 1h7v7h-7zM12 1h2v3h-1v-2h-1zM15 1h7v7h-7zM2 2v5h5v-5zM11 2h1v3',
      /* */ 'h-1zM16 2v5h5v-5zM3 3h3v3h-3zM17 3h3v3h-3zM9 4h1v1h1v2h-1v-1h-1zM',
      /* */ '12 5h2v4h-1v1h1v1h-2v-3h1v-1h-1zM9 7h1v1h-1zM11 7h1v1h-1zM1 9h2v1',
      /* */ 'h-1v1h-1zM6 9h3v1h-2v1h-3v-1h2zM17 9h2v1h-2zM10 10h1v1h1v2h-2zM16',
      /* */ ' 10h1v1h1v1h-2zM7 11h2v2h-1v-1h-1zM14 11h1v2h3v-1h3v1h1v3h-1v-1h-',
      /* */ '1v4h-1v1h-1v-2h1v-1h-3v-1h1v-1h1v-1h-2v1h-1v4h-1v-1h-1v1h-1v1h-2v',
      /* */ '-1h1v-2h3v-4h-1v-1h1zM21 11h1v1h-1zM5 12h1v1h-1zM1 13h4v1h-4zM6 1',
      /* */ '3h2v1h-2zM9 13h1v1h1v2h-1v1h-1zM12 13h1v1h-1zM19 13v1h1v-1zM1 15h',
      /* */ '7v7h-7zM12 15h1v1h-1zM2 16v5h5v-5zM3 17h3v3h-3zM21 17h1v1h-1zM16 ',
      /* */ '18h1v1h-1zM15 19h1v1h1v1h-1v1h-1zM20 19h2v2h-1v-1h-1zM9 20h1v2h-1',
      /* */ 'zM12 20h1v1h-1zM19 20h1v1h-1zM13 21h1v1h-1zM17 21h2v1h-2z',
      '"/>',
      '</svg>',
    ].join(''))
  })

  it('should generate a SVG QR code as a data URL', async () => {
    const svg = await generate('https://www.juit.com/', 'svgData', { ecLevel: 'L', url: true, scale: 3, margin: 1 })

    expect(svg).toEqual([
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwM',
      'C9zdmciIHdpZHRoPSI2OSIgaGVpZ2h0PSI2OSIgdmlld0JveD0iMCAwIDIzIDIzIj48cGF0',
      'aCBkPSJNMSAxaDd2N2gtN3pNMTIgMWgydjNoLTF2LTJoLTF6TTE1IDFoN3Y3aC03ek0yIDJ',
      '2NWg1di01ek0xMSAyaDF2M2gtMXpNMTYgMnY1aDV2LTV6TTMgM2gzdjNoLTN6TTE3IDNoM3',
      'YzaC0zek05IDRoMXYxaDF2MmgtMXYtMWgtMXpNMTIgNWgydjRoLTF2MWgxdjFoLTJ2LTNoM',
      'XYtMWgtMXpNOSA3aDF2MWgtMXpNMTEgN2gxdjFoLTF6TTEgOWgydjFoLTF2MWgtMXpNNiA5',
      'aDN2MWgtMnYxaC0zdi0xaDJ6TTE3IDloMnYxaC0yek0xMCAxMGgxdjFoMXYyaC0yek0xNiA',
      'xMGgxdjFoMXYxaC0yek03IDExaDJ2MmgtMXYtMWgtMXpNMTQgMTFoMXYyaDN2LTFoM3YxaD',
      'F2M2gtMXYtMWgtMXY0aC0xdjFoLTF2LTJoMXYtMWgtM3YtMWgxdi0xaDF2LTFoLTJ2MWgtM',
      'XY0aC0xdi0xaC0xdjFoLTF2MWgtMnYtMWgxdi0yaDN2LTRoLTF2LTFoMXpNMjEgMTFoMXYx',
      'aC0xek01IDEyaDF2MWgtMXpNMSAxM2g0djFoLTR6TTYgMTNoMnYxaC0yek05IDEzaDF2MWg',
      'xdjJoLTF2MWgtMXpNMTIgMTNoMXYxaC0xek0xOSAxM3YxaDF2LTF6TTEgMTVoN3Y3aC03ek',
      '0xMiAxNWgxdjFoLTF6TTIgMTZ2NWg1di01ek0zIDE3aDN2M2gtM3pNMjEgMTdoMXYxaC0xe',
      'k0xNiAxOGgxdjFoLTF6TTE1IDE5aDF2MWgxdjFoLTF2MWgtMXpNMjAgMTloMnYyaC0xdi0x',
      'aC0xek05IDIwaDF2MmgtMXpNMTIgMjBoMXYxaC0xek0xOSAyMGgxdjFoLTF6TTEzIDIxaDF',
      '2MWgtMXpNMTcgMjFoMnYxaC0yeiIvPjwvc3ZnPg==',
    ].join(''))
  })

  it('should generate a SVG QR code and use it with PDFKit', () => {
    const code = generateQrCode('https://www.juit.com/', { ecLevel: 'L', url: true })
    const path = generateSvgPath(code)

    // first check our path...
    expect(path).toEqual([
      'M0 0,h,7,v,7,h,-7,z,M11 0,h,2,v,3,h,-1,v,-2,h,-1,z,M14 0,h,7,v,7,h,-7,z',
      ',M1 1,v,5,h,5,v,-5,z,M10 1,h,1,v,3,h,-1,z,M15 1,v,5,h,5,v,-5,z,M2 2,h,3',
      ',v,3,h,-3,z,M16 2,h,3,v,3,h,-3,z,M8 3,h,1,v,1,h,1,v,2,h,-1,v,-1,h,-1,z,',
      'M11 4,h,2,v,4,h,-1,v,1,h,1,v,1,h,-2,v,-3,h,1,v,-1,h,-1,z,M8 6,h,1,v,1,h',
      ',-1,z,M10 6,h,1,v,1,h,-1,z,M0 8,h,2,v,1,h,-1,v,1,h,-1,z,M5 8,h,3,v,1,h,',
      '-2,v,1,h,-3,v,-1,h,2,z,M16 8,h,2,v,1,h,-2,z,M9 9,h,1,v,1,h,1,v,2,h,-2,z',
      ',M15 9,h,1,v,1,h,1,v,1,h,-2,z,M6 10,h,2,v,2,h,-1,v,-1,h,-1,z,M13 10,h,1',
      ',v,2,h,3,v,-1,h,3,v,1,h,1,v,3,h,-1,v,-1,h,-1,v,4,h,-1,v,1,h,-1,v,-2,h,1',
      ',v,-1,h,-3,v,-1,h,1,v,-1,h,1,v,-1,h,-2,v,1,h,-1,v,4,h,-1,v,-1,h,-1,v,1,',
      'h,-1,v,1,h,-2,v,-1,h,1,v,-2,h,3,v,-4,h,-1,v,-1,h,1,z,M20 10,h,1,v,1,h,-',
      '1,z,M4 11,h,1,v,1,h,-1,z,M0 12,h,4,v,1,h,-4,z,M5 12,h,2,v,1,h,-2,z,M8 1',
      '2,h,1,v,1,h,1,v,2,h,-1,v,1,h,-1,z,M11 12,h,1,v,1,h,-1,z,M18 12,v,1,h,1,',
      'v,-1,z,M0 14,h,7,v,7,h,-7,z,M11 14,h,1,v,1,h,-1,z,M1 15,v,5,h,5,v,-5,z,',
      'M2 16,h,3,v,3,h,-3,z,M20 16,h,1,v,1,h,-1,z,M15 17,h,1,v,1,h,-1,z,M14 18',
      ',h,1,v,1,h,1,v,1,h,-1,v,1,h,-1,z,M19 18,h,2,v,2,h,-1,v,-1,h,-1,z,M8 19,',
      'h,1,v,2,h,-1,z,M11 19,h,1,v,1,h,-1,z,M18 19,h,1,v,1,h,-1,z,M12 20,h,1,v',
      ',1,h,-1,z,M16 20,h,2,v,1,h,-2,z',
    ].join(''))

    // measurements...
    const dpcm = 72 / 2.54 // PDFKit uses 72dpi (inches) we want metric!
    const size = 10 * dpcm // 10 cm (size of our QR code) in dots
    const scale = size / code.size // scale factor for our QR code to be 10 cm
    const x = ((21 - 10) / 2) * dpcm // center horizontally
    const y = ((29.7 - 10) / 2) * dpcm // center vertically

    // create a PDF document and stream it to "test-pdfkit.pdf"
    const document = new PDFDocument({ size: 'A4' })
    const stream = createWriteStream('test-pdfkit.pdf')
    document.pipe(stream)

    // smack the 10cm QR code right in the middle of the page
    document
        .translate(x, y) // move to x = 5.5cm, y = 9.85cm
        .scale(scale) // scale our QR code to 10cm width and height
        .path(path) // draw our QR code smack in the middle of the page
        .fill('black') // fill our QR code in black
        .end() // done with our simple doc

    // wait for PDFKit to actch up...
    return new Promise<void>((resolve, reject) => {
      stream.on('error', reject)
      stream.on('finish', resolve)
    })
  })
})
