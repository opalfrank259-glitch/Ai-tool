import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Determine port and host:
// In dev mode, AI Studio dev server runs on port 3000 and host 0.0.0.0.
// AI Studio passes --port 3000 --host 0.0.0.0 via CLI arguments.
let port = 3000;
let host = '0.0.0.0';

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port' && args[i + 1]) {
    port = Number(args[i + 1]);
  } else if (args[i].startsWith('--port=')) {
    port = Number(args[i].split('=')[1]);
  } else if (args[i] === '--host' && args[i + 1]) {
    host = args[i + 1];
  } else if (args[i].startsWith('--host=')) {
    host = args[i].split('=')[1];
  }
}

// In production only (when launched via npm start on Cloud Run without CLI flags), use process.env.PORT
if (process.env.NODE_ENV === 'production' && !args.some(a => a.includes('port')) && process.env.PORT) {
  port = Number(process.env.PORT);
}

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI client if key exists
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to init GoogleGenAI client:', err);
  }
}

// Model configuration
// Note: Per user instruction:
const STANDARD_MODEL = 'gemini-3.8-flash';
const THINKING_MODEL = 'gemini-4-argon';

function withTimeout<T>(promise: Promise<T>, timeoutMs = 6000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timed out')), timeoutMs)
    ),
  ]);
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    models: { standard: STANDARD_MODEL, thinking: THINKING_MODEL },
    time: new Date().toISOString(),
  });
});

// AI Mentor chat endpoint with High Thinking capability
app.post('/api/ai/mentor', async (req, res) => {
  const { message, projectContext, currentStep, language = 'ur-roman', enableHighThinking = false } = req.body;

  const systemInstruction = `You are the expert, patient AI Design Tutor of "AI Design Tutor & Creator" for Photoshop and Photopea.
Rules:
1. Answer in the user's requested language (${language === 'ur-roman' ? 'Roman Urdu (e.g. "Aap Text Tool lein aur...")' : language === 'ur' ? 'Urdu (Nastaliq friendly)' : 'Clear English'}). Keep design software tool and menu names in English (e.g., "Move Tool", "Blending Options", "Hue/Saturation").
2. Explain clearly what the tool does, why it is used, and exact step-by-step guidance.
3. Be supportive, concise (under 150 words unless high thinking is requested), and direct.
4. Current step context: ${JSON.stringify(currentStep || {})}
5. Project brief context: ${JSON.stringify(projectContext || {})}`;

  if (aiClient) {
    try {
      const modelToUse = enableHighThinking ? THINKING_MODEL : STANDARD_MODEL;
      const config: any = {
        systemInstruction,
      };

      if (enableHighThinking) {
        config.thinkingConfig = {
          thinkingLevel: 'HIGH',
        };
        // Per instruction: Do not set maxOutputTokens for high thinking
      } else {
        config.maxOutputTokens = 800;
      }

      const response = await withTimeout(
        aiClient.models.generateContent({
          model: modelToUse,
          contents: message,
          config,
        }),
        7000
      );

      const reply = response.text || 'Koi jawab nahi mil saka.';
      return res.json({
        ok: true,
        reply,
        modelUsed: modelToUse,
        highThinkingEnabled: enableHighThinking,
      });
    } catch (error: any) {
      console.warn('Gemini API call failed, falling back to smart tutor response:', error?.message);
    }
  }

  // Graceful smart tutor fallback
  let fallbackReply = '';
  const lowerMsg = (message || '').toLowerCase();
  if (lowerMsg.includes('blurry') || lowerMsg.includes('dhundla') || lowerMsg.includes('blur')) {
    fallbackReply = language === 'ur-roman'
      ? 'Aap ka text ya image blur is liye ho sakti hai kyunke canvas resolution 72 DPI hai ya font size bohot chhota rakh kar transform tool se khaincha gaya hai. Solution: Canvas ki resolution 300 DPI karein aur text layer ko rasterize mat karein, hamesha vector/type layer rehne dein.'
      : 'Your text or image might look blurry because canvas resolution is set to 72 DPI instead of 300 DPI, or text was stretched after rasterizing. Keep text layers as native vector type layers and ensure anti-aliasing is set to "Sharp" or "Smooth".';
  } else if (lowerMsg.includes('shortcut') || lowerMsg.includes('key')) {
    fallbackReply = language === 'ur-roman'
      ? 'Photoshop/Photopea ke important shortcuts: Move Tool (V), Type Tool (T), Brush Tool (B), Free Transform (Ctrl/Cmd + T), Undo (Ctrl/Cmd + Z), Deselect (Ctrl/Cmd + D).'
      : 'Essential shortcuts: Move Tool (V), Type Tool (T), Brush (B), Free Transform (Ctrl/Cmd + T), Deselect (Ctrl/Cmd + D).';
  } else if (lowerMsg.includes('simpler') || lowerMsg.includes('asan') || lowerMsg.includes('easy')) {
    fallbackReply = language === 'ur-roman'
      ? 'Asaan alfaaz me: Step 1 pe sirf ek background layer banayein aur uspar halka sa dark gradient dalein taake agla text saaf parha ja sake. Jaldbazi na karein, pehle canvas set karein.'
      : 'In simple terms: First establish your canvas and background contrast before placing text. One element at a time.';
  } else {
    fallbackReply = language === 'ur-roman'
      ? `Main aap ka AI Design Ustaad hoon! Is step par: "${currentStep?.title || 'Current Step'}". Aap Move Tool (V) ya Type Tool (T) use karke visual hierarchy set karein. Agar koi error ya confusion ho to foran batayein!`
      : `I am your AI Design Tutor. Focus on: "${currentStep?.title || 'Current Step'}". Ensure high contrast, alignment, and proper layer grouping. Ask me anything!`;
  }

  return res.json({
    ok: true,
    reply: fallbackReply,
    modelUsed: 'local-smart-tutor',
    highThinkingEnabled: enableHighThinking,
  });
});

