import fs from 'fs';

function getPngSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.toString('ascii', 1, 4) !== 'PNG') throw new Error('Not a PNG');
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

console.log(getPngSize('public/imacg3.png'));
