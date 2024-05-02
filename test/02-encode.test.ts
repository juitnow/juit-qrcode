import { encodeQRCodeData } from '../src/encode'

const F = false
const T = true

describe('QR Code Message Encoder', () => {
  it('should encode a numeric string', () => {
    expect(encodeQRCodeData('1234567890', false)).toEqual({
      data27: [
        F, F, F, T, F, F, F, F, F, F, F, F, F, F, T, F, T, F, F, F, F, T, T, T,
        T, F, T, T, F, T, T, T, F, F, T, F, F, F, T, T, F, F, F, T, F, T, F, T,
        F, F, F, F,
      ],
      data10: [
        F, F, F, T, F, F, F, F, F, F, F, F, T, F, T, F, F, F, F, T, T, T, T, F,
        T, T, F, T, T, T, F, F, T, F, F, F, T, T, F, F, F, T, F, T, F, T, F, F,
        F, F,
      ],
      data1: [
        F, F, F, T, F, F, F, F, F, F, T, F, T, F, F, F, F, T, T, T, T, F, T, T,
        F, T, T, T, F, F, T, F, F, F, T, T, F, F, F, T, F, T, F, T, F, F, F, F,
      ],
    })
  })

  it('should encode a basic string', () => {
    expect(encodeQRCodeData('HELLO WORLD', false)).toEqual({
      data27: [
        F, F, T, F, F, F, F, F, F, F, F, F, F, T, F, T, T, F, T, T, F, F, F, F,
        T, F, T, T, F, T, T, T, T, F, F, F, T, T, F, T, F, F, F, T, F, T, T, T,
        F, F, T, F, T, T, F, T, T, T, F, F, F, T, F, F, T, T, F, T, F, T, F, F,
        F, F, T, T, F, T,
      ],
      data10: [
        F, F, T, F, F, F, F, F, F, F, F, T, F, T, T, F, T, T, F, F, F, F, T, F,
        T, T, F, T, T, T, T, F, F, F, T, T, F, T, F, F, F, T, F, T, T, T, F, F,
        T, F, T, T, F, T, T, T, F, F, F, T, F, F, T, T, F, T, F, T, F, F, F, F,
        T, T, F, T,
      ],
      data1: [
        F, F, T, F, F, F, F, F, F, T, F, T, T, F, T, T, F, F, F, F, T, F, T, T,
        F, T, T, T, T, F, F, F, T, T, F, T, F, F, F, T, F, T, T, T, F, F, T, F,
        T, T, F, T, T, T, F, F, F, T, F, F, T, T, F, T, F, T, F, F, F, F, T, T,
        F, T,
      ],
    })
  })

  it('should encode a complex string', () => {
    expect(encodeQRCodeData('Hello, world!', false)).toEqual({
      data27: [
        F, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, T, F, T, F, T, F, F,
        T, F, F, F, F, T, T, F, F, T, F, T, F, T, T, F, T, T, F, F, F, T, T, F,
        T, T, F, F, F, T, T, F, T, T, T, T, F, F, T, F, T, T, F, F, F, F, T, F,
        F, F, F, F, F, T, T, T, F, T, T, T, F, T, T, F, T, T, T, T, F, T, T, T,
        F, F, T, F, F, T, T, F, T, T, F, F, F, T, T, F, F, T, F, F, F, F, T, F,
        F, F, F, T,
      ],
      data10: [
        F, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, T, F, T, F, T, F, F,
        T, F, F, F, F, T, T, F, F, T, F, T, F, T, T, F, T, T, F, F, F, T, T, F,
        T, T, F, F, F, T, T, F, T, T, T, T, F, F, T, F, T, T, F, F, F, F, T, F,
        F, F, F, F, F, T, T, T, F, T, T, T, F, T, T, F, T, T, T, T, F, T, T, T,
        F, F, T, F, F, T, T, F, T, T, F, F, F, T, T, F, F, T, F, F, F, F, T, F,
        F, F, F, T,
      ],
      data1: [
        F, T, F, F, F, F, F, F, T, T, F, T, F, T, F, F, T, F, F, F, F, T, T, F,
        F, T, F, T, F, T, T, F, T, T, F, F, F, T, T, F, T, T, F, F, F, T, T, F,
        T, T, T, T, F, F, T, F, T, T, F, F, F, F, T, F, F, F, F, F, F, T, T, T,
        F, T, T, T, F, T, T, F, T, T, T, T, F, T, T, T, F, F, T, F, F, T, T, F,
        T, T, F, F, F, T, T, F, F, T, F, F, F, F, T, F, F, F, F, T,
      ],
    })
  })

  it('should encode a simple url', () => {
    expect(encodeQRCodeData('http://www.juit.com/', true)).toEqual({
      data27: [
        F, F, T, F, F, F, F, F, F, F, F, F, T, F, T, F, F, F, T, T, F, F, F, T,
        T, F, T, F, T, F, T, F, F, T, T, F, F, T, F, T, T, T, T, T, T, F, F, T,
        T, T, T, T, T, T, F, T, F, T, T, T, T, T, F, T, T, T, F, F, F, F, F, F,
        T, T, T, F, T, T, T, F, T, F, T, T, F, T, F, T, F, T, T, F, F, F, T, F,
        T, F, T, F, F, F, F, T, T, F, T, F, F, F, T, T, F, T, F, F, T, F, F, F,
        F, F, F, T, F, F, T,
      ],
      data10: [
        F, F, T, F, F, F, F, F, F, F, T, F, T, F, F, F, T, T, F, F, F, T, T, F,
        T, F, T, F, T, F, F, T, T, F, F, T, F, T, T, T, T, T, T, F, F, T, T, T,
        T, T, T, T, F, T, F, T, T, T, T, T, F, T, T, T, F, F, F, F, F, F, T, T,
        T, F, T, T, T, F, T, F, T, T, F, T, F, T, F, T, T, F, F, F, T, F, T, F,
        T, F, F, F, F, T, T, F, T, F, F, F, T, T, F, T, F, F, T, F, F, F, F, F,
        F, T, F, F, T,
      ],
      data1: [
        F, F, T, F, F, F, F, F, T, F, T, F, F, F, T, T, F, F, F, T, T, F, T, F,
        T, F, T, F, F, T, T, F, F, T, F, T, T, T, T, T, T, F, F, T, T, T, T, T,
        T, T, F, T, F, T, T, T, T, T, F, T, T, T, F, F, F, F, F, F, T, T, T, F,
        T, T, T, F, T, F, T, T, F, T, F, T, F, T, T, F, F, F, T, F, T, F, T, F,
        F, F, F, T, T, F, T, F, F, F, T, T, F, T, F, F, T, F, F, F, F, F, F, T,
        F, F, T,
      ],
    })
  })

  it('should encode a complex url', () => {
    expect(encodeQRCodeData('http://www.juit.com/en/dishes', true)).toEqual({
      data27: [
        F, F, T, F, F, F, F, F, F, F, F, F, T, F, T, F, F, F, T, T, F, F, F, T,
        T, F, T, F, T, F, T, F, F, T, T, F, F, T, F, T, T, T, T, T, T, F, F, T,
        T, T, T, T, T, T, F, T, F, T, T, T, T, T, F, T, T, T, F, F, F, F, F, F,
        T, T, T, F, T, T, T, F, T, F, T, T, F, T, F, T, F, T, T, F, F, F, T, F,
        T, F, T, F, F, F, F, T, T, F, T, F, F, F, T, T, F, T, F, F, T, F, F, F,
        F, F, F, T, F, F, T, F, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T,
        F, F, T, F, T, T, F, F, T, F, T, F, T, T, F, T, T, T, F, F, F, T, F, T,
        T, T, T, F, T, T, F, F, T, F, F, F, T, T, F, T, F, F, T, F, T, T, T, F,
        F, T, T, F, T, T, F, T, F, F, F, F, T, T, F, F, T, F, T, F, T, T, T, F,
        F, T, T,
      ],
      data10: [
        F, F, T, F, F, F, F, F, F, F, T, F, T, F, F, F, T, T, F, F, F, T, T, F,
        T, F, T, F, T, F, F, T, T, F, F, T, F, T, T, T, T, T, T, F, F, T, T, T,
        T, T, T, T, F, T, F, T, T, T, T, T, F, T, T, T, F, F, F, F, F, F, T, T,
        T, F, T, T, T, F, T, F, T, T, F, T, F, T, F, T, T, F, F, F, T, F, T, F,
        T, F, F, F, F, T, T, F, T, F, F, F, T, T, F, T, F, F, T, F, F, F, F, F,
        F, T, F, F, T, F, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, F, F,
        T, F, T, T, F, F, T, F, T, F, T, T, F, T, T, T, F, F, F, T, F, T, T, T,
        T, F, T, T, F, F, T, F, F, F, T, T, F, T, F, F, T, F, T, T, T, F, F, T,
        T, F, T, T, F, T, F, F, F, F, T, T, F, F, T, F, T, F, T, T, T, F, F, T,
        T,
      ],
      data1: [
        F, F, T, F, F, F, F, F, T, F, T, F, F, F, T, T, F, F, F, T, T, F, T, F,
        T, F, T, F, F, T, T, F, F, T, F, T, T, T, T, T, T, F, F, T, T, T, T, T,
        T, T, F, T, F, T, T, T, T, T, F, T, T, T, F, F, F, F, F, F, T, T, T, F,
        T, T, T, F, T, F, T, T, F, T, F, T, F, T, T, F, F, F, T, F, T, F, T, F,
        F, F, F, T, T, F, T, F, F, F, T, T, F, T, F, F, T, F, F, F, F, F, F, T,
        F, F, T, F, T, F, F, F, F, F, F, T, F, F, T, F, T, T, F, F, T, F, T, F,
        T, T, F, T, T, T, F, F, F, T, F, T, T, T, T, F, T, T, F, F, T, F, F, F,
        T, T, F, T, F, F, T, F, T, T, T, F, F, T, T, F, T, T, F, T, F, F, F, F,
        T, T, F, F, T, F, T, F, T, T, T, F, F, T, T,
      ],
    })
  })

  it('should encode a url with no path', () => {
    expect(encodeQRCodeData('http://www.juit.com', true)).toEqual({
      data27: [
        F, F, T, F, F, F, F, F, F, F, F, F, T, F, F, T, T, F, T, T, F, F, F, T,
        T, F, T, F, T, F, T, F, F, T, T, F, F, T, F, T, T, T, T, T, T, F, F, T,
        T, T, T, T, T, T, F, T, F, T, T, T, T, T, F, T, T, T, F, F, F, F, F, F,
        T, T, T, F, T, T, T, F, T, F, T, T, F, T, F, T, F, T, T, F, F, F, T, F,
        T, F, T, F, F, F, F, T, T, F, T, F, F, F, T, T, F, T, F, F, F, T, F, T,
        T, F,
      ],
      data10: [
        F, F, T, F, F, F, F, F, F, F, T, F, F, T, T, F, T, T, F, F, F, T, T, F,
        T, F, T, F, T, F, F, T, T, F, F, T, F, T, T, T, T, T, T, F, F, T, T, T,
        T, T, T, T, F, T, F, T, T, T, T, T, F, T, T, T, F, F, F, F, F, F, T, T,
        T, F, T, T, T, F, T, F, T, T, F, T, F, T, F, T, T, F, F, F, T, F, T, F,
        T, F, F, F, F, T, T, F, T, F, F, F, T, T, F, T, F, F, F, T, F, T, T, F,
      ],
      data1: [
        F, F, T, F, F, F, F, F, T, F, F, T, T, F, T, T, F, F, F, T, T, F, T, F,
        T, F, T, F, F, T, T, F, F, T, F, T, T, T, T, T, T, F, F, T, T, T, T, T,
        T, T, F, T, F, T, T, T, T, T, F, T, T, T, F, F, F, F, F, F, T, T, T, F,
        T, T, T, F, T, F, T, T, F, T, F, T, F, T, T, F, F, F, T, F, T, F, T, F,
        F, F, F, T, T, F, T, F, F, F, T, T, F, T, F, F, F, T, F, T, T, F,
      ],
    })
  })

  it('should encode some raw binary data', () => {
    const data = new TextEncoder().encode('1234567890')
    expect(encodeQRCodeData(data, false)).toEqual({
      data27: [
        F, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, F, T, F, F, F, T, T,
        F, F, F, T, F, F, T, T, F, F, T, F, F, F, T, T, F, F, T, T, F, F, T, T,
        F, T, F, F, F, F, T, T, F, T, F, T, F, F, T, T, F, T, T, F, F, F, T, T,
        F, T, T, T, F, F, T, T, T, F, F, F, F, F, T, T, T, F, F, T, F, F, T, T,
        F, F, F, F,
      ],
      data10: [
        F, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, F, T, F, F, F, T, T,
        F, F, F, T, F, F, T, T, F, F, T, F, F, F, T, T, F, F, T, T, F, F, T, T,
        F, T, F, F, F, F, T, T, F, T, F, T, F, F, T, T, F, T, T, F, F, F, T, T,
        F, T, T, T, F, F, T, T, T, F, F, F, F, F, T, T, T, F, F, T, F, F, T, T,
        F, F, F, F,
      ],
      data1: [
        F, T, F, F, F, F, F, F, T, F, T, F, F, F, T, T, F, F, F, T, F, F, T, T,
        F, F, T, F, F, F, T, T, F, F, T, T, F, F, T, T, F, T, F, F, F, F, T, T,
        F, T, F, T, F, F, T, T, F, T, T, F, F, F, T, T, F, T, T, T, F, F, T, T,
        T, F, F, F, F, F, T, T, T, F, F, T, F, F, T, T, F, F, F, F,
      ],
    })
  })

  it('should encode some longer messages', () => {
    expect(encodeQRCodeData(new Array(100).fill('A').join(''), false))
        .toHaveProperty('data1')
        .toHaveProperty('data10')
        .toHaveProperty('data27')

    expect(encodeQRCodeData(new Array(2000).fill('A').join(''), false))
        .not.toHaveProperty('data1')
        .toHaveProperty('data10')
        .toHaveProperty('data27')

    expect(encodeQRCodeData(new Array(4000).fill('A').join(''), false))
        .not.toHaveProperty('data1')
        .not.toHaveProperty('data10')
        .toHaveProperty('data27')
  })

  it('should not encode a message that is too long', () => {
    expect(() => encodeQRCodeData(new Array(7090).fill('1').join(''), false))
        .toThrowError('Too much numeric data (len=7090)')
    expect(() => encodeQRCodeData(new Array(4297).fill('A').join(''), false))
        .toThrowError('Too much alphanumeric data (len=4297)')
    expect(() => encodeQRCodeData(new Array(2954).fill('a').join(''), false))
        .toThrowError('Too much binary data (len=2954)')
  })
})
