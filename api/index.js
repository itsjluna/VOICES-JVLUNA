import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const chapterSchema = new mongoose.Schema({
  title: String,
  order: { type: Number, default: 0 },
  image: String,
  isIntermission: { type: Boolean, default: false },
  isVent: { type: Boolean, default: false },
  content: String,
  theme: { type: String, default: 'winter' }
});

const poemSchema = new mongoose.Schema({
  title: String,
  content: String,
  chapterId: mongoose.Schema.Types.ObjectId,
  order: { type: Number, default: 0 },
  image: String,
  theme: { type: String, default: 'none' }
});

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

app.get('/api/chapters', async (req, res) => {
  try {
    const chapters = await Chapter.find().sort({ order: 1 });
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/chapters', authMiddleware, async (req, res) => {
  try {
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
    const poems = await Poem.find(filter).sort({ order: 1 });
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



export default app;
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
