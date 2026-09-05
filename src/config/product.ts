import { isValidEmail, parsePrice, validHttpsUrl } from '../lib/utils'

const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL?.trim() || ''
const checkoutUrl = validHttpsUrl(import.meta.env.VITE_CHECKOUT_URL)

/** Public storefront settings only. Never put an API key or payment secret here. */
export const product = Object.freeze({
  brand: 'Voicekey',
  name: 'Creator 10K',
  provider: 'ElevenLabs',
  credits: 10_000,
  periodMonths: 1,
  price: parsePrice(import.meta.env.VITE_PLAN_PRICE_VND),
  checkoutUrl,
  isDemo: !checkoutUrl,
  supportEmail: isValidEmail(supportEmail) ? supportEmail : null,
  documentationUrl: 'https://elevenlabs.io/docs/api-reference/text-to-speech/convert',
})
