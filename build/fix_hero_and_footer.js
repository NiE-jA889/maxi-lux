const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Fix Footer Links and remove SEO
  if (html.includes('Copyright 2026')) {
    const newLinks = `
    <div class="flex flex-wrap gap-2 mt-4 md:mt-0 justify-center">
      <a href="https://maxi-lux.pl/polityka-prywatnosci-2/" class="hover:text-blue transition">Polityka prywatności</a> <span class="mx-1">|</span>
      <a href="https://maxi-lux.pl/rodo/" class="hover:text-blue transition">RODO</a> <span class="mx-1">|</span>
      <a href="https://maxi-lux.pl/blog/" class="hover:text-blue transition">BLOG</a> <span class="mx-1">|</span>
      <a href="kontakt.html" class="hover:text-blue transition">Kontakt</a>
    </div>
  </div>
</footer>`;
    
    // Zastąpienie starego dolnego paska w stopce (tego z linkami i SEO)
    const oldBottomBarRegex = /<div class="flex gap-2 mt-4 md:mt-0">[\s\S]*?<\/footer>/;
    const match = html.match(oldBottomBarRegex);
    if (match) {
      html = html.replace(match[0], newLinks);
      changed = true;
    }
  }

  // 2. CSS Fixes for Hero text and Cards in Light Mode
  const additionalCSS = `
  /* Hero Text Color Fix in Light Mode */
  .light-theme .hero-content-wrapper {
    --color-bone: #f5f2ec;
    --color-ink: #0b0f14;
    --color-coal: #111820;
    --color-mist: #e5e0d6;
  }
  
  /* Strongly visible cards and lines in Light Mode */
  .light-theme .border-glassBorder {
    border-color: rgba(0, 0, 0, 0.15) !important;
  }
  .light-theme .bg-glass {
    background-color: rgba(255, 255, 255, 0.95) !important;
    border: 1px solid rgba(0, 0, 0, 0.08) !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  }
  /* Bolder background stripes */
  .light-theme .aesthetic-stripes div {
    opacity: 0.5 !important;
  }
  `;
  if (!html.includes('.hero-content-wrapper {')) {
    html = html.replace('</style>', additionalCSS + '\n</style>');
    changed = true;
  }

  // 3. Hero Section Blend and Wrapper Class
  if (html.includes('<section class="relative min-h-[100vh] overflow-hidden grain z-10">')) {
    // Check if blend gradient exists
    if (!html.includes('bg-gradient-to-t from-ink to-transparent')) {
      const heroGradDiv = '<div class="absolute inset-0 hero-grad"></div>';
      const blendDiv = '<div class="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-ink to-transparent z-0 pointer-events-none"></div>';
      html = html.replace(heroGradDiv, heroGradDiv + '\n  ' + blendDiv);
      changed = true;
    }
    
    // Add hero-content-wrapper to keep text white
    const wrapperTarget = '<div class="relative max-w-7xl mx-auto px-6 pt-48 md:pt-56 pb-24 flex flex-col md:flex-row justify-between items-center md:items-end">';
    if (html.includes(wrapperTarget) && !html.includes('hero-content-wrapper')) {
      html = html.replace(wrapperTarget, wrapperTarget.replace('class="', 'class="hero-content-wrapper '));
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log('Processed ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  processFile(file);
});
