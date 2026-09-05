export function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand ${small ? 'brand-small' : ''}`}>
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span>
        voicekey<span className="brand-period">.</span>
      </span>
    </span>
  )
}

export function ElevenLabsMark() {
  return (
    <span className="elevenlabs-mark">
      <span aria-hidden="true">Ⅱ</span> ElevenLabs
    </span>
  )
}
