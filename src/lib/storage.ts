export const DRAFTS_KEY = 'voicekey.order-drafts.v1'
export const MAX_DRAFTS = 30

export interface OrderDraft {
  id: string
  createdAt: string
  plan: string
  price: number
  credits: number
  periodMonths: number
  status: 'draft'
}

function isDraft(value: unknown): value is OrderDraft {
  if (!value || typeof value !== 'object') return false
  const draft = value as Partial<OrderDraft>
  return (
    typeof draft.id === 'string' &&
    /^VK-[A-Z0-9-]{8,40}$/u.test(draft.id) &&
    typeof draft.createdAt === 'string' &&
    Number.isFinite(Date.parse(draft.createdAt)) &&
    typeof draft.plan === 'string' &&
    draft.plan.length > 0 &&
    draft.plan.length < 100 &&
    typeof draft.price === 'number' &&
    Number.isSafeInteger(draft.price) &&
    draft.price > 0 &&
    typeof draft.credits === 'number' &&
    Number.isSafeInteger(draft.credits) &&
    draft.credits > 0 &&
    typeof draft.periodMonths === 'number' &&
    Number.isSafeInteger(draft.periodMonths) &&
    draft.periodMonths > 0 &&
    draft.status === 'draft'
  )
}

function publicDraftFields(draft: OrderDraft): OrderDraft {
  const { id, createdAt, plan, price, credits, periodMonths, status } = draft
  return { id, createdAt, plan, price, credits, periodMonths, status }
}

export function getDrafts(): OrderDraft[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]')
    return Array.isArray(raw) ? raw.filter(isDraft).slice(0, MAX_DRAFTS).map(publicDraftFields) : []
  } catch {
    return []
  }
}

export function saveDraft(draft: OrderDraft): boolean {
  if (!isDraft(draft)) return false
  try {
    const drafts = getDrafts().filter((item) => item.id !== draft.id)
    localStorage.setItem(
      DRAFTS_KEY,
      JSON.stringify([publicDraftFields(draft), ...drafts].slice(0, MAX_DRAFTS)),
    )
    return true
  } catch {
    return false
  }
}

export function deleteDraft(id: string): boolean {
  try {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(getDrafts().filter((draft) => draft.id !== id)))
    return true
  } catch {
    return false
  }
}

export function draftSummary(draft: OrderDraft) {
  return [
    'VOICEKEY — BẢN NHÁP THAM KHẢO, KHÔNG PHẢI HÓA ĐƠN',
    '',
    `Mã bản nháp: ${draft.id}`,
    `Ngày tạo: ${new Date(draft.createdAt).toLocaleString('vi-VN')}`,
    `Gói: ${draft.plan} — ElevenLabs API`,
    `Credits: ${draft.credits.toLocaleString('vi-VN')}`,
    `Thời hạn: ${draft.periodMonths} tháng`,
    `Giá minh họa: ${draft.price.toLocaleString('vi-VN')} VND`,
    '',
    'Trạng thái: Chưa thanh toán. Chưa gửi yêu cầu đến người bán. Chưa cấp API key.',
    'Bản nháp chỉ được lưu trên trình duyệt của bạn. Giá và điều kiện cần được người bán xác nhận.',
    'Credit tiêu hao phụ thuộc vào model và tính năng sử dụng, không đồng nghĩa cố định với số ký tự.',
    '',
    'Voicekey là giao diện cửa hàng độc lập, không phải website chính thức của ElevenLabs.',
  ].join('\n')
}
