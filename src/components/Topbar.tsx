import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  ChevronRight,
  Home,
  Menu,
  Sparkles,
  X,
} from 'lucide-react'
import { product } from '../config/product'

const labels: Record<string, string> = {
  overview: 'Tổng quan',
  pricing: 'Gói API',
  studio: 'Voice Studio',
  integration: 'Hướng dẫn API',
  faq: 'Câu hỏi thường gặp',
}

export function Topbar({
  active,
  onMenu,
  onOrders,
  onStudio,
}: {
  active: string
  onMenu: () => void
  onOrders: () => void
  onStudio: () => void
}) {
  const [open, setOpen] = useState(false)
  const [seen, setSeen] = useState(false)
  const popover = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => {
      if (!popover.current?.contains(event.target as Node)) setOpen(false)
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open])

  return (
    <header className="topbar">
      <div className="topbar-start">
        <button
          className="icon-button mobile-menu-button"
          onClick={onMenu}
          aria-label="Mở điều hướng"
        >
          <Menu size={21} />
        </button>
        <nav className="breadcrumbs" aria-label="Đường dẫn">
          <Home size={15} strokeWidth={1.7} />
          <span>Khám phá</span>
          <ChevronRight size={13} />
          <span aria-current="page">{labels[active] || 'Tổng quan'}</span>
        </nav>
      </div>
      <div className="topbar-actions">
        <span className="preview-badge">
          <span />
          {product.isDemo ? 'Bản xem trước' : 'Cửa hàng API'}
        </span>
        <span className="topbar-divider" />
        <div className="notification-wrap" ref={popover}>
          <button
            ref={trigger}
            className={`icon-button notification-button ${open ? 'selected' : ''}`}
            onClick={() => {
              setOpen(!open)
              setSeen(true)
            }}
            aria-label="Thông báo"
            aria-expanded={open}
            aria-controls="notifications"
          >
            <Bell size={19} strokeWidth={1.7} />
            {!seen && <span className="notification-dot" />}
          </button>
          <AnimatePresence>
            {open && (
              <motion.section
                id="notifications"
                className="notification-panel"
                aria-label="Thông báo"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.16 }}
              >
                <div className="notification-heading">
                  <strong>Góc nhỏ Voicekey</strong>
                  <button
                    className="icon-button"
                    aria-label="Đóng thông báo"
                    onClick={() => setOpen(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="notification-content">
                  <span className="icon-tile peach">
                    <Sparkles size={20} />
                  </span>
                  <div>
                    <h3>Một ý tưởng mới đang chờ bạn</h3>
                    <p>
                      Thả văn bản vào Voice Studio và nghe thử bằng giọng đọc trên thiết bị. Hoàn
                      toàn không trừ credits.
                    </p>
                    <button
                      className="text-button"
                      onClick={() => {
                        setOpen(false)
                        onStudio()
                      }}
                    >
                      Thử sáng tạo ngay <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
        <button className="profile-button" onClick={onOrders} aria-label="Mở đơn nháp của khách">
          <span className="profile-avatar">K</span>
          <span>Khách</span>
          <ChevronDown size={13} />
        </button>
      </div>
    </header>
  )
}
