import { useState } from 'react'
import {
  ArrowDownToLine,
  ArrowRight,
  AudioLines,
  FileClock,
  LockKeyhole,
  Trash2,
} from 'lucide-react'
import { deleteDraft, draftSummary, getDrafts } from '../lib/storage'
import { downloadText, formatCurrency } from '../lib/utils'

export function Orders({
  onCheckout,
  notify,
}: {
  onCheckout: () => void
  notify: (message: string) => void
}) {
  const [drafts, setDrafts] = useState(getDrafts)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function remove(id: string) {
    if (deleteDraft(id)) {
      setDrafts(getDrafts())
      setConfirmDelete(null)
      notify('Đã xóa bản nháp khỏi trình duyệt này.')
    } else notify('Không thể xóa dữ liệu trên trình duyệt lúc này. Vui lòng thử lại.')
  }

  return (
    <div className="orders-body">
      {!drafts.length ? (
        <div className="orders-empty">
          <span className="empty-illustration">
            <FileClock size={36} strokeWidth={1.2} />
            <i />
            <i />
          </span>
          <h3>Mọi ý tưởng đều có khởi đầu.</h3>
          <p>
            Bạn chưa có đơn nháp nào.
            <br />
            Khám phá Creator 10K và lưu gói cho dự án tiếp theo.
          </p>
          <button className="button button-primary" onClick={onCheckout}>
            Khám phá gói API <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <>
          <div className="orders-summary">
            <span>{drafts.length} bản nháp trên thiết bị này</span>
            <button className="text-button" onClick={onCheckout}>
              Tạo bản nháp mới <ArrowRight size={14} />
            </button>
          </div>
          <div className="orders-list">
            {drafts.map((draft) => (
              <article className="order-item" key={draft.id}>
                <div className="order-title">
                  <span className="icon-tile peach">
                    <AudioLines size={22} />
                  </span>
                  <div>
                    <h3>{draft.plan}</h3>
                    <span>
                      {new Date(draft.createdAt).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <span className="draft-status">Bản nháp</span>
                </div>
                <p className="order-reference">{draft.id}</p>
                <div className="order-meta">
                  <span>
                    {draft.credits.toLocaleString('vi-VN')} credits · {draft.periodMonths} tháng
                  </span>
                  <strong>
                    {formatCurrency(draft.price)} <small>(giá mẫu)</small>
                  </strong>
                </div>
                <div className="order-actions">
                  {confirmDelete === draft.id ? (
                    <div className="delete-confirm">
                      <span>Xóa bản nháp này?</span>
                      <button onClick={() => remove(draft.id)} className="text-button danger-text">
                        Xóa bản nháp
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="text-button">
                        Giữ lại
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        className="text-button"
                        onClick={() => downloadText(`${draft.id}.txt`, draftSummary(draft))}
                      >
                        <ArrowDownToLine size={14} /> Tải thông tin
                      </button>
                      <button
                        className="icon-button"
                        aria-label={`Xóa bản nháp ${draft.id}`}
                        onClick={() => setConfirmDelete(draft.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      <p className="orders-privacy">
        <LockKeyhole size={13} />
        <span>
          Bản nháp không phải đơn đã mua. Chỉ lưu thông tin gói trên trình duyệt này, tối đa 30 bản;
          không lưu tên, email hay API key.
        </span>
      </p>
    </div>
  )
}
