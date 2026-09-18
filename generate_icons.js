import fs from 'fs';
import { createCanvas } from 'canvas';

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  // Text
  const fontSize = Math.floor(size * 0.7);
  ctx.font = `${fontSize}px "Times New Roman", serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Center the text
  ctx.fillText('V', size / 2, size / 2 + (size * 0.05));

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`./public/${filename}`, buffer);
  console.log(`Generated ${filename} (${size}x${size})`);
}

generateIcon(16, 'favicon-16x16.png');
generateIcon(32, 'favicon-32x32.png');
generateIcon(180, 'apple-touch-icon.png');
generateIcon(192, 'android-chrome-192x192.png');
generateIcon(512, 'android-chrome-512x512.png');

// For favicon.ico, we can just copy the 32x32 one, or use jimp if we really want to assemble an ico, 
// but saving a 32x32 PNG as .ico often works in modern browsers, or we just rely on the PNGs in HTML.
fs.copyFileSync('./public/favicon-32x32.png', './public/favicon.ico');
console.log('Copied favicon.ico');

// Also generate SVG for favicon.svg
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#000000" />
  <text x="256" y="380" font-family="'Times New Roman', serif" font-size="360" fill="#ffffff" text-anchor="middle">V</text>
</svg>`;
fs.writeFileSync('./public/favicon.svg', svgContent);
console.log('Generated favicon.svg');
