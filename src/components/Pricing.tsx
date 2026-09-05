import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Check,
  Code2,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { product } from '../config/product'

export function Pricing({
  onCheckout,
  navigate,
}: {
  onCheckout: () => void
  navigate: (id: string) => void
}) {
  return (
    <section
      className="pricing-section section-anchor"
      id="pricing"
      aria-labelledby="pricing-title"
    >
      <div className="section-heading">
        <div>
          <div className="section-kicker">
            <span /> GÓI API
          </div>
          <h2 id="pricing-title">Nhỏ chi phí. Lớn sáng tạo.</h2>
          <p>Chọn một gói đơn giản. Dành phần còn lại cho ý tưởng.</p>
        </div>
        <span className="billing-pill">
          <span /> Theo tháng <span className="billing-dash">/</span> Không tự gia hạn
        </span>
      </div>
      <div className="pricing-grid">
        <motion.article
          className="plan-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45 }}
        >
          <div className="plan-top">
            <span className="plan-symbol">
              <AudioLines size={23} strokeWidth={1.7} />
            </span>
            <span className="plan-tag">
              <Sparkles size={12} /> Khởi đầu lý tưởng
            </span>
          </div>
          <div className="plan-name">
            <h3>{product.name}</h3>
            <span>ELEVENLABS API</span>
          </div>
          <p className="plan-description">Cho những ý tưởng đang chờ được cất lời.</p>
          <div className="plan-price">
            <strong>
              {product.price.toLocaleString('vi-VN')}
              <sup>đ</sup>
            </strong>
            <span>/ tháng</span>
          </div>
          <div className="credit-summary">
            <span>
              <Zap size={17} fill="currentColor" /> <strong>10.000</strong> credits
            </span>
            <span>01 tháng sử dụng</span>
          </div>
          <ul className="plan-features">
            <li>
              <Check size={16} /> Dành cho chuyển văn bản thành giọng nói
            </li>
            <li>
              <Check size={16} /> Tích hợp API vào dự án của bạn
            </li>
            <li>
              <Check size={16} /> Một lần mua, thời hạn một tháng
            </li>
          </ul>
          <button className="button button-primary plan-button" onClick={onCheckout}>
            Chọn gói này <ArrowRight size={17} />
          </button>
          <p className="plan-note">
            <ShieldCheck size={13} />
            {product.isDemo
              ? 'Giá minh họa · Chưa mở thanh toán'
              : 'Xem điều kiện tại bước thanh toán'}
          </p>
        </motion.article>
        <div className="feature-grid">
          <motion.article
            className="feature-card integration-feature"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <div className="feature-top">
              <span className="icon-tile lavender">
                <Code2 size={22} strokeWidth={1.6} />
              </span>
              <span className="tiny-label">BUILT FOR DEVELOPERS</span>
            </div>
            <h3>
              Ít dòng code.
              <br />
              Nhiều điều có thể.
            </h3>
            <p>
              Kết nối giọng nói vào ứng dụng,
              <br className="desktop-break" /> workflow hay sản phẩm của bạn.
            </p>
            <div className="mini-code" aria-label="Minh họa cấu trúc API">
              <div>
                <span className="code-method">POST</span> <span>/v1/text-to-speech</span>
                <span className="code-status-dot" />
              </div>
              <code>
                <span className="code-muted">&#123;</span>
                <br />
                &nbsp; <span className="code-purple">"text"</span>:{' '}
                <span className="code-orange">"Xin chào thế giới!"</span>
                <br />
                <span className="code-muted">&#125;</span>
              </code>
              <div className="mini-code-bottom">
                <AudioLines size={13} /> Ý tưởng vào. Giọng nói ra.
              </div>
            </div>
            <button className="text-button feature-link" onClick={() => navigate('integration')}>
              Xem hướng dẫn tích hợp <ArrowUpRight size={15} />
            </button>
          </motion.article>
          <motion.article
            className="feature-card voice-feature"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.14 }}
          >
            <div className="feature-top">
              <span className="icon-tile mint">
                <AudioLines size={22} strokeWidth={1.6} />
              </span>
              <span className="tiny-label">MADE FOR CREATORS</span>
            </div>
            <h3>
              Câu chuyện của bạn.
              <br />
              Dấu ấn của riêng bạn.
            </h3>
            <p>
              Từ video đầu tay đến podcast mới.
              <br className="desktop-break" /> Cho nội dung thêm một chiều cảm xúc.
            </p>
            <div className="voice-visual" aria-hidden="true">
              <span className="voice-line line-one" />
              <span className="voice-line line-two" />
              <span className="voice-line line-three" />
              <span className="voice-visual-orb orb-lavender">
                <AudioLines size={27} />
              </span>
              <span className="voice-visual-orb orb-coral">
                <MicIcon />
              </span>
              <span className="voice-visual-orb orb-mint">
                <Sparkles size={25} />
              </span>
              <span className="voice-mini-tag">
                Chạm đến người nghe <span>✦</span>
              </span>
            </div>
            <button className="text-button feature-link" onClick={() => navigate('studio')}>
              Tìm chất giọng của bạn <ArrowUpRight size={15} />
            </button>
          </motion.article>
          <div className="feature-bottom-note">
            <KeyRound size={16} />
            <span>
              API key là chìa khóa dự án. <strong>Luôn giữ an toàn ở backend.</strong>
            </span>
            <ShieldCheck size={16} />
          </div>
        </div>
      </div>
      <p className="credits-disclaimer">
        Credit tiêu hao tùy model và tính năng sử dụng, không quy đổi cố định thành số ký tự.{' '}
        {product.isDemo && 'Thông số gói và giá cần được người bán xác nhận trước khi mở bán.'}
      </p>
    </section>
  )
}

function MicIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <rect x="11" y="4" width="8" height="15" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7 14a8 8 0 0 0 16 0M15 22v5M11 27h8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
