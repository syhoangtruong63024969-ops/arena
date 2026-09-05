export const TEXT_LIMIT = 500
export const FILE_SIZE_LIMIT = 100 * 1024

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

export function countCharacters(text: string) {
  return Array.from(text).length
}

export function formatTime(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`
}

export function estimateSeconds(text: string, rate = 1) {
  const words = text.trim().split(/\s+/u).filter(Boolean).length
  return words === 0 ? 0 : Math.ceil(words / (2.5 * rate))
}

export function validHttpsUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null
  } catch {
    return null
  }
}

export function parsePrice(value: string | undefined) {
  const price = Number(value)
  return Number.isSafeInteger(price) && price > 0 && price <= 100_000_000 ? price : 49_000
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value) && value.length <= 254
}

export function validateText(text: string) {
  if (!text.trim()) return 'File chưa có nội dung. Hãy thử một file văn bản khác nhé.'
  if (
    Array.from(text).some((character) => {
      const code = character.charCodeAt(0)
      return code < 32 && code !== 9 && code !== 10 && code !== 13
    })
  ) {
    return 'File chứa dữ liệu không phải văn bản. Vui lòng dùng file .txt mã hóa UTF-8.'
  }
  if (countCharacters(text) > TEXT_LIMIT) {
    return `Bản dùng thử hỗ trợ tối đa ${TEXT_LIMIT} ký tự. Hãy rút gọn nội dung rồi thử lại.`
  }
  return null
}

export async function readTextFile(file: File): Promise<string> {
  if (!file.name.toLowerCase().endsWith('.txt')) {
    throw new Error('Chỉ hỗ trợ file .txt. Bạn cũng có thể dán văn bản trực tiếp.')
  }
  if (file.size > FILE_SIZE_LIMIT) {
    throw new Error('File quá lớn. Vui lòng chọn file nhỏ hơn hoặc bằng 100 KB.')
  }
  let text: string
  try {
    const bytes = await file.arrayBuffer()
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^\uFEFF/u, '')
  } catch {
    throw new Error('Không thể đọc file. Vui lòng lưu lại dưới dạng văn bản UTF-8.')
  }
  const error = validateText(text)
  if (error) throw new Error(error)
  return text
}

export function downloadText(filename: string, content: string) {
  const url = URL.createObjectURL(
    new Blob(['\uFEFF', content], { type: 'text/plain;charset=utf-8' }),
  )
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
