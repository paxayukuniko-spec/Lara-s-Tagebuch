import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

/**
 * Direkter Download-Endpunkt für das Hostinger Webspace ZIP-Paket
 */
app.get(['/download-hostinger-zip', '/lara_tagebuch_hostinger_webspace.zip', '/lara_tagebuch_website.zip'], (_req: Request, res: Response) => {
  const possiblePaths = [
    path.resolve(__dirname, 'exports', 'lara_tagebuch_hostinger_webspace.zip'),
    path.resolve(__dirname, 'public', 'lara_tagebuch_hostinger_webspace.zip'),
    path.resolve(__dirname, 'lara_tagebuch_hostinger_webspace.zip'),
    path.resolve(__dirname, 'public', 'lara_tagebuch_website.zip'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      res.download(p, 'lara_tagebuch_hostinger_webspace.zip');
      return;
    }
  }
  res.status(404).send('Die ZIP-Datei wird vorbereitet. Bitte in Kürze erneut versuchen.');
});

// Initialisiere Gemini Client (falls GEMINI_API_KEY gesetzt ist)
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory-Cache für TTS Audios und Quota-Status
const ttsAudioCache = new Map<string, string>();
let ttsQuotaExhaustedUntil = 0;

/**
 * Text-to-Speech API Endpunkt mit Stimme "Kore"
 */
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Kore' } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text ist erforderlich' });
      return;
    }

    if (!process.env.GEMINI_API_KEY || !ai) {
      res.status(200).json({
        fallbackToSpeechSynthesis: true,
        reason: 'no_api_key',
        message: 'GEMINI_API_KEY nicht konfiguriert - Browser-Sprachausgabe aktiv.',
      });
      return;
    }

    const cleanText = text.slice(0, 1500);
    const cacheKey = `${voice}_${cleanText.slice(0, 120)}`;

    if (ttsAudioCache.has(cacheKey)) {
      res.json({
        audioUrl: ttsAudioCache.get(cacheKey),
        voiceUsed: voice,
        format: 'wav',
        cached: true,
      });
      return;
    }

    if (Date.now() < ttsQuotaExhaustedUntil) {
      res.status(200).json({
        fallbackToSpeechSynthesis: true,
        quotaExceeded: true,
        reason: 'rate_limit_cooldown',
        message: 'Gemini TTS Kontingent für heute erschöpft. Wechsle auf Browser-Sprachausgabe.',
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Extremely soft, warm, soothing audiobook narration voice of Kore, gentle breathing cadence, relaxing and intimate storytelling tone as if closing eyes and listening to a calming audiobook in a quiet room',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      res.status(200).json({
        fallbackToSpeechSynthesis: true,
        reason: 'no_audio_generated',
      });
      return;
    }

    const fullAudioUrl = `data:audio/wav;base64,${base64Audio}`;
    ttsAudioCache.set(cacheKey, fullAudioUrl);

    res.json({
      audioUrl: fullAudioUrl,
      voiceUsed: voice,
      format: 'wav',
    });
  } catch (error: any) {
    res.status(200).json({
      fallbackToSpeechSynthesis: true,
    });
  }
});

/**
 * Audio Transcription API Endpunkt mit gemini-3.5-transcribe
 */
app.post('/api/transcribe-audio', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/mp3', trackName } = req.body;

    if (!process.env.GEMINI_API_KEY || !ai) {
      res.json({
        transcribedText: `(Automatische Transkription für ${trackName || 'Audio'}): Laras Original-Sprachnotiz aus Tomb Raider (1996).`,
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          ...(audioBase64
            ? [
                {
                  inlineData: {
                    mimeType: mimeType || 'audio/mp3',
                    data: audioBase64,
                  },
                },
              ]
            : []),
          {
            text: `Transcribe this Tomb Raider audio track (${trackName || 'audio'}) and provide a concise German translation and journal description suitable for Lara Croft's expedition diary.`,
          },
        ],
      },
    });

    res.json({
      transcribedText: response.text || 'Originale Sprachaufzeichnung aus Tomb Raider.',
    });
  } catch (error: any) {
    res.json({
      transcribedText: 'Tomb Raider Sprachnotiz (Hintergrund-Synchronisation aktiv).',
    });
  }
});

/**
 * Veo Video Generation: Starte Video-Generierung für das Wohnzimmer Kaminfeuer
 */
