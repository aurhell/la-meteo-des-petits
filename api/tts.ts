import { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * API Route Vercel pour proxy les appels ElevenLabs TTS
 * La clé API est stockée en tant que variable d'environnement Vercel (jamais exposée)
 *
 * Utilisation:
 *   POST /api/tts
 *   Body: { text: "Texte à convertir", voiceId: "EXAVITQu4vr4xnSDxMaL" }
 *   Response: ArrayBuffer (audio en mp3)
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || ''
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1/text-to-speech'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Seul POST est autorisé
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Validation de la clé
  if (!ELEVENLABS_API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY non configurée')
    return res.status(500).json({
      error: 'Configuration error: API key missing',
    })
  }

  try {
    const { text, voiceId } = req.body

    // Validation des paramètres
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid text parameter' })
    }

    if (!voiceId || typeof voiceId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid voiceId parameter' })
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text too long (max 5000 characters)' })
    }

    // Appel à ElevenLabs avec la clé (sécurisée côté serveur)
    const response = await fetch(`${ELEVENLABS_BASE_URL}/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.75,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ ElevenLabs API error:', error)
      return res.status(response.status).json({
        error: `ElevenLabs API error: ${response.statusText}`,
      })
    }

    // Récupérer l'audio et le retourner
    const audioBuffer = await response.arrayBuffer()

    // Headers pour l'audio
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=86400') // Cache 24h
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Envoyer l'audio au client
    return res.send(Buffer.from(audioBuffer))
  } catch (error) {
    console.error('❌ TTS API error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
