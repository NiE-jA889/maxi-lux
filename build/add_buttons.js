const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const fabHtml = `
<!-- Floating Phone Button -->
<div class="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100]">
  <div class="relative flex items-center justify-center group">
    <span class="absolute inline-flex h-full w-full rounded-full bg-blue opacity-50 animate-ping" style="animation-duration: 2s;"></span>
    <span class="absolute inline-flex h-full w-full rounded-full bg-blue blur-md opacity-50 animate-pulse"></span>
    <a href="tel:+48513412313" class="relative inline-flex w-14 h-14 md:w-16 md:h-16 bg-blue hover:bg-blueSoft rounded-full items-center justify-center text-ink shadow-2xl transition-transform hover:scale-110">
      <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
    </a>
  </div>
</div>
`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Add FAB to all pages before </body>
  if (!content.includes('Floating Phone Button')) {
    content = content.replace('</body>', fabHtml + '\n</body>');
    changed = true;
  }

  // 2. Modify the specific Hero button in index.html (or any file that has it)
  // We search for the exact a tag to wrap it in the glowing div.
  const regexHeroBtn = /<a href="tel:\+48513412313" class="btn-primary[^"]*"[^>]*>\s*☎ Zadzwoń — 513 412 313\s*<\/a>/;
  const match = content.match(regexHeroBtn);
  if (match) {
    const wrappedBtn = `
<div class="relative inline-flex group">
  <div class="absolute transition-all duration-1000 opacity-70 -inset-px bg-blue rounded-full blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-pulse"></div>
  <a href="tel:+48513412313" class="btn-primary relative px-8 py-4 rounded-full inline-flex items-center gap-3">
    ☎ Zadzwoń — 513 412 313
  </a>
</div>`;
    content = content.replace(match[0], wrappedBtn.trim());
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Added pulsing buttons to ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  processFile(file);
});
