import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  deleteDraft,
  DRAFTS_KEY,
  draftSummary,
  getDrafts,
  MAX_DRAFTS,
  saveDraft,
  type OrderDraft,
} from './storage'

const draft: OrderDraft = {
  id: 'VK-12345678',
  createdAt: '2026-09-05T12:00:00.000Z',
  plan: 'Creator 10K',
  price: 10000,
  credits: 10000,
  periodMonths: 1,
  status: 'draft',
}

beforeEach(() => localStorage.clear())

describe('local draft history', () => {
  it('starts empty', () => expect(getDrafts()).toEqual([]))
  it('recovers from malformed JSON and invalid schema', () => {
    localStorage.setItem(DRAFTS_KEY, 'not-json')
    expect(getDrafts()).toEqual([])
    localStorage.setItem(
      DRAFTS_KEY,
      JSON.stringify([null, {}, { ...draft, price: -5 }, { ...draft, createdAt: 'never' }, draft]),
    )
    expect(getDrafts()).toEqual([draft])
    localStorage.setItem(DRAFTS_KEY, '{}')
    expect(getDrafts()).toEqual([])
  })
  it('persists valid drafts and deduplicates the same ID', () => {
    expect(saveDraft(draft)).toBe(true)
    expect(saveDraft(draft)).toBe(true)
    expect(getDrafts()).toEqual([draft])
  })
  it('keeps only the most recent 30 drafts', () => {
    for (let index = 0; index < MAX_DRAFTS + 10; index += 1) {
      saveDraft({ ...draft, id: `VK-${String(index).padStart(8, '0')}` })
    }
    expect(getDrafts()).toHaveLength(30)
    expect(getDrafts()[0].id).toBe('VK-00000039')
  })
  it('does not retain personal data or extra untrusted properties', () => {
    const withPersonalData = {
      ...draft,
      email: 'private@example.com',
      name: 'Private Person',
      apiKey: 'never-store-this',
    }
    saveDraft(withPersonalData)
    const stored = localStorage.getItem(DRAFTS_KEY)
    expect(stored).not.toContain('private@example.com')
    expect(stored).not.toContain('Private Person')
    expect(stored).not.toContain('never-store-this')
  })
  it('deletes only the requested draft', () => {
    saveDraft(draft)
    saveDraft({ ...draft, id: 'VK-87654321' })
    expect(deleteDraft(draft.id)).toBe(true)
    expect(getDrafts().map((item) => item.id)).toEqual(['VK-87654321'])
  })
  it('handles unavailable storage without crashing', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    expect(getDrafts()).toEqual([])
  })
  it('reports a storage quota failure honestly', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded')
    })
    expect(saveDraft(draft)).toBe(false)
    expect(deleteDraft(draft.id)).toBe(false)
  })
  it('exports a draft, never a paid receipt or an API key', () => {
    const summary = draftSummary(draft)
    expect(summary).toContain('KHÔNG PHẢI HÓA ĐƠN')
    expect(summary).toContain('Chưa thanh toán')
    expect(summary).toContain('Chưa cấp API key')
    expect(summary).toContain('10.000')
    expect(summary).toContain('10.000 VND')
  })
})
