import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  AudioLines,
  Check,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Info,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react'
import { product } from '../config/product'
import { draftSummary, saveDraft, type OrderDraft } from '../lib/storage'
import { downloadText, formatCurrency, isValidEmail } from '../lib/utils'

export function Checkout({
  notify,
  onOrders,
  onClose,
}: {
  notify: (message: string) => void
  onOrders: () => void
  onClose: () => void
}) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [consent, setConsent] = useState(false)
  const [draft, setDraft] = useState<OrderDraft | null>(null)
  const [saved, setSaved] = useState(false)

  function next(event: FormEvent) {
    event.preventDefault()
    if (!isValidEmail(email.trim())) {
      setError('Vui lòng nhập email hợp lệ, ví dụ ban@example.com.')
      return
    }
    setError('')
    setStep(2)
  }

  function createDraft(event: FormEvent) {
    event.preventDefault()
    if (!consent || draft) return
    const nextDraft: OrderDraft = {
      id: `VK-${crypto.randomUUID().slice(0, 18).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      plan: product.name,
      price: product.price,
      credits: product.credits,
      periodMonths: product.periodMonths,
      status: 'draft',
    }
    const didSave = saveDraft(nextDraft)
    setSaved(didSave)
    setDraft(nextDraft)
    if (!didSave)
      notify('Trình duyệt không cho lưu dữ liệu. Bạn vẫn có thể tải bản nháp xuống ngay.')
  }

  const plan = (
    <div className="checkout-product">
      <span className="plan-symbol">
        <AudioLines size={25} />
      </span>
      <div>
        <strong>{product.name}</strong>
        <span>ElevenLabs API · 10.000 credits · 1 tháng</span>
      </div>
      <strong>{formatCurrency(product.price)}</strong>
    </div>
  )

  if (!product.isDemo && product.checkoutUrl) {
    return (
      <div className="checkout-body">
        {plan}
        <div className="info-banner">
          <ShieldCheck size={19} />
          <p>
            Bạn sẽ chuyển đến trang thanh toán bên ngoài. Kiểm tra đúng sản phẩm, giá, thời hạn,
            chính sách hoàn tiền và thông tin người bán trước khi trả tiền.
          </p>
        </div>
        <p className="checkout-external-note">
          Website này không thu thập thông tin thẻ, không xác nhận giao dịch và không tự cấp API
          key. Hãy làm theo hướng dẫn giao nhận của người bán tại trang thanh toán.
        </p>
        <a
          href={product.checkoutUrl}
          className="button button-primary full-width"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tiếp tục đến trang thanh toán <ExternalLink size={16} />
        </a>
      </div>
    )
  }

  if (draft) {
    return (
      <motion.div
        className="checkout-success"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="success-icon">
          <FileCheck2 size={33} strokeWidth={1.5} />
        </span>
        <span className="section-kicker">MỘT BƯỚC CHO Ý TƯỞNG MỚI</span>
        <h3>{saved ? 'Đã lưu bản nháp của bạn!' : 'Bản nháp đã sẵn sàng!'}</h3>
        <p>
          Chưa thanh toán, chưa gửi đơn đến người bán
          <br />
          và chưa có API key được cấp.
        </p>
        <div className="draft-reference">
          <span>MÃ BẢN NHÁP</span>
          <strong>{draft.id}</strong>
          <span>
            {product.name} · {formatCurrency(product.price)} <small>(giá mẫu)</small>
          </span>
        </div>
        <button
          className="button button-primary full-width"
          onClick={() =>
            downloadText(
              `${draft.id}.txt`,
              `${draftSummary(draft)}\n\nThông tin trong phiên này (chỉ có trong tệp bạn tải):\nTên: ${name.trim() || 'Không cung cấp'}\nEmail: ${email.trim()}`,
            )
          }
        >
          <ArrowDownToLine size={17} /> Tải bản nháp .txt
        </button>
        <button className="button button-white full-width" onClick={saved ? onOrders : onClose}>
          {saved ? 'Xem đơn nháp của tôi' : 'Tiếp tục khám phá'}
          <ArrowRight size={16} />
        </button>
        <p className="privacy-micro">
          <LockKeyhole size={12} /> Không lưu tên và email vào lịch sử trình duyệt.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="checkout-body">
      <div className="checkout-steps">
        <span className={step === 1 ? 'current' : 'complete'}>
          <i>{step > 1 ? <Check size={12} /> : '1'}</i>Thông tin
        </span>
        <span className="step-line" />
        <span className={step === 2 ? 'current' : ''}>
          <i>2</i>Xác nhận
        </span>
      </div>
      {plan}
      <div className="info-banner">
        <Info size={18} />
        <p>
          <strong>Bạn đang trải nghiệm bản demo.</strong> Giá chỉ là minh họa. Không thu tiền, không
          gửi email và không cấp API key.
        </p>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <motion.form
            key="details"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            onSubmit={next}
            className="checkout-form"
          >
            <div className="form-field">
              <label htmlFor="customer-name">
                Tên của bạn <span>(không bắt buộc)</span>
              </label>
              <input
                id="customer-name"
                name="name"
                autoComplete="name"
                maxLength={80}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Chúng mình nên gọi bạn là gì?"
              />
            </div>
            <div className="form-field">
              <label htmlFor="customer-email">
                Email tham khảo <span>*</span>
              </label>
              <input
                id="customer-email"
                name="email"
                autoComplete="email"
                type="email"
                maxLength={254}
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError('')
                }}
                placeholder="ban@example.com"
                aria-describedby="email-help"
                aria-invalid={!!error}
              />
              <small id="email-help">
                Có thể dùng email mẫu. Thông tin không được gửi đến máy chủ.
              </small>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button button-primary full-width" type="submit">
              Tiếp tục <ArrowRight size={17} />
            </button>
            <p className="privacy-micro">
              <LockKeyhole size={12} /> Chỉ dùng trong phiên này và trong tệp bạn chủ động tải.
            </p>
          </motion.form>
        ) : (
          <motion.form
            key="review"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
            onSubmit={createDraft}
          >
            <div className="review-details">
              <div>
                <span>Email tham khảo</span>
                <strong>{email}</strong>
              </div>
              <div>
                <span>Thời hạn dự kiến</span>
                <strong>01 tháng</strong>
              </div>
              <div>
                <span>Giá minh họa</span>
                <strong>{formatCurrency(product.price)}</strong>
              </div>
              <div className="review-total">
                <span>Số tiền thanh toán hôm nay</span>
                <strong>0đ</strong>
              </div>
            </div>
            <label className="consent-field">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              <span>
                Tôi hiểu đây là <strong>đơn nháp</strong>, chưa thanh toán và chưa được cấp API key.
                Giá và điều kiện cần được người bán xác nhận.
              </span>
            </label>
            <button className="button button-primary full-width" type="submit" disabled={!consent}>
              Lưu đơn nháp <CheckCircle2 size={17} />
            </button>
            <button className="text-button back-button" type="button" onClick={() => setStep(1)}>
              <ArrowLeft size={14} /> Chỉnh sửa thông tin
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