// AI Intake endpoint
app.post('/api/ai/intake', async (req, res) => {
  const { ideaText, language = 'ur-roman' } = req.body;
  if (!ideaText) {
    return res.status(400).json({ error: 'ideaText is required' });
  }

  if (aiClient) {
    try {
      const prompt = `Analyze this design idea: "${ideaText}".
Rules:
1. Category is promotional poster / social banner.
2. Never invent phone numbers, addresses, prices, or dates. Any unconfirmed details must be listed under placeholders.
3. List at most 3 essential missing questions (in ${language}).
4. Return JSON only with fields: businessName, category, targetAudience, assumptions (array), placeholders (array), missingQuestions (array of {key, question}).`;

      const response = await withTimeout(
        aiClient.models.generateContent({
          model: STANDARD_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            maxOutputTokens: 1000,
          },
        }),
        6000
      );

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ ok: true, data: parsed, modelUsed: STANDARD_MODEL });
      }
    } catch (e: any) {
      console.warn('Gemini intake failed, falling back:', e?.message);
    }
  }

  // Fallback
  return res.json({
    ok: true,
    data: {
      businessName: ideaText.split(' ')[0] ? `${ideaText.split(' ')[0]} Brand` : 'Custom Brand',
      category: 'Promotional Poster',
      assumptions: ['1080x1080px Square format for social & flex print', '300 DPI high resolution'],
      placeholders: ['Contact phone number & address', 'Promotional offer dates'],
      missingQuestions: [
        { key: 'exactBusinessName', question: 'What is the exact spelling of your brand name?' },
        { key: 'offer', question: 'What is the primary discount or offer to feature?' },
        { key: 'contactInfo', question: 'What phone number or address should customers see?' },
      ],
    },
    modelUsed: 'local-rule-engine',
  });
});

// AI Concepts endpoint
app.post('/api/ai/concepts', async (req, res) => {
  const { brief, brandName = 'Your Brand' } = req.body;

  if (aiClient) {
    try {
      const prompt = `Generate 2 distinct visual design directions for a promotional poster for ${brandName}.
Brief: ${JSON.stringify(brief || {})}
Return JSON array of 2 concepts with: title, oneLineIdea, mood, palette (array of 4-5 {name, hex}), typographyDirection, layoutDirection, pros (array), limitations (array).`;

      const response = await withTimeout(
        aiClient.models.generateContent({
          model: STANDARD_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            maxOutputTokens: 1200,
          },
        }),
        6000
      );

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ ok: true, data: parsed, modelUsed: STANDARD_MODEL });
      }
    } catch (e: any) {
      console.warn('Gemini concepts failed, falling back:', e?.message);
    }
  }

  return res.json({
    ok: true,
    data: [
      {
        title: 'Heritage Warmth & Royal Feast',
        oneLineIdea: `Rich textured backdrop with golden warm accents highlighting ${brandName}.`,
        mood: 'Authentic & Premium',
        palette: [{ name: 'Deep Crimson', hex: '#450A0A' }, { name: 'Gold', hex: '#F59E0B' }, { name: 'Charcoal', hex: '#1C1917' }],
        typographyDirection: 'Commanding display serif/sans header with generous leading.',
        layoutDirection: 'Central focal hero with radial soft glow.',
        pros: ['High contrast', 'Photorealistic depth'],
        limitations: ['Needs clean subject cutout'],
      },
      {
        title: 'Modern High Energy Pop',
        oneLineIdea: 'Clean vibrant solid color blocks with bold typographic hierarchy and sharp badges.',
        mood: 'Fast & Dynamic',
        palette: [{ name: 'Chili Red', hex: '#E11D48' }, { name: 'Yellow', hex: '#FACC15' }, { name: 'Onyx', hex: '#09090B' }],
        typographyDirection: 'Ultra-bold geometric sans-serif.',
        layoutDirection: 'Dynamic diagonal split layout.',
        pros: ['Extreme mobile stopping power'],
        limitations: ['Less subtle than Heritage style'],
      },
    ],
    modelUsed: 'local-rule-engine',
  });
});

// Setup Vite in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
  });
}

startServer();