app.post('/api/generate-fireplace-video', async (_req: Request, res: Response) => {
  try {
    if (!process.env.GEMINI_API_KEY || !ai) {
      res.status(400).json({ error: 'GEMINI_API_KEY ist nicht konfiguriert.' });
      return;
    }

    // Finde das Wohnzimmer-Bild
    let imagePath = path.resolve(__dirname, 'public/images/wohnzimmer.jpg');
    if (!fs.existsSync(imagePath)) {
      imagePath = path.resolve(__dirname, 'src/assets/images/wohnzimmer.jpg');
    }
    if (!fs.existsSync(imagePath)) {
      imagePath = path.resolve(__dirname, 'wohnzimmer.jpg');
    }

    let imageBase64 = '';
    if (fs.existsSync(imagePath)) {
      const imgBuffer = fs.readFileSync(imagePath);
      imageBase64 = imgBuffer.toString('base64');
    }

    const promptText = 'A cinematic 16:9 loop video of Lara Croft\'s manor living room with a crackling fireplace. The entire room stays absolutely still, while only the flames in the fireplace move realistically, flicker and emit glowing embers and sparks in high detail.';

    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-lite-generate-preview',
      prompt: promptText,
      ...(imageBase64 ? {
        image: {
          imageBytes: imageBase64,
          mimeType: 'image/jpeg',
        },
      } : {}),
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9',
      },
    });

    res.json({ operationName: operation.name });
  } catch (error: any) {
    console.error('Veo Video Startfehler:', error);
    res.status(500).json({ error: error?.message || 'Fehler beim Starten der Veo Video-Generierung.' });
  }
});

/**
 * Veo Video Status abfragen
 */
app.post('/api/video-status', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    if (!operationName || !ai) {
      res.status(400).json({ error: 'OperationName ist erforderlich.' });
      return;
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    res.json({
      done: updated.done,
      error: updated.error,
    });
  } catch (error: any) {
    console.error('Veo Status Fehler:', error);
    res.status(500).json({ error: error?.message || 'Fehler beim Abrufen des Video-Status.' });
  }
});

/**
 * Veo Video herunterladen
 */
app.post('/api/video-download', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;
    if (!operationName || !ai) {
      res.status(400).json({ error: 'OperationName ist erforderlich.' });
      return;
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      res.status(404).json({ error: 'Video URI nicht gefunden.' });
      return;
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY || '' },
    });

    if (!videoRes.ok) {
      res.status(500).json({ error: 'Fehler beim Herunterladen des Videos von Veo.' });
      return;
    }

    res.setHeader('Content-Type', 'video/mp4');
    const arrayBuffer = await videoRes.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error('Veo Download Fehler:', error);
    res.status(500).json({ error: error?.message || 'Fehler beim Download des Veo Videos.' });
  }
});

/**
 * Health check & Info
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    voice: 'Kore',
    appName: "Lara's Tagebuch",
  });
});

async function startServer() {
  const distIndexPath = path.resolve(__dirname, 'dist', 'index.html');
  const hasDist = fs.existsSync(distIndexPath);
  const isProd = process.env.NODE_ENV === 'production' || (hasDist && process.env.NODE_ENV !== 'development');

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
    app.use('/src/assets/images', express.static(path.resolve(__dirname, 'src/assets/images')));
    app.use(express.static(path.resolve(__dirname, 'public')));
  } else {
    // Statische Ordner für Produktions-Hosting (Hostinger Node.js, Cloud Run, VPS etc.)
    app.use('/src/assets/images', express.static(path.resolve(__dirname, 'src/assets/images')));
    app.use('/public', express.static(path.resolve(__dirname, 'public')));
    app.use(express.static(path.resolve(__dirname, 'public')));
    app.use(express.static(path.resolve(__dirname, 'dist')));

    app.get('*', (_req: Request, res: Response) => {
      if (fs.existsSync(distIndexPath)) {
        res.sendFile(distIndexPath);
      } else {
        res.sendFile(path.resolve(__dirname, 'index.html'));
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lara's Tagebuch Server läuft auf Port ${PORT} (Modus: ${isProd ? 'Production' : 'Development'})`);
  });
}

startServer().catch((err) => {
  console.error('Server Startfehler:', err);
});
