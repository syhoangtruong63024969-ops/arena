import { useRef, useState, type DragEvent, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, Reorder, useDragControls } from 'framer-motion'
import {
  ArrowDownToLine,
  ArrowRight,
  AudioLines,
  Check,
  ChevronDown,
  FileText,
  GripVertical,
  Info,
  Languages,
  LoaderCircle,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Upload,
  X,
} from 'lucide-react'
import { useSpeechPreview } from '../hooks/useSpeechPreview'
import {
  countCharacters,
  downloadText,
  estimateSeconds,
  formatTime,
  readTextFile,
  TEXT_LIMIT,
} from '../lib/utils'

const SAMPLE_VI =
  'Mỗi ý tưởng đều xứng đáng được cất lời. Một câu chuyện hay không chỉ được kể bằng con chữ, mà còn bằng cảm xúc. Cùng Voicekey, hãy để chất giọng của bạn chạm đến những điều khác biệt.'
const SAMPLE_EN =
  'Every idea deserves to be heard. A great story is more than words on a page. It is a feeling, a connection, a little spark of possibility. Give your next idea a voice of its own.'

const STYLES = [
  {
    id: 'natural',
    name: 'Tự nhiên',
    description: 'Gần gũi · Dễ nghe',
    color: 'peach',
    pitch: 1.02,
    rate: 1,
    symbol: '✳',
  },
  {
    id: 'story',
    name: 'Kể chuyện',
    description: 'Chậm rãi · Truyền cảm',
    color: 'lavender',
    pitch: 1.05,
    rate: 0.86,
    symbol: '✦',
  },
  {
    id: 'warm',
    name: 'Trầm ấm',
    description: 'Điềm tĩnh · Ấm áp',
    color: 'mint',
    pitch: 0.8,
    rate: 0.92,
    symbol: '◒',
  },
  {
    id: 'bright',
    name: 'Năng động',
    description: 'Tươi sáng · Rộn ràng',
    color: 'blue',
    pitch: 1.18,
    rate: 1.1,
    symbol: '✺',
  },
]

type VoiceStyle = (typeof STYLES)[number]

function StyleCard({
  style,
  selected,
  onSelect,
  onMove,
}: {
  style: VoiceStyle
  selected: boolean
  onSelect: () => void
  onMove: (direction: number) => void
}) {
  const controls = useDragControls()
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      onMove(event.key === 'ArrowLeft' ? -1 : 1)
    }
  }
  return (
    <Reorder.Item
      value={style}
      className={`style-card ${selected ? 'style-selected' : ''}`}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.045, boxShadow: '0 12px 25px rgba(45, 38, 31, 0.12)', zIndex: 2 }}
    >
      <button className="style-select" aria-pressed={selected} onClick={onSelect}>
        <span className={`voice-orb ${style.color}`} aria-hidden="true">
          {style.symbol}
        </span>
        <span>
          <strong>{style.name}</strong>
          <small>{style.description}</small>
        </span>
        {selected && (
          <span className="style-check">
            <Check size={10} strokeWidth={3} />
          </span>
        )}
      </button>
      <button
        className="drag-handle"
        aria-label={`Di chuyển ${style.name}. Dùng phím mũi tên trái hoặc phải để sắp xếp.`}
        title="Kéo để sắp xếp · hoặc dùng phím ← →"
        onPointerDown={(event) => controls.start(event)}
        onKeyDown={onKeyDown}
      >
        <GripVertical size={15} />
      </button>
    </Reorder.Item>
  )
}

