import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function visitStudio(page: Page) {
  await page.goto('/#studio')
  await expect(page.getByLabel('Thêm lời muốn nói', { exact: false })).toBeVisible()
}

async function revealAll(page: Page) {
  for (const [id, content] of [
    ['pricing', '.plan-card'],
    ['studio', '.studio-shell'],
    ['integration', '.code-window'],
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    // Reduced motion preserves opacity transitions. Audit only settled, visible content.
    await expect(page.locator(content)).toHaveCSS('opacity', '1')
  }
  await page.locator('#faq').scrollIntoViewIfNeeded()
}

test('home renders clearly without runtime errors or horizontal page overflow', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Biến con chữthành cảm xúc.✳')
  await expect(page.locator('.plan-name')).toContainText('Creator 10K')
  await expect(page.locator('.plan-note')).toContainText('Giá minh họa')
  await expect(page.locator('.sound-sculpture')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  expect(errors).toEqual([])
})

test('sidebar navigation works on desktop and in the mobile drawer', async ({ page, isMobile }) => {
  await page.goto('/')
  if (isMobile) await page.getByRole('button', { name: 'Mở điều hướng' }).click()
  const navigation = isMobile ? page.getByRole('dialog') : page.locator('.desktop-sidebar')
  await navigation.getByRole('link', { name: /Voice Studio/u }).click()
  await expect(page).toHaveURL(/#studio$/u)
  await expect(page.locator('.studio-tab')).toBeInViewport()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
})

test('imports a UTF-8 text file and downloads exactly the edited text', async ({ page }) => {
  await visitStudio(page)
  const sample = 'Xin chào! Một giọng nói cho ý tưởng mới. 🎙'
  await page
    .getByLabel('Tải file văn bản .txt')
    .setInputFiles({ name: 'y-tuong.txt', mimeType: 'text/plain', buffer: Buffer.from(sample) })
  await expect(page.locator('#speech-text')).toHaveValue(sample)
  await expect(page.locator('.imported-file')).toContainText('y-tuong.txt')
  await expect(page.locator('#text-counter')).toContainText(`${Array.from(sample).length}`)
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Tải văn bản đang soạn' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('voicekey-van-ban.txt')
  const stream = await download.createReadStream()
  const chunks: Buffer[] = []
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk))
  expect(
    Buffer.concat(chunks)
      .toString('utf8')
      .replace(/^\uFEFF/u, ''),
  ).toBe(sample)
})

test('accepts actual drag-and-drop and rejects unsupported files without losing text', async ({
  page,
}) => {
  await visitStudio(page)
  const transfer = await page.evaluateHandle(() => {
    const data = new DataTransfer()
    data.items.add(new File(['Nội dung được kéo thả.'], 'drop.txt', { type: 'text/plain' }))
    return data
  })
  await page.locator('.text-editor').dispatchEvent('dragenter', { dataTransfer: transfer })
  await expect(page.getByText('Thả ý tưởng của bạn vào đây')).toBeVisible()
  await page.locator('.text-editor').dispatchEvent('drop', { dataTransfer: transfer })
  await expect(page.locator('#speech-text')).toHaveValue('Nội dung được kéo thả.')
  await expect(page.locator('.drop-overlay')).not.toBeVisible()
  await page.getByLabel('Tải file văn bản .txt').setInputFiles({
    name: 'wrong.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('Not supported'),
  })
  await expect(page.getByRole('alert')).toContainText('Chỉ hỗ trợ file .txt')
  await expect(page.locator('#speech-text')).toHaveValue('Nội dung được kéo thả.')
  await page.getByLabel('Tải file văn bản .txt').setInputFiles({
    name: 'long.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('a'.repeat(501)),
  })
  await expect(page.getByRole('alert')).toContainText('500 ký tự')
  await page.getByLabel('Tải file văn bản .txt').setInputFiles({
    name: 'large.txt',
    mimeType: 'text/plain',
    buffer: Buffer.alloc(102_401, 'a'),
  })
  await expect(page.getByRole('alert')).toContainText('100 KB')
  await page
    .getByLabel('Tải file văn bản .txt')
    .setInputFiles({ name: 'empty.txt', mimeType: 'text/plain', buffer: Buffer.from('') })
  await expect(page.getByRole('alert')).toContainText('chưa có nội dung')
})

