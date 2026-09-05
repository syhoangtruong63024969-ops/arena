import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  AudioLines,
  BookAudio,
  Check,
  Code2,
  Mic2,
  Play,
  Sparkles,
  Video,
  Youtube,
} from 'lucide-react'
import { ElevenLabsMark } from './Brand'

export function Hero({ navigate }: { navigate: (id: string) => void }) {
  const reduceMotion = useReducedMotion()
  return (
    <section className="hero-section section-anchor" id="overview" aria-labelledby="hero-title">
      <div className="hero-main">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="hero-eyebrow">
            <span>
              <Sparkles size={13} /> DÀNH CHO NHÀ SÁNG TẠO
            </span>
            <span className="eyebrow-line" />
          </div>
          <h1 id="hero-title">
            Biến con chữ
            <br />
            thành <em>cảm xúc.</em>
            <span className="title-spark" aria-hidden="true">
              ✳
            </span>
          </h1>
          <p className="hero-description">
            Giọng nói chạm cảm xúc. Tích hợp thật dễ dàng.
            <br className="desktop-break" /> Khơi mở ý tưởng cùng API ElevenLabs —
            <br className="desktop-break" /> từ câu chữ đầu tiên đến câu chuyện của riêng bạn.
          </p>
          <div className="hero-buttons">
            <button className="button button-primary" onClick={() => navigate('pricing')}>
              Khám phá gói API <ArrowRight size={17} />
            </button>
            <button className="button button-white" onClick={() => navigate('studio')}>
              <Play size={14} fill="currentColor" /> Thử giọng nói
            </button>
          </div>
          <div className="hero-perks">
            <span>
              <Check size={14} /> 10.000 credits / tháng
            </span>
            <span className="perk-divider" />
            <span>
              <Check size={14} /> Một gói. Thật đơn giản.
            </span>
          </div>
        </motion.div>
        <motion.div
          className="hero-art"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.1 }}
        >
          <span className="art-orbit orbit-one" aria-hidden="true" />
          <span className="art-orbit orbit-two" aria-hidden="true" />
          <motion.img
            className="sound-sculpture"
            src={`${import.meta.env.BASE_URL}images/voice-sculpture.webp`}
            alt="Tác phẩm sóng âm 3D màu cam với những dải cong mềm mại"
            width="1000"
            height="1000"
            fetchPriority="high"
            animate={reduceMotion ? {} : { y: [0, -8, 0], rotate: [-5, -2, -5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="floating-provider"
            animate={reduceMotion ? {} : { y: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="provider-label">CÔNG NGHỆ GIỌNG NÓI</span>
            <ElevenLabsMark />
          </motion.div>
          <span className="art-sparkle art-sparkle-one" aria-hidden="true">
            ✳
          </span>
          <span className="art-sparkle art-sparkle-two" aria-hidden="true">
            +
          </span>
          <motion.button
            className="floating-audio"
            onClick={() => navigate('studio')}
            aria-label="Mở Voice Studio để thử giọng nói"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="audio-play">
              <Play size={15} fill="currentColor" />
            </span>
            <span className="floating-audio-content">
              <span className="floating-audio-title">Mỗi ý tưởng, một chất giọng.</span>
              <span className="mini-wave" aria-hidden="true">
                {Array.from({ length: 37 }, (_, index) => (
                  <i
                    key={index}
                    style={{
                      height: `${7 + Math.abs(Math.sin(index * 1.6) * Math.cos(index * 0.43)) * 25}px`,
                      animationDelay: `${index * 0.035}s`,
                    }}
                  />
                ))}
              </span>
            </span>
            <span className="audio-micro">
              <AudioLines size={14} />
            </span>
          </motion.button>
          <span className="art-caption">YOUR WORDS. A WORLD OF VOICES.</span>
        </motion.div>
      </div>
      <div className="use-cases">
        <span className="use-cases-label">
          Một API.
          <br />
          <strong>Vô vàn ý tưởng.</strong>
        </span>
        <div className="use-case">
          <Youtube size={22} strokeWidth={1.5} />
          <span>YouTube</span>
        </div>
        <div className="use-case">
          <Mic2 size={21} strokeWidth={1.6} />
          <span>Podcast</span>
        </div>
        <div className="use-case">
          <Video size={23} strokeWidth={1.5} />
          <span>Video ngắn</span>
        </div>
        <div className="use-case">
          <BookAudio size={22} strokeWidth={1.5} />
          <span>Sách nói</span>
        </div>
        <div className="use-case">
          <Code2 size={23} strokeWidth={1.5} />
          <span>Ứng dụng AI</span>
        </div>
      </div>
    </section>
  )
}
