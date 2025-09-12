const jimp = require('jimp');
const path = require('path');

async function createPlaceholderImages() {
  const imagesDir = path.join(__dirname, '..', 'images');
  
  // Create a simple QR code placeholder
  const qrSize = 200;
  const qr = new jimp.Jimp({
    width: qrSize,
    height: qrSize,
    color: '#ffffff'
  });
  
  // Draw QR code pattern (simplified)
  const moduleSize = 8;
  const modules = qrSize / moduleSize;
  
  for (let i = 0; i < modules; i++) {
    for (let j = 0; j < modules; j++) {
      // Create a checkered pattern to simulate QR code
      if ((i + j) % 3 === 0 || (i % 7 === 0 && j % 7 === 0)) {
        const x = i * moduleSize;
        const y = j * moduleSize;
        for (let px = x; px < x + moduleSize; px++) {
          for (let py = y; py < y + moduleSize; py++) {
            if (px < qrSize && py < qrSize) {
              qr.setPixelColor(jimp.cssColorToHex('#000000'), px, py);
            }
          }
        }
      }
    }
  }
  
  await qr.write(path.join(imagesDir, 'qr-code.png'));
  console.log('✓ QR code placeholder created');
  
  // Create a sample cover image
  const coverWidth = 400;
  const coverHeight = 600;
  const cover = new jimp.Jimp({
    width: coverWidth,
    height: coverHeight,
    color: '#f0f0f0'
  });
  
  // Add some geometric shapes to simulate a cover image
  const centerX = coverWidth / 2;
  const centerY = coverHeight / 2;
  const radius = Math.min(coverWidth, coverHeight) / 3;
  
  for (let x = 0; x < coverWidth; x++) {
    for (let y = 0; y < coverHeight; y++) {
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      if (distance < radius) {
        cover.setPixelColor(jimp.cssColorToHex('#e0e0e0'), x, y);
      }
      if (distance < radius / 2) {
        cover.setPixelColor(jimp.cssColorToHex('#d0d0d0'), x, y);
      }
    }
  }
  
  await cover.write(path.join(imagesDir, 'cover-original.jpg'));
  console.log('✓ Cover image placeholder created');
}

async function createPencilEffect() {
  const imagesDir = path.join(__dirname, '..', 'images');
  const originalPath = path.join(imagesDir, 'cover-original.jpg');
  const pencilPath = path.join(imagesDir, 'cover-pencil.png');
  
  try {
    const image = await jimp.Jimp.read(originalPath);
    
    // Create pencil sketch effect
    image.greyscale().contrast(0.3);
    
    // Simple edge enhancement
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    // Apply edge detection effect (simplified)
    for (let x = 1; x < width - 1; x += 2) { // Skip every other pixel for performance
      for (let y = 1; y < height - 1; y += 2) {
        const pixel = jimp.intToRGBA(image.getPixelColor(x, y));
        const pixelRight = jimp.intToRGBA(image.getPixelColor(x + 1, y));
        const pixelDown = jimp.intToRGBA(image.getPixelColor(x, y + 1));
        
        const edgeValue = Math.abs(pixel.r - pixelRight.r) + Math.abs(pixel.r - pixelDown.r);
        const edgeIntensity = Math.min(255, edgeValue * 3);
        const finalValue = Math.max(50, 255 - edgeIntensity); // Keep some gray for texture
        
        image.setPixelColor(jimp.rgbaToInt(finalValue, finalValue, finalValue, 255), x, y);
      }
    }
    
    // Add slight sepia and brightness adjustment
    image.sepia().brightness(0.15);
    
    await image.write(pencilPath);
    console.log('✓ Pencil effect applied to cover image');
  } catch (error) {
    console.error('Error applying pencil effect:', error);
  }
}

// Run the functions
(async () => {
  try {
    await createPlaceholderImages();
    await createPencilEffect();
    console.log('All placeholder images created successfully!');
  } catch (error) {
    console.error('Error creating images:', error);
  }
})();