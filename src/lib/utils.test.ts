import { describe, expect, it } from 'vitest'
import {
  countCharacters,
  estimateSeconds,
  FILE_SIZE_LIMIT,
  formatCurrency,
  formatTime,
  isValidEmail,
  parsePrice,
  readTextFile,
  TEXT_LIMIT,
  validHttpsUrl,
  validateText,
} from './utils'

function textFile(name: string, text: string, size?: number): File {
  const bytes = new TextEncoder().encode(text)
  return { name, size: size ?? bytes.byteLength, arrayBuffer: async () => bytes.buffer } as File
}

describe('public product configuration', () => {
  it('formats VND without decimal places', () => {
    expect(formatCurrency(10_000).replace(/\s/gu, ' ')).toBe('10.000 ₫')
  })
  it.each([undefined, '', '0', '-1', 'abc', 'Infinity', '4.5', '100000001'])(
    'uses the sample price for invalid value %s',
    (value) => {
      expect(parsePrice(value)).toBe(10_000)
    },
  )
  it('accepts a positive integer price', () => expect(parsePrice('79000')).toBe(79_000))
  it.each([
    '',
    undefined,
    'javascript:alert(1)',
    'http://example.com',
    '//example.com',
    'https://user:password@example.com',
    'not-a-url',
  ])('rejects unsafe or invalid checkout URLs: %s', (url) => {
    expect(validHttpsUrl(url)).toBeNull()
  })
  it('accepts a real HTTPS checkout URL', () => {
    expect(validHttpsUrl('https://example.com/checkout?product=10k')).toBe(
      'https://example.com/checkout?product=10k',
    )
  })
  it('validates email addresses and length', () => {
    expect(isValidEmail('hello+api@example.com')).toBe(true)
    expect(isValidEmail('hello@example')).toBe(false)
    expect(isValidEmail(' hello@example.com')).toBe(false)
    expect(isValidEmail(`${'a'.repeat(250)}@example.com`)).toBe(false)
  })
})

describe('text helpers', () => {
  it('counts Unicode code points instead of UTF-16 code units', () => {
    expect(countCharacters('Xin chào 🎙')).toBe(10)
  })
  it('formats durations safely', () => {
    expect(formatTime(75.4)).toBe('01:15')
    expect(formatTime(-5)).toBe('00:00')
    expect(formatTime(NaN)).toBe('00:00')
  })
  it('estimates reading time but not credits', () => {
    expect(estimateSeconds('')).toBe(0)
    expect(estimateSeconds('one two three four five')).toBe(2)
    expect(estimateSeconds('one two three four five', 0.5)).toBe(4)
  })
  it('validates blank, binary, Unicode and oversized text', () => {
    expect(validateText(' \n ')).toBeTruthy()
    expect(validateText('abc\u0000')).toContain('không phải văn bản')
    expect(validateText('Xin chào!\n\tMột ý tưởng mới.')).toBeNull()
    expect(validateText('a'.repeat(TEXT_LIMIT))).toBeNull()
    expect(validateText('a'.repeat(TEXT_LIMIT + 1))).toContain('500 ký tự')
  })
})

describe('safe local file imports', () => {
  it('reads .txt case-insensitively and preserves Vietnamese', async () => {
    await expect(readTextFile(textFile('GIỌNG-NÓI.TXT', 'Xin chào, thế giới!'))).resolves.toBe(
      'Xin chào, thế giới!',
    )
  })
  it('accepts a UTF-8 BOM', async () => {
    await expect(readTextFile(textFile('demo.txt', '\uFEFFXin chào'))).resolves.toBe('Xin chào')
  })
  it('rejects an unsupported extension', async () => {
    await expect(readTextFile(textFile('audio.mp3', 'text'))).rejects.toThrow(
      'Chỉ hỗ trợ file .txt',
    )
  })
  it('checks the file size before reading contents', async () => {
    await expect(readTextFile(textFile('large.txt', 'text', FILE_SIZE_LIMIT + 1))).rejects.toThrow(
      '100 KB',
    )
  })
  it('rejects overly long text without silently truncating it', async () => {
    await expect(readTextFile(textFile('long.txt', 'a'.repeat(501)))).rejects.toThrow('500 ký tự')
  })
  it('rejects empty files', async () => {
    await expect(readTextFile(textFile('empty.txt', ''))).rejects.toThrow('chưa có nội dung')
  })
  it('rejects non UTF-8 bytes', async () => {
    const file = {
      name: 'binary.txt',
      size: 2,
      arrayBuffer: async () => new Uint8Array([0xc3, 0x28]).buffer,
    } as File
    await expect(readTextFile(file)).rejects.toThrow('UTF-8')
  })
})
