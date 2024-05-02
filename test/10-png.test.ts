import fs from 'node:fs/promises'

import { generate, generatePng, generateQrCode } from '../src/index'

describe('QR Code as a PNG', () => {
  it('should generate a PNG QR code for a simple message', async () => {
    const code = generateQrCode('foo')
    const png = await generatePng(code)

    expect(Buffer.from(png).toString('hex'))
        .toEqual([
          '89504e470d0a1a0a0000000d494844520000001d0000001d080000000073f838d30',
          '000008049444154789cb551d10a002108dbffffb447794e6d720f074984329b5bc2',
          'be0277517878daaa24c03a2815afd5bb6e6ff04a50fb8346cf38f7558978d934d31',
          'e0efb3977235b35d845e637f71432b7ba46951637f5885f4b461caf2811fdb76547',
          '5688e5af728bd38e927ada02fd8e68f2cb5ca3df86c68eb8420c7e25eea10f60db6',
          '4b8809b14f70000000049454e44ae426082',
        ].join(''))
  })

  it('should generate a PNG QR code', async () => {
    const png = await generate('https://www.juit.com/', 'png', { ecLevel: 'L', url: true, scale: 3, margin: 1 })

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
    const png = await generate('https://www.juit.com/', 'pngData', { ecLevel: 'L', url: true, scale: 3, margin: 1 })

    expect(png).toEqual([
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAABFCAAAAAA55nT1AAAAv',
      'UlEQVR4nNXUQQ7CMAxEUd//0u2qwZmxjVRY/MwKmclDcSvi+kcCpkSVrfRMuiZQ0XumyTo/',
      'NJnKds9R8eYpyiCeq/iHg5ScNSkVbwIVTyZ8I9qEKV+z2m0BpkgpX3hNZhSozOfzsFwQTSm',
      'm6fWV8/XPgJXuzPw20JRIkZMu1k2Y0qXcheyFqUQVX5ATn694im/E55nWlSEVv61soUMPVf',
      'TYu70AFG13/6dIJcctR+snjVE8og+PGaj8HpJyA/Qi5KiS66EYAAAAAElFTkSuQmCC',
    ].join(''))
  })
})
