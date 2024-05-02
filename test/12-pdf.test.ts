import fs from 'node:fs/promises'

import { generate, generatePdf, generateQrCode } from '../src/index'

describe('QR Code as a PDF', () => {
  it('should generate a PDF QR code for a simple message', async () => {
    const code = generateQrCode('foo')
    const pdf = await generatePdf(code)

    expect(new TextDecoder().decode(pdf.slice(0, 277))).toEqual([
      '%PDF-1.0\n', // newline after header
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Count 1 /Kids [ 3 0 R ] >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /Resources <<>> /Contents 4 0 R /MediaBox [ 0 0 261 261 ] >> endobj',
      '4 0 obj << /Length 587 /Filter /FlateDecode >> stream',
      '', // rest is the deflated content after a newline...
    ].join('\n'))

    expect(Buffer.from(pdf.slice(277 -1, 277 + 587 + 1)).toString('hex')).toEqual([ // include newlines
      '0a789c5d955dcedc300845dfbf55640931fe5f4fa5aa0fcdfe5f6b730fce4c3552cec80', // newline before deflated data
      '66ce092cceb5ebfe9cf5fcf4fb9ac5ecf95d2e6dfcd34168bf0e727550c3a068b65b3bd',
      'cc9b555c1e431e56e5b11e1e6b3d8859b7eb73adf5b9d7ef438fb8226419a4c2198bb69',
      '95fdeac4345c82f07ebe373bfbeecbafb61e386c1bdbe123adcebebf0c3c27a70e76ee9',
      'a5c7992fbd12f7cbc27a30abb687897b05337904a9c361a679418f6b2f2b7907e9dde1f',
      'ffb8d73829d38503dcfa7e7938e4d55d8ca213d75993c4b77ee31d5b8262c7fb6b7baa8',
      '803a7b2c16dcc238d3d0c05ebf8f52ef1da31ddfafaefb29eb9f9fa29d8e3e5a28d3137',
      '565ee3c29433be81437b897c741f5c402452e202b1c289a30d4ee811eaf6efbec561257',
      'ee4516c6858c3eed75592457d6737c8e02ee734ac7a2b3335e724a964544b5f2ad72dda',
      '3708fc23d329639ea97553f3235656a68c077877687965bec4eed7e8ad8544a0b8db9c1',
      '9e9ecc1425a6279d0c3219c4bd8c0c8861fbdff33539899a2b8666eb71d518ea49cc00a',
      '724599811dd769935f570e87a60ea9220a1dac3846f3a35366a6cd438914b8a1a27ea94',
      '5427c9a9c41468fbe3dd7193c77d94e016038b81450f0bcbb28833376fee02a7ca0a86c',
      'a303eab91239a3b6d4d540912c46d4cdb893316871a0318898682a6bf44a60b4353d922',
      'efa9b4a7b21e4a094c250a865a01ba1a017861033e79809725e0550978d182aacbd78f1',
      'c5aa0cba1879a86c444f5bae4d0a3575d43cb77091cdf265fbe4a55be35e6a56a5cf8e6',
      'f0a96196ed62d899f5a210dafdfdf30f9541a1c40a', // newline after deflated data
    ].join(''))

    expect(new TextDecoder().decode(pdf.slice(277 + 587))).toEqual([
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
      '882',
      '%%EOF',
      '', // there's always a newline at the end of the file
    ].join('\n'))
  })

  it('should generate a PDF QR code', async () => {
    const pdf = await generate('https://www.juit.com/', 'pdf', { ecLevel: 'L', url: true, scale: 3, margin: 1 })

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
    const pdf = await generate('https://www.juit.com/', 'pdfData', { ecLevel: 'L', url: true, scale: 3, margin: 1 })

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
