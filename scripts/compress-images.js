const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const images = [
  'public/images/gallery/admin-dashboard.png',
  'public/images/gallery/student-app.png',
  'public/images/gallery/tutor-app.png',
  'public/images/gallery/verification-platform.png',
];

async function compress() {
  for (const imgPath of images) {
    const full = path.join(process.cwd(), imgPath);
    const sizeBefore = fs.statSync(full).size;

    const data = await sharp(full)
      .resize({ width: 1600, withoutEnlargement: true })
      .png({ quality: 85, compressionLevel: 9, effort: 10 })
      .toBuffer();

    fs.writeFileSync(full, data);

    const sizeAfter = data.length;
    const saved = (((sizeBefore - sizeAfter) / sizeBefore) * 100).toFixed(1);
    console.log(`✓ ${path.basename(imgPath)}: ${(sizeBefore / 1024 / 1024).toFixed(1)}MB → ${(sizeAfter / 1024 / 1024).toFixed(1)}MB (−${saved}%)`);
  }
  console.log('\n✅ All images compressed.');
}

compress().catch(console.error);