test('styles can be selected and reordered accessibly with the keyboard', async ({ page }) => {
  await visitStudio(page)
  await page.getByRole('button', { name: /Kể chuyện Chậm rãi/u }).click()
  await expect(page.getByRole('button', { name: /Kể chuyện Chậm rãi/u })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  const handle = page.getByRole('button', { name: /Di chuyển Tự nhiên/u })
  await handle.focus()
  await handle.press('ArrowRight')
  await expect(page.locator('.style-card').first()).toContainText('Kể chuyện')
  await expect(page.locator('.style-card').nth(1)).toContainText('Tự nhiên')
  await page.getByLabel('Ngôn ngữ giọng đọc').selectOption('en')
  await expect(page.locator('#speech-text')).toHaveValue(/Every idea deserves/u)
  await page.locator('#speech-text').fill('')
  await expect(page.getByRole('button', { name: 'Nghe thử văn bản' })).toBeDisabled()
  await page.getByRole('button', { name: 'Dùng văn bản mẫu' }).click()
  await expect(page.locator('#speech-text')).toHaveValue(/Every idea deserves/u)
})

test('style cards also reorder with a real pointer drag', async ({ page }) => {
  await visitStudio(page)
  const first = await page.getByRole('button', { name: /Di chuyển Tự nhiên/u }).boundingBox()
  const second = await page.locator('.style-card').nth(1).boundingBox()
  expect(first).not.toBeNull()
  expect(second).not.toBeNull()
  await page.mouse.move(first!.x + first!.width / 2, first!.y + first!.height / 2)
  await page.mouse.down()
  await page.mouse.move(second!.x + second!.width * 0.6, first!.y + first!.height / 2, {
    steps: 15,
  })
  await page.mouse.up()
  await expect(page.locator('.style-card').first()).toContainText('Kể chuyện')
})

test('missing device voices give an honest, useful message', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        getVoices: () => [],
        cancel: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
      },
    })
  })
  await visitStudio(page)
  await page.getByRole('button', { name: 'Nghe thử văn bản' }).click()
  await expect(
    page.getByRole('status').filter({ hasText: 'Thiết bị chưa có giọng' }),
  ).toContainText('Thiết bị chưa có giọng tiếng Việt')
  await expect(page.getByRole('button', { name: 'Nghe thử văn bản' })).toBeVisible()
})

test('speech preview uses selected settings and can be stopped', async ({ page }) => {
  await page.addInitScript(() => {
    let timer: ReturnType<typeof setTimeout>
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        getVoices: () => [{ lang: 'vi-VN', name: 'Test device Vietnamese', default: true }],
        cancel: () => clearTimeout(timer),
        addEventListener: () => {},
        removeEventListener: () => {},
        speak: (utterance: SpeechSynthesisUtterance) => {
          document.documentElement.dataset.speechRate = String(utterance.rate)
          document.documentElement.dataset.speechPitch = String(utterance.pitch)
          timer = setTimeout(() => utterance.onstart?.({} as SpeechSynthesisEvent), 10)
        },
      },
    })
    // A plain stand-in lets the browser-independent mock voice be assigned.
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: class {
        text: string
        constructor(text: string) {
          this.text = text
        }
      },
    })
  })
  await visitStudio(page)
  await page.getByRole('button', { name: /Kể chuyện Chậm rãi/u }).click()
  await page.getByRole('button', { name: 'Nghe thử văn bản' }).click()
  await expect(page.getByText('Đang cất lời…', { exact: true })).toBeVisible()
  expect(await page.locator('html').getAttribute('data-speech-rate')).toBe('0.86')
  expect(await page.locator('html').getAttribute('data-speech-pitch')).toBe('1.05')
  await page.getByRole('button', { name: 'Dừng nghe thử' }).click()
  await expect(page.getByText('Sẵn sàng cất lời?', { exact: true })).toBeVisible()
})

