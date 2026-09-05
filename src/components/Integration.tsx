import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Check,
  CheckCheck,
  Code2,
  Copy,
  ExternalLink,
  LockKeyhole,
} from 'lucide-react'
import { product } from '../config/product'
import { snippets, type SnippetLanguage } from '../lib/snippets'

const languages = Object.keys(snippets) as SnippetLanguage[]

function HighlightedCode({ code }: { code: string }) {
  return (
    <>
      {code.split('\n').map((line, index) => (
        <span className="code-line" key={index}>
          <span className="line-number" aria-hidden="true">
            {index + 1}
          </span>
          <span>
            {line.trim().startsWith('//') || line.trim().startsWith('#') ? (
              <span className="syntax-comment">{line || ' '}</span>
            ) : (
              line
                .split(/('[^']*'|"[^"]*"|\b(?:const|await|import|from|if|throw|new|return)\b)/gu)
                .map((part, partIndex) => (
                  <span
                    key={partIndex}
                    className={
                      /^['"]/u.test(part)
                        ? 'syntax-string'
                        : /^(const|await|import|from|if|throw|new|return)$/u.test(part)
                          ? 'syntax-keyword'
                          : ''
                    }
                  >
                    {part || ' '}
                  </span>
                ))
            )}
          </span>
        </span>
      ))}
    </>
  )
}

export function Integration({ notify }: { notify: (message: string) => void }) {
  const [language, setLanguage] = useState<SnippetLanguage>('Node.js')
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippets[language])
      setCopied(true)
      notify(
        `Đã sao chép ví dụ ${language}. Chạy đoạn mã ở backend và dùng biến môi trường cho API key.`,
      )
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2200)
    } catch {
      notify('Trình duyệt chưa cho phép sao chép. Bạn có thể chọn và sao chép đoạn mã trực tiếp.')
    }
  }

  function changeTab(event: KeyboardEvent, index: number) {
    let target = index
    if (event.key === 'ArrowRight') target = (index + 1) % languages.length
    else if (event.key === 'ArrowLeft') target = (index - 1 + languages.length) % languages.length
    else if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = languages.length - 1
    else return
    event.preventDefault()
    setLanguage(languages[target])
    setCopied(false)
    tabs.current[target]?.focus()
  }

  return (
    <section
      className="integration-section section-anchor"
      id="integration"
      aria-labelledby="integration-title"
    >
      <motion.div
        className="integration-copy"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
      >
        <div className="section-kicker">
          <span /> DÀNH CHO DEVELOPER
        </div>
        <h2 id="integration-title">
          Tích hợp đơn giản.
          <br />
          Sáng tạo không ngắt nhịp.
        </h2>
        <p>
          Từ dòng code đầu tiên đến âm thanh đầu tiên.
          <br />
          Bạn đã có sẵn một nơi để bắt đầu.
        </p>
        <ol className="integration-steps">
          <li>
            <span>01</span>
            <div>
              <strong>Chuẩn bị API key & voice ID</strong>
              <p>Dùng thông tin được cấp hợp lệ từ nhà cung cấp.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>Gửi văn bản từ backend</strong>
              <p>Chọn model và chất giọng phù hợp với nội dung.</p>
            </div>
          </li>
          <li>
            <span>
              <Check size={15} />
            </span>
            <div>
              <strong>Nhận âm thanh. Kể câu chuyện.</strong>
              <p>Lưu file và mang giọng nói vào sản phẩm của bạn.</p>
            </div>
          </li>
        </ol>
        <a
          className="text-button documentation-link"
          href={product.documentationUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Tài liệu chính thức ElevenLabs <ArrowUpRight size={16} />
        </a>
      </motion.div>
      <motion.div
        className="code-window"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="code-window-title">
          <span className="window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            <Code2 size={13} /> your-next-idea
          </span>
          <ExternalLink size={13} aria-hidden="true" />
        </div>
        <div className="code-toolbar">
          <div role="tablist" aria-label="Ngôn ngữ lập trình">
            {languages.map((item, index) => (
              <button
                key={item}
                ref={(element) => {
                  tabs.current[index] = element
                }}
                role="tab"
                id={`tab-${index}`}
                aria-selected={language === item}
                aria-controls="code-panel"
                tabIndex={language === item ? 0 : -1}
                className={language === item ? 'code-tab-active' : ''}
                onClick={() => {
                  setLanguage(item)
                  setCopied(false)
                }}
                onKeyDown={(event) => changeTab(event, index)}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            className="code-copy"
            aria-label={`Sao chép mã ${language}`}
            onClick={() => void copy()}
          >
            {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>
        <pre
          id="code-panel"
          className="code-content"
          role="tabpanel"
          aria-labelledby={`tab-${languages.indexOf(language)}`}
          tabIndex={0}
        >
          <code>
            <HighlightedCode code={snippets[language]} />
          </code>
        </pre>
        <div className="code-security">
          <LockKeyhole size={13} />
          <span>Chỉ dùng ở backend. Không chia sẻ API key công khai.</span>
          <span className="code-security-dot" />
        </div>
      </motion.div>
    </section>
  )
}
