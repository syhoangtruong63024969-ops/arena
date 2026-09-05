import { useCallback, useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Heart } from 'lucide-react'
import { Brand } from './components/Brand'
import { Checkout } from './components/Checkout'
import { FAQ } from './components/FAQ'
import { Hero } from './components/Hero'
import { InfoContent, type InfoTopic } from './components/InfoContent'
import { Integration } from './components/Integration'
import { Modal } from './components/Modal'
import { Orders } from './components/Orders'
import { Pricing } from './components/Pricing'
import { Sidebar } from './components/Sidebar'
import { Studio } from './components/Studio'
import { Toast } from './components/Toast'
import { Topbar } from './components/Topbar'
import { product } from './config/product'

type ModalType = 'checkout' | 'orders' | InfoTopic | null
const sectionIds = ['overview', 'pricing', 'studio', 'integration', 'faq']
const modalTitles = {
  checkout: 'Chọn gói cho ý tưởng của bạn',
  orders: 'Đơn nháp của tôi',
  support: 'Luôn có một cách để bắt đầu',
  privacy: 'Quyền riêng tư',
  terms: 'Điều khoản sử dụng',
}

function App() {
  const [active, setActive] = useState('overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [modal, setModal] = useState<ModalType>(null)
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toastId = useRef(0)

  const notify = useCallback((text: string) => {
    setToast({ id: ++toastId.current, text })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 6500)
  }, [])

  const navigate = useCallback((id: string) => {
    if (!sectionIds.includes(id)) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
    setActive(id)
  }, [])

  useEffect(() => {
    let frame = 0
    const updateActive = () => {
      let current = 'overview'
      for (const id of sectionIds) {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= 170) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateActive)
    }
    const onHashChange = () => {
      const id = window.location.hash.slice(1)
      if (sectionIds.includes(id)) navigate(id)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('hashchange', onHashChange)
    const initial = requestAnimationFrame(() => {
      onHashChange()
      updateActive()
    })
    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(initial)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('hashchange', onHashChange)
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [navigate])

  function navigateFromModal(id: string) {
    setModal(null)
    // Let the native dialog release the scroll lock before moving the document.
    requestAnimationFrame(() => navigate(id))
  }

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main-content" className="skip-link">
        Đến nội dung chính
      </a>
      <Sidebar
        active={active}
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
        navigate={navigate}
        onOrders={() => setModal('orders')}
        onSupport={() => setModal('support')}
      />
      <div className="app-main">
        <Topbar
          active={active}
          onMenu={() => setMobileOpen(true)}
          onOrders={() => setModal('orders')}
          onStudio={() => navigate('studio')}
        />
        <main className="page-content" id="main-content" tabIndex={-1}>
          <Hero navigate={navigate} />
          <Pricing onCheckout={() => setModal('checkout')} navigate={navigate} />
          <Studio notify={notify} onCheckout={() => setModal('checkout')} />
          <Integration notify={notify} />
          <FAQ onSupport={() => setModal('support')} onCheckout={() => setModal('checkout')} />
          <footer className="footer">
            <div className="footer-top">
              <a
                href="#overview"
                onClick={(event) => {
                  event.preventDefault()
                  navigate('overview')
                }}
                aria-label="Về đầu trang Voicekey"
              >
                <Brand small />
              </a>
              <p>
                Made for your next idea. <Heart size={12} />
              </p>
              <div className="footer-links">
                <button onClick={() => setModal('privacy')}>Quyền riêng tư</button>
                <button onClick={() => setModal('terms')}>Điều khoản</button>
                <button onClick={() => setModal('support')}>
                  Hỗ trợ <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 Voicekey. Không phải website chính thức của ElevenLabs.</span>
              <span>
                {product.isDemo
                  ? 'Bản demo · Chưa thanh toán hay cấp API key'
                  : 'Thanh toán qua nhà cung cấp bên ngoài'}
              </span>
            </div>
          </footer>
        </main>
      </div>
      {active !== 'overview' && (
        <button
          className="back-to-top icon-button"
          onClick={() => navigate('overview')}
          aria-label="Về đầu trang"
        >
          <ArrowUp size={18} />
        </button>
      )}
      {modal && (
        <Modal
          key={modal}
          title={modalTitles[modal]}
          subtitle={modal === 'checkout' ? 'Một gói nhỏ. Một khởi đầu đầy cảm hứng.' : undefined}
          onClose={() => setModal(null)}
          className={
            modal === 'orders'
              ? 'orders-modal'
              : modal === 'privacy' || modal === 'terms'
                ? 'legal-modal'
                : ''
          }
        >
          {modal === 'checkout' && (
            <Checkout
              notify={notify}
              onOrders={() => setModal('orders')}
              onClose={() => setModal(null)}
            />
          )}
          {modal === 'orders' && <Orders onCheckout={() => setModal('checkout')} notify={notify} />}
          {(modal === 'support' || modal === 'privacy' || modal === 'terms') && (
            <InfoContent topic={modal} navigate={navigateFromModal} />
          )}
          <Toast message={toast} onClose={() => setToast(null)} />
        </Modal>
      )}
      {!modal && <Toast message={toast} onClose={() => setToast(null)} />}
    </MotionConfig>
  )
}

export default App
