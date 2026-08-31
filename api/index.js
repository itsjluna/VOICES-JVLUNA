import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadToSupabase(base64Str, filename) {
  if (!base64Str.startsWith('data:image')) return base64Str;

  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return base64Str;

  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const ext = mimeType.split('/')[1];
  const finalName = `${filename}_${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('anthology-images')
    .upload(finalName, buffer, { contentType: mimeType, upsert: true });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('anthology-images')
    .getPublicUrl(finalName);

  return publicUrlData.publicUrl;
}

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed: ' + err.message });
  }
});

// Schemas
const chapterSchema = new mongoose.Schema({
  title: String,
  titleEn: String,
  order: { type: Number, default: 0 },
  image: String,
  imageCredit: { type: String, default: '' },
  isIntermission: { type: Boolean, default: false },
  isVent: { type: Boolean, default: false },
  content: String,
  contentEn: String,
  writersNote: String,
  writersNoteEn: String,
  theme: { type: String, default: 'winter' }
});

chapterSchema.index({ order: 1 });

const poemSchema = new mongoose.Schema({
  title: String,
  titleEn: String,
  content: String,
  contentEn: String,
  chapterId: mongoose.Schema.Types.ObjectId,
  order: { type: Number, default: 0 },
  image: String,
  imageCredit: { type: String, default: '' },
  theme: { type: String, default: 'none' }
});

poemSchema.index({ chapterId: 1, order: 1 });
poemSchema.index({ order: 1 });

const Chapter = mongoose.model('Chapter', chapterSchema);
const Poem = mongoose.model('Poem', poemSchema);

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === `Bearer ${process.env.ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ token: process.env.ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/supabase-creds', authMiddleware, (req, res) => {
  res.json({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY
  });
});

app.get('/api/chapters', async (req, res) => {
  try {
    if (req.query.lean === 'true') {
      const chapters = await Chapter.find().select('-content -contentEn').lean().sort({ order: 1 }).allowDiskUse(true);
      const mapped = chapters.map(c => {
        const hasImage = !!c.image;
        delete c.image;
        return { ...c, hasImage };
      });
      return res.json(mapped);
    }
    const chapters = await Chapter.find().sort({ order: 1 }).allowDiskUse(true);
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/chapters/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chapters', authMiddleware, async (req, res) => {
  try {
    if (req.body.image && req.body.image.startsWith('data:image')) {
      const chapterId = new mongoose.Types.ObjectId();
      req.body._id = chapterId;
      req.body.image = await uploadToSupabase(req.body.image, `chapter_${chapterId}`);
    }
    const chapter = new Chapter(req.body);
    await chapter.save();
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/chapters/reorder', authMiddleware, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    const promises = orderedIds.map((id, index) => 
      Chapter.findByIdAndUpdate(id, { order: index })
    );
    await Promise.all(promises);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/chapters/:id', authMiddleware, async (req, res) => {
  try {
    if (req.body.image && req.body.image.startsWith('data:image')) {
      req.body.image = await uploadToSupabase(req.body.image, `chapter_${req.params.id}`);
    }
    const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/chapters/:id', authMiddleware, async (req, res) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);
    await Poem.deleteMany({ chapterId: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/poems', async (req, res) => {
  try {
    const filter = req.query.chapterId ? { chapterId: req.query.chapterId } : {};
    if (req.query.lean === 'true') {
      const poems = await Poem.find(filter).select('-content -contentEn').lean().sort({ order: 1 }).allowDiskUse(true);
      const mapped = poems.map(p => {
        const hasImage = !!p.image;
        delete p.image;
        return { ...p, hasImage };
      });
      return res.json(mapped);
    }
    const poems = await Poem.find(filter).sort({ order: 1 }).allowDiskUse(true);
    res.json(poems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/poems/:id', async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id);
    res.json(poem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/poems', authMiddleware, async (req, res) => {
  try {
    if (req.body.image && req.body.image.startsWith('data:image')) {
      const poemId = new mongoose.Types.ObjectId();
      req.body._id = poemId;
      req.body.image = await uploadToSupabase(req.body.image, `poem_${poemId}`);
    }
    const poem = new Poem(req.body);
    await poem.save();
    res.json(poem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/poems/reorder', authMiddleware, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    const promises = orderedIds.map((id, index) => 
      Poem.findByIdAndUpdate(id, { order: index })
    );
    await Promise.all(promises);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/poems/:id', authMiddleware, async (req, res) => {
  try {
    if (req.body.image && req.body.image.startsWith('data:image')) {
      req.body.image = await uploadToSupabase(req.body.image, `poem_${req.params.id}`);
    }
    const poem = await Poem.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(poem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/poems/:id', authMiddleware, async (req, res) => {
  try {
    await Poem.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/images/random', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 5;
    const chapters = await Chapter.aggregate([
      { $match: { image: { $exists: true, $ne: '' } } },
      { $sample: { size: count } },
      { $project: { image: 1 } }
    ]);
    const poems = await Poem.aggregate([
      { $match: { image: { $exists: true, $ne: '' } } },
      { $sample: { size: count } },
      { $project: { image: 1 } }
    ]);
    const allImages = [...chapters.map(c => c.image), ...poems.map(p => p.image)];
    const shuffled = allImages.sort(() => 0.5 - Math.random()).slice(0, count);
    res.json(shuffled);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/itunes/lookup', async (req, res) => {
  try {
    const { id, entity, limit } = req.query;
    let url = `https://itunes.apple.com/lookup?id=${id}&entity=${entity}`;
    if (limit) url += `&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
