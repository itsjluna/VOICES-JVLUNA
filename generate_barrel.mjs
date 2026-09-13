import { createCanvas } from 'canvas';
import fs from 'fs';

const width = 256;
const height = 256;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

const imageData = ctx.createImageData(width, height);
const data = imageData.data;

const k = 0.3; // distortion factor

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    // Normalize to -1..1
    const nx = (x / (width / 2)) - 1;
    const ny = (y / (height / 2)) - 1;
    
    const r2 = nx * nx + ny * ny;
    
    // Calculate required R and G
    let dx = nx * r2 * k;
    let dy = ny * r2 * k;
    
    // Map dx, dy (-k..k) to 0..255
    // R = 127.5 + dx * 127.5 / max_d
    // If we assume max_d is roughly k
    let R = 127.5 + (dx / k) * 127.5;
    let G = 127.5 + (dy / k) * 127.5;
    
    const idx = (y * width + x) * 4;
    data[idx] = Math.max(0, Math.min(255, R));     // Red
    data[idx+1] = Math.max(0, Math.min(255, G));   // Green
    data[idx+2] = 0;                               // Blue (not used)
    data[idx+3] = 255;                             // Alpha
  }
}

ctx.putImageData(imageData, 0, 0);
const buffer = canvas.toBuffer('image/png');
const base64 = buffer.toString('base64');

fs.writeFileSync('barrel_b64.txt', base64);
console.log('Generated barrel map!');
