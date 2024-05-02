import fs from 'node:fs/promises'

import { generate, generatePdf, generateQrCode } from '../src/index'

describe('QR Code as a PDF', () => {
  it('should generate a PDF QR code for a simple message', async () => {
    const code = generateQrCode('foo')
    const pdf = await generatePdf(code, { margin: 0 })

    expect(new TextDecoder().decode(pdf.slice(0, 277))).toEqual([
      '%PDF-1.0\n', // newline after header
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Count 1 /Kids [ 3 0 R ] >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /Resources <<>> /Contents 4 0 R /MediaBox [ 0 0 189 189 ] >> endobj',
      '4 0 obj << /Length 572 /Filter /FlateDecode >> stream',
      '', // rest is the deflated content after a newline...
    ].join('\n'))

    expect(Buffer.from(pdf.slice(277 -1, 277 + 572 + 1)).toString('hex')).toEqual([ // include newlines
      '0a789c5d95498e24210c45f7798a3802660a384f4bad5a54dc7fdbe0f74da45a25f1b23', // newline before deflated data
      '09e0d31afb4fea6af7f9e4fbab25dcf756ffc2e585d48e0e76386d80af2cdb4990f6d6e',
      '1a5c1a158d6c68acc56dad256c6ed565f2b2b6feef01b7f7f39992263958a18cc579d0b',
      '51b6c6c0b55bbf54b6af6b228e860566841df9f2f7d7fbc4cda173df73bc0a9f6d24bd6',
      '5f26ed8b938a0a37210993040472679dde2756b7340e4c5906a345c1ffe559550a16cc0',
      '89392aaaf4d8d691433a74375ce47e1b91a1a8d0e65b0f4255ec64d09d3c2f744d709f9',
      'b468763f276cff7a8ecee67783f1d2e4a5c94bd549a6cfb3f4e9f316937b3e289455d89',
      'bf5c0484b4828008f57ab6f25f0f3712bcfa511528f6eb06a9610e70844cdd9fb9cf0e9',
      '7942431def617de7a7fb4993eb4bf47715fd3ea6d7f2f7101343520c89182607a72ae65',
      'd5176c3931beaf896549754dfcb923497c4940eafd8883972731d7b9d796f0e8f7612ac',
      '4218848aee587cce3db8bd9ed24b2e32e25bb89968496fa403e9b83af755a8042234e21',
      '13480fd2bd65b56333e333e333e73f8dcdc15b8bd028c448a29be19625df54ec83d3aea',
      'd28ab4222d219d2e9597858e6ba1512da1926cfdca79869dab730918265fbb6adc797ef',
      '5be56af352b139cd5fbe697bd796fb93d39f26be4d7c8af9281d0484ba89459289459d0',
      '2b1a8fa9ae33d08b160f9b1e01c063a827d103b713bee540e1708909a94c88aa55e8748',
      '99e147d04895a38ba19ddf848a06b31efc6bceb23a0b75fb330aeb89cf4336102e9dfcf',
      '3f3c6489860a', // newline after deflated data
    ].join(''))

    expect(new TextDecoder().decode(pdf.slice(277 + 572))).toEqual([
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
      '867',
      '%%EOF',
      '', // there's always a newline at the end of the file
    ].join('\n'))
  })

  it('should generate a PDF QR code', async () => {
    const pdf = await generate('https://www.juit.com/', 'pdf', { ecLevel: 'L', url: true, scale: 3 })

    await fs.writeFile('./test.pdf', pdf)

    expect(new TextDecoder().decode(pdf.slice(0, 275))).toEqual([
      '%PDF-1.0\n', // newline after header
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Count 1 /Kids [ 3 0 R ] >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /Resources <<>> /Contents 4 0 R /MediaBox [ 0 0 69 69 ] >> endobj',
      '4 0 obj << /Length 539 /Filter /FlateDecode >> stream',
      '', // rest is the deflated content after a newline...
    ].join('\n'))

    expect(Buffer.from(pdf.slice(275 - 1, 275 + 539 + 1)).toString('hex')).toEqual([ // include newlines
      '0a789c5d955172ee200885dfb38a2c41408daea73377fe8766ffaf05ce2169efb4e3972', // newline before deflated data
      '8103c82bf9dcdff2cc7affb9053f5bccf15f876c87008f03944b12c1deb4ed9417ba812',
      '54d03d063c54e1e103428e8a99a66e70caf4f7ab50fe82e58ae8941514d02d262d265cf',
      'da5c8189e54738319f876c8e530c0fd2f2cfb90eb3ee48a0fb4d8b139ff40e326dbdf14',
      '841f8cf96238eee70b9973aa06871eff50ad689c2f2af75a1cb42b4ececfca7032c3ca6',
      '02083512ac2405fcfc1d469115fbd4f66c484f481a20a346d276c376c378cae0761d41f',
      '1824b7d23a5d85be4267b91e8b164f776666ccf07f2d1ab7d8eafce171bdb1d272bdccc',
      'a99e0e74883cc5f917f43a913826db0fe3a8ca35e9575db18b5fd8a1e55576cac73f2c2',
      '34b150620445200c0189814962620b040b94587020364c8885a4898ef222584c4487bc8',
      '44164a2e328880977023ad84be13c14548182ca130cfe56ec738c7888feccf78940e339',
      'df78b8eb7d605f396625b6bcad78763bfd77f544634fb06036b2272e4c12332b613efd9',
      'aaeef9e36444164a9d03b27b4159e8c5726b5504f689d8abc107821ee85b8b827827111',
      '6a162046acd83953a099fbb3ec502b7527c49dd07640da51bd31d01a0395d25114fde4d',
      'ddc7171729aed4328260961f1e3ab2d3d15d5a248392e5cc02087f11c0cc7c05212f45c',
      'e961d0c3a0075b5c4b67c3c5cc808a56e06a58e3a788f5c6f2ab9b46714474125e0db9f',
      'aeff8011e6964a30a', // newline after deflated data
    ].join(''))

    expect(new TextDecoder().decode(pdf.slice(275 + 539))).toEqual([
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
      '832',
      '%%EOF',
      '', // there's always a newline at the end of the file
    ].join('\n'))
  })

  it('should generate a PDF QR code as a data URL', async () => {
    const pdf = await generate('https://www.juit.com/', 'pdfData', { ecLevel: 'L', url: true, scale: 3 })

    expect(pdf).toEqual([
      'data:application/pdf;base64,JVBERi0xLjAKCjEgMCBvYmogPDwgL1R5cGUgL0NhdGF',
      'sb2cgL1BhZ2VzIDIgMCBSID4+IGVuZG9iagoyIDAgb2JqIDw8IC9UeXBlIC9QYWdlcyAvQ2',
      '91bnQgMSAvS2lkcyBbIDMgMCBSIF0gPj4gZW5kb2JqCjMgMCBvYmogPDwgL1R5cGUgL1BhZ',
      '2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8Pj4gL0NvbnRlbnRzIDQgMCBSIC9NZWRp',
      'YUJveCBbIDAgMCA2OSA2OSBdID4+IGVuZG9iago0IDAgb2JqIDw8IC9MZW5ndGggNTM5IC9',
      'GaWx0ZXIgL0ZsYXRlRGVjb2RlID4+IHN0cmVhbQp4nF2VUXLuIAiF37OKLEFAja6nM3f+h2',
      'b/rwXOIWnvtOOXKBA8gr+dzf8sx6/7kFP1vM8V+HbIcAjwOUSxLB3rTtlBe6gSVNA9BjxU4',
      'eEDQo6KmaZucMr096tQ/oLliuiUFRTQLSYtJlz9pcgYnlRzgxn4dsjlMMD9Lyz7kOs+5IoP',
      'tNixOf9A4ybb3xSEH4z5Yjju5wuZc6oGhx7/UK1onC8q91octCtOzs/KcDLDymAgg1EqwkB',
      'fz8HUaRFfvU9mxIT0gaIKNG0nbDdsN4yuB2HUHxgkt9I6XYW+Qme5HosWT3dmZszwfy0at9',
      'jq/OFxvbHScr3Mypng50iDzF+Rf0OpE4JtsP46jKNelXXbGLX9ih5VV2ysc/LCNLFQYgRFI',
      'AwBiYFJYmILBAuUWHAgNkyIhaSJjvIiWExEh7yEQWSi4yiICXcCOthL4TwUVIGCyhMM/lbs',
      'c4x4iP7M94lA4znfeLjrfWBfOWYltryteHY7/Xf1RGNPsGA2sicuTBIzK2E+/Zqu7542REF',
      'kqdA7J7QVnoxXJrVQT2idirwQeCHuhbi4J4JxEWoWIEas2DlToJn7s+xQK3UnxJ3QdkDaUb',
      '0x0BoDldJRFP3k3dxxcXKa7UMoJglh8eOrLT0V1aJIOS5cwCCH8RwMx8BSEvRc6WHQw6AHW',
      '1xLZ8PFzICKVuBqWOOniPXG8qubRnFEdBJeDbn67/gBHmlkowplbmRzdHJlYW0KZW5kb2Jq',
      'CnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDA',
      'wMDAwMDU5IDAwMDAwIG4gCjAwMDAwMDAxMTggMDAwMDAgbiAKMDAwMDAwMDIyMSAwMDAwMC',
      'BuIAp0cmFpbGVyIDw8IC9Sb290IDEgMCBSIC9TaXplIDUgPj4Kc3RhcnR4cmVmCjgzMgolJ',
      'UVPRgo=',
    ].join(''))
  })
})
