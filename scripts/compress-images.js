const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imageDir = path.join(process.cwd(), 'public', 'images');
const outputDir = path.join(process.cwd(), 'public', 'images', 'optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function compressImages() {
  console.log('Starting image compression...');
  
  try {
    const files = fs.readdirSync(imageDir);
    const imageFiles = files.filter(file => 
      ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
    );

    for (const file of imageFiles) {
      const inputPath = path.join(imageDir, file);
      const outputPath = path.join(outputDir, file);
      
      // Skip if file is already in optimized folder
      if (inputPath.includes('optimized')) continue;
      
      console.log(`Compressing ${file}...`);
      
      await sharp(inputPath)
        .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toFile(outputPath.replace(/\.[^/.]+$/, '.jpg'));
      
      // Also create WebP version
      await sharp(inputPath)
        .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath.replace(/\.[^/.]+$/, '.webp'));
      
      console.log(`✓ Compressed ${file}`);
    }
    
    console.log('Image compression completed!');
  } catch (error) {
    console.error('Error compressing images:', error);
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  compressImages();
}

module.exports = compressImages;