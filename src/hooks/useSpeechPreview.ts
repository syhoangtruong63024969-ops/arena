import { useCallback, useEffect, useRef, useState } from 'react'
import { estimateSeconds } from '../lib/utils'

export interface SpeechStyle {
  rate: number
  pitch: number
}

type SpeechStatus = 'idle' | 'loading' | 'playing'

export function useSpeechPreview(notify: (message: string) => void) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() =>
    supported ? window.speechSynthesis.getVoices() : [],
  )
  const [status, setStatus] = useState<SpeechStatus>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [progress, setProgress] = useState(0)
  const utterance = useRef<SpeechSynthesisUtterance | null>(null)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startedAt = useRef(0)
  const expectedDuration = useRef(1)

  const stop = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current)
    if (utterance.current) {
      utterance.current.onstart = null
      utterance.current.onend = null
      utterance.current.onerror = null
      utterance.current.onboundary = null
      utterance.current = null
    }
    if (supported) window.speechSynthesis.cancel()
    setStatus('idle')
    setProgress(0)
    setElapsed(0)
  }, [supported])

  useEffect(() => {
    if (!supported) return
    const refresh = () => setVoices(window.speechSynthesis.getVoices())
    window.speechSynthesis.addEventListener('voiceschanged', refresh)
    const refreshTimer = window.setTimeout(refresh, 150)
    return () => {
      window.clearTimeout(refreshTimer)
      window.speechSynthesis.removeEventListener('voiceschanged', refresh)
      if (timeout.current) clearTimeout(timeout.current)
      if (utterance.current) {
        utterance.current.onstart = null
        utterance.current.onend = null
        utterance.current.onerror = null
        utterance.current.onboundary = null
      }
      window.speechSynthesis.cancel()
    }
  }, [supported])

  useEffect(() => {
    if (status !== 'playing') return
    const timer = window.setInterval(() => {
      const seconds = (Date.now() - startedAt.current) / 1000
      setElapsed(seconds)
      setProgress((current) =>
        Math.max(current, Math.min(seconds / expectedDuration.current, 0.95)),
      )
    }, 150)
    return () => window.clearInterval(timer)
  }, [status])

  function play(text: string, style: SpeechStyle, language: string, speed: number) {
    stop()
    if (!supported) {
      notify('Trình duyệt chưa hỗ trợ đọc văn bản. Hãy thử Chrome, Edge hoặc Safari mới nhất.')
      return
    }
    if (!text.trim()) {
      notify('Hãy nhập một vài câu hoặc thả file .txt trước khi nghe thử nhé.')
      return
    }
    const currentVoices = window.speechSynthesis.getVoices()
    const voice = currentVoices.find((item) =>
      item.lang.toLowerCase().startsWith(language.toLowerCase()),
    )
    if (!voice) {
      notify(
        `Thiết bị chưa có giọng ${language === 'vi' ? 'tiếng Việt' : 'tiếng Anh'}. Hãy cài giọng đọc trong cài đặt thiết bị hoặc thử ngôn ngữ khác.`,
      )
      return
    }
    const speech = new SpeechSynthesisUtterance(text)
    speech.voice = voice
    speech.lang = voice.lang
    speech.pitch = style.pitch
    speech.rate = speed * style.rate
    expectedDuration.current = Math.max(1, estimateSeconds(text, speech.rate))
    utterance.current = speech
    setStatus('loading')
    timeout.current = window.setTimeout(() => {
      stop()
      notify('Giọng đọc chưa phản hồi. Kiểm tra âm lượng, kết nối của giọng đọc và thử lại nhé.')
    }, 10_000)
    speech.onstart = () => {
      if (timeout.current) clearTimeout(timeout.current)
      startedAt.current = Date.now()
      setStatus('playing')
    }
    speech.onboundary = (event) => {
      if (event.charIndex > 0)
        setProgress((current) => Math.max(current, Math.min(event.charIndex / text.length, 0.98)))
    }
    speech.onend = () => {
      setStatus('idle')
      setProgress(1)
      utterance.current = null
    }
    speech.onerror = (event) => {
      stop()
      if (event.error !== 'interrupted' && event.error !== 'canceled')
        notify(
          'Không thể phát giọng đọc lúc này. Hãy chọn ngôn ngữ khác hoặc thử lại trên thiết bị của bạn.',
        )
    }
    window.speechSynthesis.speak(speech)
  }

  return { play, stop, status, elapsed, progress, voices, supported }
}
