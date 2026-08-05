import mongoose from 'mongoose';
import fs from 'fs';

const chapterSchema = new mongoose.Schema({
  title: String,
  titleEn: String,
  order: { type: Number, default: 0 },
  image: String,
  isIntermission: { type: Boolean, default: false },
  isVent: { type: Boolean, default: false },
  content: String,
  contentEn: String,
  theme: { type: String, default: 'winter' }
});

const poemSchema = new mongoose.Schema({
  title: String,
  titleEn: String,
  content: String,
  contentEn: String,
  chapterId: mongoose.Schema.Types.ObjectId,
  order: { type: Number, default: 0 },
  image: String,
  theme: { type: String, default: 'none' }
});

const Chapter = mongoose.model('Chapter', chapterSchema);
const Poem = mongoose.model('Poem', poemSchema);

async function dump() {
  await mongoose.connect('mongodb+srv://transwfc_db_user:gSIj9aQLZD3lKypZ@cluster0.dpmvbmn.mongodb.net/poetry_anthology?retryWrites=true&w=majority');
  console.log('Connected');
  const chapters = await Chapter.find();
  const poems = await Poem.find();
  
  fs.writeFileSync('db_dump.json', JSON.stringify({ chapters, poems }, null, 2));
  console.log('Dumped to db_dump.json');
  process.exit(0);
}

dump();
