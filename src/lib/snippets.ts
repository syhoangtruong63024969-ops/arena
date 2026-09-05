export const snippets = {
  'Node.js': `// Chạy ở backend — không đặt API key trong trình duyệt.
import { writeFile } from 'node:fs/promises';

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;
if (!apiKey || !voiceId) throw new Error('Thiếu API key hoặc voice ID');

const response = await fetch(
  \`https://api.elevenlabs.io/v1/text-to-speech/\${encodeURIComponent(voiceId)}\`,
  {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: 'Xin chào! Mỗi ý tưởng đều xứng đáng được cất lời.',
      model_id: 'eleven_flash_v2_5',
    }),
  },
);

if (!response.ok) throw new Error(\`ElevenLabs API: \${response.status}\`);
await writeFile('voice.mp3', Buffer.from(await response.arrayBuffer()));`,
  Python: `# Chạy ở backend. Cài dependency: pip install requests
import os
from pathlib import Path
from urllib.parse import quote
import requests

api_key = os.environ['ELEVENLABS_API_KEY']
voice_id = quote(os.environ['ELEVENLABS_VOICE_ID'], safe='')

response = requests.post(
    f'https://api.elevenlabs.io/v1/text-to-speech/{voice_id}',
    headers={
        'xi-api-key': api_key,
        'Content-Type': 'application/json',
    },
    json={
        'text': 'Xin chào! Mỗi ý tưởng đều xứng đáng được cất lời.',
        'model_id': 'eleven_flash_v2_5',
    },
    timeout=60,
)
response.raise_for_status()
Path('voice.mp3').write_bytes(response.content)`,
  cURL: `# Chạy trong terminal tin cậy. Đặt biến môi trường trước khi chạy.
# ELEVENLABS_VOICE_ID là ID từ thư viện giọng nói ElevenLabs.
: "\${ELEVENLABS_API_KEY:?Cần đặt ELEVENLABS_API_KEY}"
: "\${ELEVENLABS_VOICE_ID:?Cần đặt ELEVENLABS_VOICE_ID}"

curl --fail-with-body --max-time 60 --request POST \\
  "https://api.elevenlabs.io/v1/text-to-speech/\${ELEVENLABS_VOICE_ID}" \\
  --header "xi-api-key: \${ELEVENLABS_API_KEY}" \\
  --header 'Content-Type: application/json' \\
  --data '{
    "text": "Xin chào! Mỗi ý tưởng đều xứng đáng được cất lời.",
    "model_id": "eleven_flash_v2_5"
  }' \\
  --output voice.mp3`,
} as const

export type SnippetLanguage = keyof typeof snippets
