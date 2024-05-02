import { crc32 } from '../src/utils/crc32'
import { calculateEcc } from '../src/utils/ecc'
import { mergeArrays } from '../src/utils/merge'

describe('Utility Methods', () => {
  // from https://github.com/froydnj/ironclad/blob/master/testing/test-vectors/crc32.testvec
  it('should produce the correct CRC32 checksums', () => {
    expect(crc32(Buffer.from(''))).toEqual(0x00000000)
    expect(crc32(Buffer.from('a'))).toEqual(0xe8b7be43)
    expect(crc32(Buffer.from('abc'))).toEqual(0x352441c2)
    expect(crc32(Buffer.from('message digest'))).toEqual(0x20159d7f)
    expect(crc32(Buffer.from('abcdefghijklmnopqrstuvwxyz'))).toEqual(0x4c2750bd)
    expect(crc32(Buffer.from('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'))).toEqual(0x1fc2e6d2)
    expect(crc32(Buffer.from('12345678901234567890123456789012345678901234567890123456789012345678901234567890'))).toEqual(0x7ca94a72)

    expect(crc32(Buffer.from('000abc000'), 3, 3)).toEqual(0x352441c2)
    expect(crc32(Buffer.from('000abc0'), 3, -1)).toEqual(0x352441c2)
    expect(crc32(Buffer.from('000abc'), 3)).toEqual(0x352441c2)
  })

  // Test cases lifted from https://github.com/tomerfiliba-org/reedsolomon
  it('should generate the correct Reed-Solomon error correction codes', () => {
    // b'\x01\x02\x03\x04,\x9d\x1c+=\xf8h\xfa\x98M'
    // 01020304 2c9d1c2b3df868fa984d
    expect(calculateEcc([ 0x01, 0x02, 0x03, 0x04 ], 10))
        .toEqual([ ...Buffer.from('2c9d1c2b3df868fa984d', 'hex') ])

    // b'hello world\xed%T\xc4\xfd\xfd\x89\xf3\xa8\xaa'
    // 68656c6c6f20776f726c64 ed2554c4fdfd89f3a8aa
    expect(calculateEcc([ ...Buffer.from('hello world') ], 10))
        .toEqual([ ...Buffer.from('ed2554c4fdfd89f3a8aa', 'hex') ])

    // b'hello world?Ay\xb2\xbc\xdc\x01q\xb9\xe3\xe2='
    // 68656c6c6f20776f726c64 3f4179b2bcdc0171b9e3e23d
    expect(calculateEcc([ ...Buffer.from('hello world') ], 12))
        .toEqual([ ...Buffer.from('3f4179b2bcdc0171b9e3e23d', 'hex') ])

    // b'\x00\xfa\xa1#UUU\xc0\x00\x00\x03T\x06D2\xc0(\x00\xa0\xfeU\x11\xbb\xe0|\rY\x13\x1fG'
    // 00faa123555555c000000354064432c02800 a0fe5511bbe07c0d59131f47
    expect(calculateEcc([ ...Buffer.from('00faa123555555c000000354064432c02800', 'hex') ], 12))
        .toEqual([ ...Buffer.from('a0fe5511bbe07c0d59131f47', 'hex') ])

    // 'a' * 245 => \x03\xa8\x9e\xa3\xde\x1f\xb2}\x08\xf1
    expect(calculateEcc(new Array(245).fill(0x61), 10))
        .toEqual([ ...Buffer.from('03a89ea3de1fb27d08f1', 'hex') ])

    // zero is... ZERO :-)
    expect(calculateEcc(new Array(245).fill(0), 10)).toEqual(new Array(10).fill(0))
    expect(calculateEcc(new Array(245).fill(0), 12)).toEqual(new Array(12).fill(0))
    expect(calculateEcc(new Array(245).fill(0), 14)).toEqual(new Array(14).fill(0))
  })

  it('should merge a number of different Uint8Arrays', () => {
    expect(mergeArrays(new Uint8Array(0), new Uint8Array([ 0x01, 0x02, 0x03 ]), new Uint8Array(0), new Uint8Array([ 0x04, 0x05, 0x06 ]), new Uint8Array(0)))
        .toEqual(new Uint8Array([ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06 ]))
    expect(mergeArrays(new Uint8Array([ 0x01, 0x02, 0x03 ]), new Uint8Array([ 0x04, 0x05, 0x06 ])))
        .toEqual(new Uint8Array([ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06 ]))
    expect(mergeArrays(new Uint8Array([ 0x01, 0x02, 0x03 ])))
        .toEqual(new Uint8Array([ 0x01, 0x02, 0x03 ]))
    expect(mergeArrays(new Uint8Array(0))).toEqual(new Uint8Array(0))
    expect(mergeArrays()).toEqual(new Uint8Array(0))
  })
})
