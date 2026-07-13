const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function processFile(filePath, isSubdir) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Fix CSS styles block
  content = content.replace(/#ff6a1a/g, '#2563eb');
  content = content.replace(/#ff8a3d/g, '#60a5fa');
  content = content.replace(/255,106,26/g, '37,99,235'); // rgba conversions

  // 2. Fix header logo size
  content = content.replace(/class="h-16 w-auto/g, 'class="h-24 w-auto');

  // Load cheerio to fix footer logo
  const $ = cheerio.load(content);
  
  const logoPath = isSubdir ? '../logo/logo.png' : 'logo/logo.png';
  
  // Find footer logo
  // The footer logo block is usually <div class="w-10 h-10 rounded-lg bg-blue flex items-center justify-center font-black text-ink text-lg">M</div>
  $('footer').find('.w-10.h-10.rounded-lg.bg-blue').replaceWith(`<img src="${logoPath}" alt="Maxi-Lux Logo" class="h-16 w-auto object-contain drop-shadow-xl" />`);
  // also remove the "Maxi-Lux" text next to it if it looks weird, but let's keep it for now.
  $('footer').find('.serif.text-2xl').remove(); // Actually, the logo has the text, so let's remove the "Maxi-Lux" text next to it.

  fs.writeFileSync(filePath, $.html());
  console.log('Updated ' + filePath);
}

// Gather files
const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f));

[...rootFiles, ...uslugiFiles].forEach(file => {
  const isSubdir = file.includes('uslugi') || file.includes('uslugi\\');
  processFile(file, isSubdir);
});
