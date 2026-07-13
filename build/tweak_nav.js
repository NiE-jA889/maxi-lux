const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function processFile(filePath, isSubdir) {
  let content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  
  const header = $('header');
  if (header.length > 0) {
    // We want to reduce header padding and crop the logo.
    content = content.replace(/py-2 flex items-center justify-between/g, 'py-1 flex items-center justify-between');
    content = content.replace(/py-4 flex items-center justify-between/g, 'py-1 flex items-center justify-between');
    
    const logoRegex = /<a href="([^"]+)" class="flex items-center gap-3">[\s\S]*?<img src="([^"]+)"[^>]+>[\s\S]*?<\/a>/;
    content = content.replace(logoRegex, (match, indexHref, logoHref) => {
      // Crop logo by giving it absolute scale in a hidden overflow box
      return `
      <a href="${indexHref}" class="flex items-center justify-center overflow-hidden w-40 md:w-56 h-12 md:h-16 relative">
        <img src="${logoHref}" alt="Maxi-Lux Logo" class="absolute w-[200%] h-[200%] object-contain drop-shadow-2xl scale-[1.3] md:scale-[1.5]">
      </a>
      `;
    });

    fs.writeFileSync(filePath, content);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  const isSubdir = file.includes('uslugi') || file.includes('uslugi\\\\');
  processFile(file, isSubdir);
});

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(
  /<img src="order\/order\.png" alt="23 lata na rynku" class="([^"]+)">/g, 
  '<img src="order/order.png" alt="" class="$1" onerror="this.style.display=\'none\';">'
);
fs.writeFileSync('index.html', indexHtml);

console.log('Navbar tweaked and badge alt removed.');
