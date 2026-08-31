require('dotenv').config();
const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const MONGODB_URI = process.env.MONGODB_URI;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!MONGODB_URI || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing environment variables. Make sure MONGODB_URI, NEXT_PUBLIC_SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY are set.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Define Schemas identical to backend
const chapterSchema = new mongoose.Schema({
  title: String,
  titleEn: String,
  image: String, // Was base64, will be URL
  imageCredit: String,
  theme: String,
  order: Number,
  isIntermission: { type: Boolean, default: false },
  isVent: { type: Boolean, default: false },
  content: String,
  contentEn: String,
  writersNote: String,
  writersNoteEn: String
});

const poemSchema = new mongoose.Schema({
  title: String,
  titleEn: String,
  content: String,
  contentEn: String,
  chapterId: mongoose.Schema.Types.ObjectId,
  order: Number,
  image: String,
  imageCredit: String,
  theme: String
});

const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema);
const Poem = mongoose.models.Poem || mongoose.model('Poem', poemSchema);

async function uploadToSupabase(base64Str, filename) {
  // Extract mime type and base64 data
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Extension
  const ext = mimeType.split('/')[1];
  const finalName = `${filename}.${ext}`;

  const { data, error } = await supabase.storage
    .from('anthology-images')
    .upload(finalName, buffer, {
      contentType: mimeType,
      upsert: true
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('anthology-images')
    .getPublicUrl(finalName);

  return publicUrlData.publicUrl;
}

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Ensure bucket exists
    console.log('Checking Supabase bucket "anthology-images"...');
    const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
    if (bucketErr) throw bucketErr;

    const bucketExists = buckets.some(b => b.name === 'anthology-images');
    if (!bucketExists) {
      console.log('Creating bucket "anthology-images"...');
      const { error: createErr } = await supabase.storage.createBucket('anthology-images', { public: true });
      if (createErr) throw createErr;
    } else {
      console.log('Bucket exists.');
    }

    console.log('Fetching chapters...');
    const chapters = await Chapter.find({ image: { $exists: true, $ne: '' } });
    for (const chap of chapters) {
      if (chap.image && chap.image.startsWith('data:image')) {
        console.log(`Uploading image for chapter: ${chap.title}`);
        try {
          const url = await uploadToSupabase(chap.image, `chapter_${chap._id}`);
          chap.image = url;
          await chap.save();
          console.log(`Success: ${url}`);
        } catch (e) {
          console.error(`Failed to upload chapter ${chap._id}:`, e.message);
        }
      }
    }

    console.log('Fetching poems...');
    const poems = await Poem.find({ image: { $exists: true, $ne: '' } });
    for (const poem of poems) {
      if (poem.image && poem.image.startsWith('data:image')) {
        console.log(`Uploading image for poem: ${poem.title}`);
        try {
          const url = await uploadToSupabase(poem.image, `poem_${poem._id}`);
          poem.image = url;
          await poem.save();
          console.log(`Success: ${url}`);
        } catch (e) {
          console.error(`Failed to upload poem ${poem._id}:`, e.message);
        }
      }
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.warn('Migration Script Failed (Continuing build safely). Error:', err.message);
    process.exit(0);
  }
}

run();
