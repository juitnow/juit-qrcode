import fs from 'node:fs/promises'

import { generate, generatePng, qr } from '../src/index'

describe('QR Code as a PNG', () => {
  it('should generate a PNG QR code for a simple message', async () => {
    const code = generate('foo')
    const png = await generatePng(code, { margin: 0 })

    expect(Buffer.from(png).toString('hex'))
        .toEqual([
          '89504e470d0a1a0a0000000d49484452000000150000001508000000008c7cfa4a0',
          '000006a49444154789c8d514702c0200ce2ff9fa62a9071ab5b8c801150e1296704',
          'c69eb8ed0d3a86fa0da4664c947f50f162f35a13896c0bd6656f98c3e742eb824c2',
          '7ebcd1ad7a953369c9afce8b21dd92402dc3932e2a4e46dcbe952ef0b05c4ef4217',
          '4ffe02331693dda41feb36d62ab99962450000000049454e44ae426082',
        ].join(''))
  })

  it('should generate a PNG QR code', async () => {
    const png = await qr('https://www.juit.com/', 'png', { ecLevel: 'L', url: true, scale: 3 })

    await fs.writeFile('./test.png', png)

    expect(Buffer.from(png).toString('hex'))
        .toEqual([
          '89504e470d0a1a0a0000000d494844520000004500000045080000000039e674f50',
          '00000bd49444154789cd5d4410ec2300c4451dfffd2edaac199b18d5458fccc0a99',
          'c943712be2fa4702a64495adf44cba2650d17ba6c93a3f3499ca76cf51f1e629ca2',
          '09eabf88783949c3529156f02154f267c23da84295fb3da6d01a648295f784d6614',
          'a8cce7f3b05c104d29a6e9f595f3f5cf8095eeccfc36d0944891932ed64d98d2a5d',
          'c85ec85a944155f90139faf788a6fc4e799d6952115bfad6ca1430f55f4d8bbbd00',
          '146d77ffa74825c72d47eb278d513ca20f8f19a8fc1e927203f422e4a892eba1180',
          '000000049454e44ae426082',
        ].join(''))
  })

  it('should generate a PNG QR code as a data URL', async () => {
    const png = await qr('https://www.juit.com/', 'pngData', { ecLevel: 'L', url: true, scale: 3 })

    expect(png).toEqual([
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAABFCAAAAAA55nT1AAAAv',
      'UlEQVR4nNXUQQ7CMAxEUd//0u2qwZmxjVRY/MwKmclDcSvi+kcCpkSVrfRMuiZQ0XumyTo/',
      'NJnKds9R8eYpyiCeq/iHg5ScNSkVbwIVTyZ8I9qEKV+z2m0BpkgpX3hNZhSozOfzsFwQTSm',
      'm6fWV8/XPgJXuzPw20JRIkZMu1k2Y0qXcheyFqUQVX5ATn694im/E55nWlSEVv61soUMPVf',
      'TYu70AFG13/6dIJcctR+snjVE8og+PGaj8HpJyA/Qi5KiS66EYAAAAAElFTkSuQmCC',
    ].join(''))
  })
})
