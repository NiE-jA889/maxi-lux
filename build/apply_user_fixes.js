const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 1. Fix images in index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Replace the old bad images with high quality webp images from the gallery
// Using some nice generic wuko/truck images (assuming 2, 4, 8 are good)
indexHtml = indexHtml.replace('https://maxi-lux.pl/wp-content/uploads/2022/02/Maxi-Lux-slider-1.jpg', 'https://maxi-lux.pl/wp-content/uploads/2026/01/2.webp');
indexHtml = indexHtml.replace('https://maxi-lux.pl/wp-content/uploads/2022/03/shutterstock_1495914173-1024x684.jpg', 'https://maxi-lux.pl/wp-content/uploads/2026/01/4.webp');
indexHtml = indexHtml.replace('https://maxi-lux.pl/wp-content/uploads/2022/01/wuko_3-2-2-scaled.jpg', 'https://maxi-lux.pl/wp-content/uploads/2026/01/8.webp');

fs.writeFileSync('index.html', indexHtml);

// 2. Fix the table in wywoz-odpadow.html
let wywozHtml = fs.readFileSync('wywoz-odpadow.html', 'utf8');
const $w = cheerio.load(wywozHtml);

const table = $w('table.tablepress');
if (table.length > 0) {
  // Add wrapper
  table.wrap('<div class="overflow-x-auto rounded-2xl border border-white/10 shadow-2xl bg-coal/50 backdrop-blur-sm mt-8"></div>');
  
  // Style table
  table.attr('class', 'w-full text-left text-sm md:text-base text-bone/80');
  
  // Style thead
  table.find('thead').attr('class', 'text-xs md:text-sm uppercase bg-white/5 text-bone border-b border-white/10 tracking-wider');
  table.find('th').attr('class', 'px-6 py-5 font-semibold');
  
  // Style tbody
  table.find('tbody').attr('class', 'divide-y divide-white/5');
  table.find('tr').attr('class', 'hover:bg-white/5 transition-colors duration-200');
  table.find('td').attr('class', 'px-6 py-4');
  
  fs.writeFileSync('wywoz-odpadow.html', $w.html());
}

// 3. Round the "Zlecenie wykonania usługi" buttons everywhere
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Desktop button
  const desktopBtnRegex = /class="bg-blue text-ink px-6 py-[^ ]* rounded-sm/g;
  if (desktopBtnRegex.test(content)) {
    content = content.replace(desktopBtnRegex, 'class="bg-blue text-ink px-6 py-2.5 rounded-full');
    changed = true;
  }

  // Mobile button
  const mobileBtnRegex = /class="bg-blue text-ink px-6 py-[^ ]* rounded-xl/g;
  if (mobileBtnRegex.test(content)) {
    content = content.replace(mobileBtnRegex, 'class="bg-blue text-ink px-6 py-4 rounded-full');
    changed = true;
  }

  // Large button on index.html (the big one with ☎ Zadzwoń might be rounded-full already, but let's check Zlecenie inside header)
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Rounded buttons in ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  processFile(file);
});

console.log('All user fixes applied successfully!');
