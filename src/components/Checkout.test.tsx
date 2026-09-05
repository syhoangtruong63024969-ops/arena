import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MotionConfig } from 'framer-motion'
import { Checkout } from './Checkout'
import { DRAFTS_KEY } from '../lib/storage'

function setup() {
  const notify = vi.fn()
  render(
    <MotionConfig reducedMotion="always">
      <Checkout notify={notify} onOrders={vi.fn()} onClose={vi.fn()} />
    </MotionConfig>,
  )
  return { notify }
}

afterEach(() => localStorage.clear())

describe('transparent preview checkout', () => {
  it('discloses demo mode and requires consent before saving a draft', async () => {
    setup()
    expect(screen.getByText('Bạn đang trải nghiệm bản demo.')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/Email tham khảo/u), {
      target: { value: 'demo@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Tiếp tục' }))
    const save = await screen.findByRole('button', { name: 'Lưu đơn nháp' })
    expect(save).toBeDisabled()
    fireEvent.click(screen.getByRole('checkbox'))
    expect(save).toBeEnabled()
    fireEvent.click(save)
    expect(await screen.findByText('Đã lưu bản nháp của bạn!')).toBeInTheDocument()
    expect(localStorage.getItem(DRAFTS_KEY)).not.toContain('demo@example.com')
    expect(JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]')[0].status).toBe('draft')
  })
  it('allows downloading a draft but does not claim it was saved when storage fails', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage blocked')
    })
    const { notify } = setup()
    fireEvent.change(screen.getByLabelText(/Email tham khảo/u), {
      target: { value: 'preview@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Tiếp tục' }))
    await screen.findByRole('checkbox')
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'Lưu đơn nháp' }))
    expect(await screen.findByText('Bản nháp đã sẵn sàng!')).toBeInTheDocument()
    expect(notify).toHaveBeenCalledWith(expect.stringContaining('không cho lưu'))
    expect(screen.getByRole('button', { name: 'Tải bản nháp .txt' })).toBeEnabled()
  })
})
