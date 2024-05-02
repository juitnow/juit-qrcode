import fs from 'node:fs/promises'

import { generate, generateQrCode, generateSvg } from '../src/index'

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

    await fs.writeFile('./test.svg', svg)

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
})
