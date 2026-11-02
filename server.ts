import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory + file-backed storage directory for cloud sync
const DATA_DIR = path.resolve(process.cwd(), '.data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const SYNC_FILE = path.join(DATA_DIR, 'cloud_sync.json');

interface CloudStore {
  [syncCode: string]: {
    updatedAt: number;
    deviceCount: number;
    petsData: any;
    recentLetters: any[];
    diaryEntries?: any[];
  };
}

let cloudStore: CloudStore = {};

if (fs.existsSync(SYNC_FILE)) {
  try {
    cloudStore = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf-8'));
  } catch (e) {
    console.error('Failed to parse cloud sync file, initializing empty store', e);
  }
}

function saveStore() {
  try {
    fs.writeFileSync(SYNC_FILE, JSON.stringify(cloudStore, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save cloud sync store', e);
  }
}

// Cloud Sync APIs
app.get('/api/sync/:code', (req: Request, res: Response) => {
  const code = (req.params.code || '').trim().toUpperCase();
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  const data = cloudStore[code];
  if (!data) {
    return res.status(404).json({ error: 'Sync code not found' });
  }

  return res.json({
    success: true,
    code,
    updatedAt: data.updatedAt,
    petsData: data.petsData,
    recentLetters: data.recentLetters || [],
    diaryEntries: data.diaryEntries || []
  });
});

app.post('/api/sync/:code', (req: Request, res: Response) => {
  const code = (req.params.code || '').trim().toUpperCase();
  if (!code || code.length < 3) {
    return res.status(400).json({ error: 'Invalid sync code' });
  }

  const { petsData, recentLetters, diaryEntries } = req.body;
  if (!petsData) {
    return res.status(400).json({ error: 'petsData is required' });
  }

  const existing = cloudStore[code];
  cloudStore[code] = {
    updatedAt: Date.now(),
    deviceCount: (existing?.deviceCount || 1) + 1,
    petsData,
    recentLetters: recentLetters || existing?.recentLetters || [],
    diaryEntries: diaryEntries || existing?.diaryEntries || []
  };

  saveStore();

  return res.json({
    success: true,
    code,
    updatedAt: cloudStore[code].updatedAt,
    message: 'Синхронизировано в облаке'
  });
});

// Incoming Email / Letter webhook simulator
app.post('/api/mail/incoming', (req: Request, res: Response) => {
  const { syncCode, from, subject, body, emotion } = req.body;
  const letter = {
    id: 'mail_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    from: from || 'Друг из Виртуального Парка',
    subject: subject || 'Тёплый привет!',
    body: body || 'Привет! Твой пушистик передает тебе улыбку и лучи тепла.',
    emotion: emotion || 'love', // love, joy, work, calm, surprise
    timestamp: Date.now(),
    read: false
  };

  const code = (syncCode || 'DEFAULT').trim().toUpperCase();
  if (!cloudStore[code]) {
    cloudStore[code] = {
      updatedAt: Date.now(),
      deviceCount: 1,
      petsData: null,
      recentLetters: []
    };
  }

  if (!cloudStore[code].recentLetters) {
    cloudStore[code].recentLetters = [];
  }

  cloudStore[code].recentLetters.unshift(letter);
  if (cloudStore[code].recentLetters.length > 20) {
    cloudStore[code].recentLetters.pop();
  }

  saveStore();

  return res.json({
    success: true,
    letter,
    message: 'Письмо доставлено'
  });
});

app.get('/api/mail/:code', (req: Request, res: Response) => {
  const code = (req.params.code || 'DEFAULT').trim().toUpperCase();
  const letters = cloudStore[code]?.recentLetters || [];
  return res.json({
    success: true,
    letters
  });
});

// Download full project source as ZIP archive
app.get('/api/export-project-zip', (req: Request, res: Response) => {
  try {
    const archive = archiver('zip', { zlib: { level: 9 } });

    res.attachment('fluffy-tamagotchi-project.zip');

    archive.on('error', (err: any) => {
      console.error('Archive error:', err);
      res.status(500).send({ error: err.message });
    });

    archive.pipe(res);

    archive.glob('**/*', {
      cwd: process.cwd(),
      ignore: ['node_modules/**', 'dist/**', '.git/**', '.data/**']
    });

    archive.finalize();
  } catch (error: any) {
    console.error('Export zip error:', error);
    res.status(500).json({ error: 'Failed to create zip archive' });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🐾 Fluffy Tamagotchi Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
