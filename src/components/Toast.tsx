import { AnimatePresence, motion } from 'framer-motion'
import { Info, X } from 'lucide-react'

export function Toast({
  message,
  onClose,
}: {
  message: { id: number; text: string } | null
  onClose: () => void
}) {
  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message.id}
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
          >
            <Info size={18} />
            <span>{message.text}</span>
            <button
              className="icon-button"
              onClick={onClose}
              aria-label="Đóng thông báo trạng thái"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
