import { Jimp } from 'jimp';

async function findHole() {
  const image = await Jimp.read('public/imacg3.png');
  let minX = image.bitmap.width, maxX = 0, minY = image.bitmap.height, maxY = 0;
  
  for (let y = 0; y < image.bitmap.height; y++) {
    for (let x = 0; x < image.bitmap.width; x++) {
      const color = image.getPixelColor(x, y);
      const a = color & 0xFF; // Jimp v0.x returned RGBA
      
      if (a < 50 && x > 200 && x < 1800 && y > 200 && y < 1800) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  
  console.log({ minX, maxX, width: maxX - minX, minY, maxY, height: maxY - minY });
}
findHole();
