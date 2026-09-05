import {
  ArrowUpRight,
  AudioLines,
  BookOpen,
  Code2,
  Headphones,
  LayoutGrid,
  Package,
  ReceiptText,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { Brand } from './Brand'
import { Modal } from './Modal'

const mainLinks: { id: string; title: string; icon: LucideIcon; badge?: string }[] = [
  { id: 'overview', title: 'Tổng quan', icon: LayoutGrid },
  { id: 'pricing', title: 'Gói API', icon: Package },
  { id: 'studio', title: 'Voice Studio', icon: AudioLines, badge: 'Thử ngay' },
]

interface SidebarProps {
  active: string
  mobileOpen: boolean
  closeMobile: () => void
  navigate: (section: string) => void
  onOrders: () => void
  onSupport: () => void
}

export function Sidebar({
  active,
  mobileOpen,
  closeMobile,
  navigate,
  onOrders,
  onSupport,
}: SidebarProps) {
  const go = (section: string) => {
    closeMobile()
    navigate(section)
  }
  const content = (
    <>
      <a
        className="brand-link"
        href="#overview"
        onClick={(event) => {
          event.preventDefault()
          go('overview')
        }}
        aria-label="Voicekey — trang chủ"
      >
        <Brand />
      </a>
      <div className="workspace-label">
        <span className="workspace-icon">
          <Sparkles size={13} />
        </span>{' '}
        Không gian sáng tạo <span className="workspace-dot" />
      </div>
      <nav className="sidebar-nav" aria-label="Điều hướng chính">
        <p className="nav-label">KHÁM PHÁ</p>
        {mainLinks.map(({ id, title, icon: Icon, badge }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`nav-item ${active === id ? 'active' : ''}`}
            aria-current={active === id ? 'location' : undefined}
            onClick={(event) => {
              event.preventDefault()
              go(id)
            }}
          >
            <Icon size={19} strokeWidth={1.7} />
            <span>{title}</span>
            {badge && <span className="nav-badge">{badge}</span>}
          </a>
        ))}
        <p className="nav-label resources-label">TÀI NGUYÊN</p>
        <a
          href="#integration"
          className={`nav-item ${active === 'integration' ? 'active' : ''}`}
          aria-current={active === 'integration' ? 'location' : undefined}
          onClick={(event) => {
            event.preventDefault()
            go('integration')
          }}
        >
          <Code2 size={19} strokeWidth={1.7} />
          <span>Hướng dẫn API</span>
          <ArrowUpRight size={13} className="nav-trailing" />
        </a>
        <a
          href="#faq"
          className={`nav-item ${active === 'faq' ? 'active' : ''}`}
          aria-current={active === 'faq' ? 'location' : undefined}
          onClick={(event) => {
            event.preventDefault()
            go('faq')
          }}
        >
          <BookOpen size={19} strokeWidth={1.7} />
          <span>Câu hỏi thường gặp</span>
        </a>
        <button
          className="nav-item"
          onClick={() => {
            closeMobile()
            onOrders()
          }}
        >
          <ReceiptText size={19} strokeWidth={1.7} />
          <span>Đơn nháp của tôi</span>
        </button>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-promo">
          <span className="promo-sparkle">
            <Sparkles size={20} strokeWidth={1.5} />
          </span>
          <svg className="promo-wave" viewBox="0 0 100 75" fill="none" aria-hidden="true">
            <path
              d="M2 65C27 65 20 10 44 10S62 62 90 10M12 75C37 75 30 20 54 20S72 72 100 20M-8 55C17 55 10 0 34 0S52 52 80 0"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <strong>
            Ý tưởng của bạn.
            <br />
            Giọng nói xứng tầm.
          </strong>
          <p>Bắt đầu với 10.000 credits.</p>
          <button onClick={() => go('pricing')}>
            Khám phá gói API <ArrowUpRight size={16} />
          </button>
        </div>
        <button
          className="support-link"
          onClick={() => {
            closeMobile()
            onSupport()
          }}
        >
          <Headphones size={19} strokeWidth={1.7} />
          <span>Bạn cần hỗ trợ?</span>
          <ArrowUpRight size={14} />
        </button>
        <div className="sidebar-footer">
          <span className="small-status-dot" /> Được làm cho nhà sáng tạo <span>v1.0</span>
        </div>
      </div>
    </>
  )

  return (
    <>
      <aside className="sidebar desktop-sidebar">{content}</aside>
      {mobileOpen && (
        <Modal title="Không gian của bạn" onClose={closeMobile} className="mobile-navigation">
          <aside className="sidebar mobile-sidebar">{content}</aside>
        </Modal>
      )}
    </>
  )
}