export function Studio({
  notify,
  onCheckout,
}: {
  notify: (message: string) => void
  onCheckout: () => void
}) {
  const [text, setText] = useState(SAMPLE_VI)
  const [styles, setStyles] = useState(STYLES)
  const [selectedId, setSelectedId] = useState('natural')
  const [language, setLanguage] = useState('vi')
  const [speed, setSpeed] = useState(1)
  const [dragging, setDragging] = useState(false)
  const [importing, setImporting] = useState(false)
  const [filename, setFilename] = useState('')
  const [fileError, setFileError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)
  const textarea = useRef<HTMLTextAreaElement>(null)
  const dragDepth = useRef(0)
  const importSequence = useRef(0)
  const speech = useSpeechPreview(notify)
  const selectedStyle = STYLES.find((style) => style.id === selectedId) || STYLES[0]
  const count = countCharacters(text)
  const isPlaying = speech.status !== 'idle'
  const duration = estimateSeconds(text, speed * selectedStyle.rate)
  const voiceAvailable = speech.voices.some((voice) =>
    voice.lang.toLowerCase().startsWith(language),
  )

  async function importFile(files: FileList | File[] | null) {
    if (!files?.length) return
    if (files.length > 1) {
      setFileError('Mỗi lần chỉ thả một file .txt nhé.')
      return
    }
    // FileList is live: snapshot the File before the input is reset or awaited.
    const file = files[0]
    speech.stop()
    const sequence = ++importSequence.current
    setImporting(true)
    setFileError('')
    try {
      const content = await readTextFile(file)
      if (sequence !== importSequence.current) return
      setText(content)
      setFilename(file.name)
      notify(`Đã nhập ${countCharacters(content)} ký tự từ ${file.name}.`)
      textarea.current?.focus({ preventScroll: true })
    } catch (error) {
      if (sequence === importSequence.current)
        setFileError(
          error instanceof Error ? error.message : 'Không thể đọc file. Vui lòng thử lại.',
        )
    } finally {
      if (sequence === importSequence.current) setImporting(false)
    }
  }

  function onDrop(event: DragEvent) {
    event.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    void importFile(event.dataTransfer.files)
  }

  function moveStyle(id: string, direction: number) {
    const current = styles.findIndex((style) => style.id === id)
    const target = current + direction
    if (target < 0 || target >= styles.length) return
    const reordered = [...styles]
    const [moved] = reordered.splice(current, 1)
    reordered.splice(target, 0, moved)
    setStyles(reordered)
    notify(`Đã chuyển phong cách ${moved.name} đến vị trí ${target + 1}.`)
  }

  function changeLanguage(value: string) {
    speech.stop()
    setLanguage(value)
    if (text === SAMPLE_VI || text === SAMPLE_EN) setText(value === 'vi' ? SAMPLE_VI : SAMPLE_EN)
  }

  return (
    <section className="studio-section section-anchor" id="studio" aria-labelledby="studio-title">
      <div className="section-heading">
        <div>
          <div className="section-kicker">
            <span /> VOICE STUDIO
          </div>
          <h2 id="studio-title">Đừng chỉ tưởng tượng. Hãy lắng nghe.</h2>
          <p>Một đoạn văn nhỏ. Một chút cảm xúc. Thử chất giọng của bạn.</p>
        </div>
        <span className="studio-free-tag">
          <Sparkles size={14} /> Không tốn credits
        </span>
      </div>
      <motion.div
        className="studio-shell"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.45 }}
      >
        <div className="studio-toolbar">
          <div className="studio-tab">
            <AudioLines size={17} /> Văn bản thành giọng nói <span>DEMO</span>
          </div>
          <div className="studio-toolbar-right">
            <span className="live-dot" /> Không gian thử nghiệm
          </div>
        </div>
        <div className="studio-body">
          <div className="style-list-heading">
            <label>
              01 <span>Chọn phong cách đọc</span>
            </label>
            <span>
              <GripVertical size={13} /> Kéo để đổi vị trí
            </span>
          </div>
          <div className="style-scroll">
            <Reorder.Group
              axis="x"
              values={styles}
              onReorder={setStyles}
              className="style-list"
              aria-label="Các phong cách đọc có thể kéo để sắp xếp"
            >
              {styles.map((style) => (
                <StyleCard
                  key={style.id}
                  style={style}
                  selected={selectedId === style.id}
                  onSelect={() => {
                    speech.stop()
                    setSelectedId(style.id)
                  }}
                  onMove={(direction) => moveStyle(style.id, direction)}
                />
              ))}
            </Reorder.Group>
          </div>
          <div className="editor-heading">
            <label htmlFor="speech-text">
              02 <span>Thêm lời muốn nói</span>
            </label>
            <div className="language-select">
              <Languages size={14} />
              <select
                aria-label="Ngôn ngữ giọng đọc"
                value={language}
                onChange={(event) => changeLanguage(event.target.value)}
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
              <ChevronDown size={12} />
            </div>
          </div>
          <div
            className={`text-editor ${dragging ? 'dragging' : ''} ${fileError ? 'has-error' : ''}`}
            onDragEnter={(event) => {
              event.preventDefault()
              if (event.dataTransfer.types.includes('Files')) {
                dragDepth.current += 1
                setDragging(true)
              }
            }}
            onDragLeave={(event) => {
              event.preventDefault()
              dragDepth.current -= 1
              if (dragDepth.current <= 0) setDragging(false)
            }}
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = 'copy'
            }}
            onDrop={onDrop}
          >
            {filename && (
              <div className="imported-file">
                <FileText size={12} />
                <span>{filename}</span>
                <button aria-label="Bỏ nhãn file đã nhập" onClick={() => setFilename('')}>
                  <X size={12} />
                </button>
              </div>
            )}
            <textarea
              id="speech-text"
              ref={textarea}
              value={text}
              spellCheck={false}
              aria-describedby="text-counter studio-disclaimer"
              placeholder="Viết một điều gì đó thật hay… hoặc kéo file .txt vào đây."
              disabled={importing}
              onChange={(event) => {
                speech.stop()
                setText(Array.from(event.target.value).slice(0, TEXT_LIMIT).join(''))
                setFilename('')
                setFileError('')
              }}
            />
            <div className="editor-bottom">
              <button
                className="text-button upload-button"
                onClick={() => fileInput.current?.click()}
                disabled={importing}
              >
                {importing ? <LoaderCircle size={14} className="spin" /> : <Upload size={14} />}
                <span>{importing ? 'Đang đọc file…' : 'Thả file .txt hoặc tải lên'}</span>
              </button>
              <span id="text-counter" className={count === TEXT_LIMIT ? 'at-limit' : ''}>
                {count}
                <span> / {TEXT_LIMIT} ký tự</span>
              </span>
            </div>
            <input
              ref={fileInput}
              className="sr-only"
              type="file"
              accept=".txt,text/plain"
              aria-label="Tải file văn bản .txt"
              tabIndex={-1}
              onChange={(event) => {
                void importFile(event.target.files)
                event.target.value = ''
              }}
            />
            <AnimatePresence>
              {dragging && (
                <motion.div
                  className="drop-overlay"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="drop-icon">
                    <Upload size={28} />
                  </span>
                  <strong>Thả ý tưởng của bạn vào đây</strong>
                  <span>File .txt · tối đa 100 KB và 500 ký tự</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {fileError && (
            <p className="file-error" role="alert">
              <Info size={14} />
              {fileError}
              <button
                className="icon-button"
                aria-label="Đóng lỗi nhập file"
                onClick={() => setFileError('')}
              >
                <X size={14} />
              </button>
            </p>
          )}
          <div className="editor-controls">
            <div className="speed-control">
              <label htmlFor="voice-speed">Tốc độ</label>
              <input
                id="voice-speed"
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={speed}
                aria-valuetext={`${speed.toFixed(2)} lần`}
                onChange={(event) => {
                  speech.stop()
                  setSpeed(Number(event.target.value))
                }}
              />
              <output htmlFor="voice-speed">{Number(speed.toFixed(2))}×</output>
            </div>
            <button
              className="text-button reset-button"
              onClick={() => {
                speech.stop()
                setText(language === 'vi' ? SAMPLE_VI : SAMPLE_EN)
                setFilename('')
                setFileError('')
                setSpeed(1)
              }}
              disabled={importing}
            >
              <RotateCcw size={13} /> Dùng văn bản mẫu
            </button>
          </div>
          <div className={`studio-player ${isPlaying ? 'is-playing' : ''}`}>
            <button
              className="player-button"
              disabled={importing || !text.trim()}
              onClick={() =>
                isPlaying ? speech.stop() : speech.play(text, selectedStyle, language, speed)
              }
              aria-label={isPlaying ? 'Dừng nghe thử' : 'Nghe thử văn bản'}
            >
              {speech.status === 'loading' ? (
                <LoaderCircle className="spin" size={20} />
              ) : isPlaying ? (
                <Square size={16} fill="currentColor" />
              ) : (
                <Play size={19} fill="currentColor" />
              )}
            </button>
            <div className="player-description">
              <strong>
                {speech.status === 'loading'
                  ? 'Đang chuẩn bị…'
                  : isPlaying
                    ? 'Đang cất lời…'
                    : 'Sẵn sàng cất lời?'}
              </strong>
              <span>
                {selectedStyle.name} <span>·</span> {language === 'vi' ? 'Tiếng Việt' : 'English'}
              </span>
            </div>
            <div className="player-wave" aria-hidden="true">
              {Array.from({ length: 55 }, (_, index) => (
                <i
                  key={index}
                  className={index / 55 <= speech.progress ? 'played' : ''}
                  style={{
                    height: `${5 + Math.abs(Math.sin(index * 0.6) * Math.cos(index * 1.7)) * 27}px`,
                    animationDelay: `${index * -0.08}s`,
                  }}
                />
              ))}
            </div>
            <span className="player-time">
              {isPlaying ? formatTime(speech.elapsed) : `~${formatTime(duration)}`}
            </span>
            <button
              className="icon-button download-script"
              aria-label="Tải văn bản đang soạn"
              title="Tải văn bản .txt — không phải file âm thanh"
              disabled={!text.trim()}
              onClick={() => {
                downloadText('voicekey-van-ban.txt', text)
                notify('Đã tải văn bản .txt. Bản thử không xuất âm thanh ElevenLabs.')
              }}
            >
              <ArrowDownToLine size={18} />
            </button>
          </div>
          <p id="studio-disclaimer" className="studio-disclaimer">
            <Info size={13} />
            <span>
              Bản thử dùng giọng đọc của trình duyệt, <strong>không phải giọng ElevenLabs.</strong>{' '}
              Phong cách chỉ điều chỉnh tốc độ và cao độ.
              {!voiceAvailable && ' Cần có giọng đọc tương ứng trên thiết bị.'}
            </span>
          </p>
        </div>
        <div className="studio-footer">
          <span>
            <span className="studio-footer-sparkle">✦</span> Ý tưởng đã sẵn sàng cho bước tiếp theo?
          </span>
          <button className="text-button" onClick={onCheckout}>
            Khám phá Creator 10K <ArrowRight size={15} />
          </button>
        </div>
      </motion.div>
    </section>
  )
}
