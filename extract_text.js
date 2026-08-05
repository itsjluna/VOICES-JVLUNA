import fs from 'fs';

const db = JSON.parse(fs.readFileSync('db_dump.json'));
const textsToTranslate = [];

db.chapters.forEach(c => {
  if (c.title) textsToTranslate.push({ type: 'chapter', id: c._id, field: 'title', text: c.title });
  if (c.content) textsToTranslate.push({ type: 'chapter', id: c._id, field: 'content', text: c.content });
});

db.poems.forEach(p => {
  if (p.title) textsToTranslate.push({ type: 'poem', id: p._id, field: 'title', text: p.title });
  if (p.content) textsToTranslate.push({ type: 'poem', id: p._id, field: 'content', text: p.content });
});

fs.writeFileSync('texts.json', JSON.stringify(textsToTranslate, null, 2));
console.log('Extracted ' + textsToTranslate.length + ' texts.');
