const fs = require('fs');
const path = require('path');

function fixStyles(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Fix Emergency Bar to ALWAYS be dark
  const emergencyOld = '<div class="bg-ink border-b border-white/5">';
  if (html.includes(emergencyOld)) {
    html = html.replace(emergencyOld, '<div class="bg-[#0b0f14] border-b border-white/5">');
    html = html.replace('<div class="flex items-center gap-2 text-bone/70">', '<div class="flex items-center gap-2 text-[#f5f2ec]/70">');
    html = html.replace('<div class="max-w-7xl mx-auto px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest">', '<div class="max-w-7xl mx-auto px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-[#f5f2ec]">');
    changed = true;
  }

  // 2. Fix Hero Blend Size & Position
  const blendOld = 'h-32 -bottom-1 bg-gradient-to-t from-ink to-transparent';
  if (html.includes(blendOld)) {
    html = html.replace(blendOld, 'h-16 -bottom-2 opacity-90 bg-gradient-to-t from-ink to-transparent');
    changed = true;
  }

  // 3. Fix Hero Text Colors to always be white
  if (filePath.endsWith('index.html')) {
    const heroOld1 = 'text-bone/80 mb-8';
    if (html.includes(heroOld1)) { html = html.replace(heroOld1, 'text-[#f5f2ec]/80 mb-8'); changed = true; }
    
    const heroOld2 = 'text-bone/75';
    if (html.includes(heroOld2)) { html = html.replace(heroOld2, 'text-[#f5f2ec]/75'); changed = true; }
    
    const heroOld3 = 'text-bone/50';
    if (html.includes(heroOld3)) { html = html.replace(heroOld3, 'text-[#f5f2ec]/50'); changed = true; }

    const heroTitle = 'Zapchane rury?<br>';
    if (html.includes(heroTitle) && !html.includes('text-[#f5f2ec] leading-[0.95]')) {
      html = html.replace('leading-[0.95]', 'text-[#f5f2ec] leading-[0.95]');
      changed = true;
    }
  }

  // 4. Add chip and better glass borders for Light Theme
  const styleEnd = '</style>';
  if (html.includes(styleEnd) && !html.includes('.light-theme .chip {')) {
    const newCss = `
  /* Fix chip colors in light theme */
  .light-theme .chip { 
    border-color: rgba(0,0,0,0.15) !important; 
    background: rgba(0,0,0,0.03) !important; 
    color: #111827 !important; 
  }
  .light-theme .bg-glass {
    border: 1px solid rgba(0,0,0,0.1) !important;
  }
`;
    html = html.replace(styleEnd, newCss + styleEnd);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log('Fixed styles in ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  fixStyles(file);
});
