import fs from 'node:fs/promises'

import { generate, generateSvg, qr } from '../src/index'

describe('QR Code as a SVG', () => {
  it('should generate a SVG QR code for a simple message', async () => {
    const code = generate('foo')
    const svg = await generateSvg(code, { margin: 0 })

    expect(svg).toEqual([
      '<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">',
      '<path d="',
      /* */ 'M0 0h7v7h-7zM11 0h2v1h-1v1h-1zM14 0h7v7h-7zM1 1v5h5v-5zM9 1h1v2h-',
      /* */ '1v2h1v1h-1v1h1v-1h1v2h1v1h2v-1h5v1h-1v2h1v1h-2v-3h-2v1h1v1h-1v1h-',
      /* */ '2v2h-1v-2h-2v1h-1v-1h-2v-1h1v-1h3v1h1v-1h-1v-1h-1v-1h-2v-6h1zM15 ',
      /* */ '1v5h5v-5zM2 2h3v3h-3zM12 2h1v3h-1zM16 2h3v3h-3zM11 5h1v1h-1zM12 6',
      /* */ 'h1v1h-1zM0 8h1v1h1v-1h5v1h-3v1h1v1h-3v1h-1v-1h-1zM7 9h1v1h-1zM20 ',
      /* */ '9h1v1h-1zM6 10h1v1h-1zM13 10v1h1v-1zM19 10h1v1h-1zM20 11h1v1h-1zM',
      /* */ '0 12h1v1h-1zM2 12h2v1h-2zM5 12h2v1h-2zM15 12h1v2h-1zM19 12h1v1h-1',
      /* */ 'zM8 13h1v1h-1zM10 13h1v1h-1zM17 13h1v2h-1v2h-1v-1h-1v-1h1v-1h1zM2',
      /* */ '0 13h1v1h-1zM0 14h7v7h-7zM11 14h1v1h-1zM13 14h1v1h-1zM19 14h1v1h1',
      /* */ 'v1h-2v1h-1v-2h1zM1 15v5h5v-5zM8 15h2v2h-1v2h-1zM2 16h3v3h-3zM11 1',
      /* */ '6h1v1h1v-1h1v1h1v1h1v1h-1v1h-2v1h-1v-1h-1v1h-3v-1h1v-1h3v-1h-1zM1',
      /* */ '7 17h1v1h-1zM13 18v1h1v-1zM17 19h1v1h-1zM15 20h1v1h-1zM18 20h2v1h',
      /* */ '-2z',
      '"/>',
      '</svg>',
    ].join(''))
  })

  it('should generate a SVG QR code', async () => {
    const svg = await qr('https://www.juit.com/', 'svg', { ecLevel: 'L', url: true, scale: 3 })

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
    const svg = await qr('https://www.juit.com/', 'svgData', { ecLevel: 'L', url: true, scale: 3 })

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
