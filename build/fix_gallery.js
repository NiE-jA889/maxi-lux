const fs = require('fs');

function fixGallery(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add data-type="image" to fslightbox links so it correctly parses .webp files
  const searchStr = 'data-fslightbox="gallery"';
  const replaceStr = 'data-fslightbox="gallery" data-type="image"';

  if (html.includes(searchStr) && !html.includes(replaceStr)) {
    html = html.split(searchStr).join(replaceStr);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log('Fixed gallery in ' + filePath);
  }
}

fixGallery('galeria.html');
fixGallery('galeria_raw.html');

// Sync to build folder
const path = require('path');
const buildDir = path.join(__dirname, 'build');
if (fs.existsSync(buildDir)) {
  if (fs.existsSync('galeria.html')) fs.copyFileSync('galeria.html', path.join(buildDir, 'galeria.html'));
  if (fs.existsSync('galeria_raw.html')) fs.copyFileSync('galeria_raw.html', path.join(buildDir, 'galeria_raw.html'));
  console.log('Synced to build directory.');
}