test('draft checkout, export, persistence and deletion work without creating a payment', async ({
  page,
}) => {
  const posts: string[] = []
  page.on('request', (request) => {
    if (request.method() === 'POST') posts.push(request.url())
  })
  await page.goto('/#pricing')
  await page.getByRole('button', { name: 'Chọn gói này', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('Bạn đang trải nghiệm bản demo.')).toBeVisible()
  await dialog.getByLabel(/Tên của bạn/u).fill('Người sáng tạo')
  await dialog.getByLabel(/Email tham khảo/u).fill('demo@example.com')
  await dialog.getByRole('button', { name: 'Tiếp tục', exact: true }).click()
  await expect(dialog.getByRole('button', { name: 'Lưu đơn nháp' })).toBeDisabled()
  await dialog.getByRole('checkbox').check()
  await dialog.getByRole('button', { name: 'Lưu đơn nháp' }).click()
  await expect(dialog.getByText('Đã lưu bản nháp của bạn!')).toBeVisible()
  const raw = await page.evaluate(() => localStorage.getItem('voicekey.order-drafts.v1'))
  expect(raw).not.toContain('demo@example.com')
  expect(raw).not.toContain('Người sáng tạo')
  expect(JSON.parse(raw!)).toHaveLength(1)
  const id = JSON.parse(raw!)[0].id as string
  const downloaded = page.waitForEvent('download')
  await dialog.getByRole('button', { name: 'Tải bản nháp .txt' }).click()
  expect((await downloaded).suggestedFilename()).toBe(`${id}.txt`)
  await dialog.getByRole('button', { name: 'Đóng cửa sổ' }).click()
  await page.reload()
  await page.getByRole('button', { name: 'Mở đơn nháp của khách' }).click()
  await expect(page.locator('.order-reference')).toHaveText(id)
  await page.getByRole('button', { name: `Xóa bản nháp ${id}` }).click()
  await page.getByRole('button', { name: 'Xóa bản nháp', exact: true }).click()
  await expect(page.getByText('Mọi ý tưởng đều có khởi đầu.')).toBeVisible()
  expect(posts).toEqual([])
})

test('code examples switch with keyboard navigation and copy real backend code', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/#integration')
  await page.getByRole('tab', { name: 'Node.js' }).focus()
  await page.getByRole('tab', { name: 'Node.js' }).press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Python' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel')).toContainText('requests.post')
  await page.getByRole('button', { name: 'Sao chép mã Python' }).click()
  await expect(page.getByText('Đã chép', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "os.environ['ELEVENLABS_API_KEY']",
  )
  await page.getByRole('tab', { name: 'cURL' }).click()
  await expect(page.getByRole('tabpanel')).toContainText('--fail-with-body')
})

test('FAQ and policy dialogs support keyboard use, focus trapping and Escape', async ({ page }) => {
  await page.goto('/#faq')
  const question = page.getByRole('button', { name: 'Tôi thanh toán và nhận API key như thế nào?' })
  await question.click()
  await expect(question).toHaveAttribute('aria-expanded', 'true')
  await expect(
    page.getByRole('region', { name: 'Tôi thanh toán và nhận API key như thế nào?' }),
  ).toContainText('Chưa có thanh toán')
  await page.getByRole('button', { name: 'Quyền riêng tư', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Quyền riêng tư' })).toBeVisible()
  for (let index = 0; index < 5; index += 1) await page.keyboard.press('Tab')
  expect(
    await page.evaluate(() => document.querySelector('dialog')?.contains(document.activeElement)),
  ).toBe(true)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'Quyền riêng tư', exact: true })).toBeFocused()
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
})

test('main content and checkout pass automated WCAG AA checks', async ({ page }) => {
  await page.goto('/')
  await revealAll(page)
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(result.violations).toEqual([])
  await page.getByRole('button', { name: 'Chọn gói này', exact: true }).click()
  await expect(page.locator('.modal-surface')).toHaveCSS('opacity', '1')
  const modalResult = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(modalResult.violations).toEqual([])
})
