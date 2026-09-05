import { useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  className?: string
}

export function Modal({ title, subtitle, onClose, children, className = '' }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-labelledby="modal-title"
      aria-describedby={subtitle ? 'modal-subtitle' : undefined}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.div
        className="modal-surface"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22 }}
      >
        <div className="modal-heading">
          <div>
            <h2 id="modal-title">{title}</h2>
            {subtitle && <p id="modal-subtitle">{subtitle}</p>}
          </div>
          <button
            className="icon-button close-button"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            autoFocus
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </dialog>
  )
}
