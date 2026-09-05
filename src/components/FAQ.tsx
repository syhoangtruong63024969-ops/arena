import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Headphones, Minus, Plus, Sparkles } from 'lucide-react'

const questions = [
  {
    question: '10.000 credits tương đương bao nhiêu ký tự hoặc phút audio?',
    answer:
      'Credits là đơn vị sử dụng dịch vụ. Mức tiêu hao phụ thuộc vào model, tính năng và thiết lập tại thời điểm sử dụng; số phút còn phụ thuộc vào ngôn ngữ và tốc độ đọc. Vì vậy, Voicekey không cam kết 10.000 credits bằng một số ký tự hay phút cố định. Hãy kiểm tra chính sách model trong tài liệu ElevenLabs trước khi mua.',
  },
  {
    question: 'Gói dùng trong bao lâu? Có tự động gia hạn không?',
    answer:
      'Gói Creator 10K được thiết kế cho 10.000 credits trong một tháng và không tự động gia hạn. Thời điểm kích hoạt, thời điểm hết hạn và cách xử lý credits chưa sử dụng cần được người bán xác nhận khi mở bán. Bản xem trước này không kích hoạt gói hay tính phí.',
  },
  {
    question: 'Tôi thanh toán và nhận API key như thế nào?',
    answer:
      'Ở bản xem trước, bạn chỉ có thể tạo đơn nháp và tải thông tin tham khảo. Chưa có thanh toán, chưa có email gửi đi và chưa có API key được cấp. Khi người bán kết nối cổng thanh toán, nút mua sẽ dẫn sang trang thanh toán của nhà cung cấp; việc xác thực giao dịch và cấp key phải do backend an toàn đảm nhiệm.',
  },
  {
    question: 'Giọng đọc trong Voice Studio có phải của ElevenLabs không?',
    answer:
      'Không. Voice Studio hiện dùng Web Speech API và các giọng đọc có sẵn trên trình duyệt/thiết bị, không gọi ElevenLabs và không trừ credits. Các phong cách chỉ thay đổi tốc độ, cao độ; chúng không đại diện cho thư viện giọng ElevenLabs. Kéo thả một file .txt UTF-8 tối đa 100 KB, với nội dung không quá 500 ký tự, để thử giao diện.',
  },
  {
    question: 'Tôi có thể dùng nội dung tạo ra cho mục đích thương mại?',
    answer:
      'Quyền sử dụng thương mại phụ thuộc vào điều khoản của ElevenLabs, quyền đối với giọng nói và giấy phép thực tế của gói được cấp. Không mặc định gói này có mọi quyền thương mại. Hãy yêu cầu người bán xác nhận quyền phân phối, loại tài khoản, quyền đối với giọng nói và phạm vi sử dụng trước khi thanh toán. Không dùng giọng nói để giả mạo hay xâm phạm quyền của người khác.',
  },
]

export function FAQ({ onSupport, onCheckout }: { onSupport: () => void; onCheckout: () => void }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <>
      <section className="faq-section section-anchor" id="faq" aria-labelledby="faq-title">
        <div className="faq-heading">
          <div className="section-kicker">
            <span /> MỘT CHÚT GIẢI ĐÁP
          </div>
          <h2 id="faq-title">
            Bạn hỏi.
            <br />
            Voicekey trả lời.
          </h2>
          <p>
            Rõ ràng ngay từ đầu,
            <br />
            để bạn an tâm sáng tạo.
          </p>
          <button className="text-button" onClick={onSupport}>
            <Headphones size={16} /> Cần thêm hỗ trợ? <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="faq-list">
          {questions.map((item, index) => (
            <div className={`faq-item ${open === index ? 'faq-open' : ''}`} key={item.question}>
              <h3>
                <button
                  id={`faq-question-${index}`}
                  aria-expanded={open === index}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setOpen(open === index ? null : index)}
                >
                  <span>{item.question}</span>
                  {open === index ? <Minus size={18} /> : <Plus size={18} />}
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {open === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    className="faq-answer"
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24 }}
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
      <section className="closing-banner" aria-labelledby="closing-title">
        <div>
          <span>
            <Sparkles size={14} /> MỘT Ý TƯỞNG HAY XỨNG ĐÁNG ĐƯỢC LẮNG NGHE
          </span>
          <h2 id="closing-title">
            Câu chuyện tiếp theo, <em>là của bạn.</em>
          </h2>
        </div>
        <button className="button button-dark" onClick={onCheckout}>
          Bắt đầu với Creator 10K <ArrowRight size={17} />
        </button>
        <svg className="closing-waves" viewBox="0 0 400 230" fill="none" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <path
              key={index}
              d={`M${30 + index * 14} -20C${-10 + index * 14} 80 ${240 + index * 14} 60 ${170 + index * 14} 170S${320 + index * 14} 280 430 180`}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </svg>
      </section>
    </>
  )
}
