const fs = require('fs');
const path = require('path');

function processHtmlFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Fix Logo Inversion so it DOES NOT apply to header
  if (html.includes('.light-theme img[src*="logo.png"] {')) {
    html = html.replace('.light-theme img[src*="logo.png"] {', '.light-theme footer img[src*="logo.png"] {');
    changed = true;
  }

  // 2. Add hero-mask and enforce dark mode variables on header/emergency-bar
  if (html.includes('<style>') && !html.includes('.hero-mask')) {
    const newCss = `
  .hero-mask {
    mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
  }
  .light-theme header, .light-theme .emergency-bar {
    --color-ink: #0b0f14 !important;
    --color-coal: #111820 !important;
    --color-steel: #1a2530 !important;
    --color-bone: #f5f2ec !important;
    --color-mist: #e5e0d6 !important;
    --color-glass: rgba(0, 0, 0, 0.3) !important;
    --color-glass-border: rgba(255, 255, 255, 0.2) !important;
  }
  /* Force dark mode background on header explicitly just in case */
  .light-theme header { background-color: rgba(11, 15, 20, 0.95) !important; border-bottom-color: rgba(255,255,255,0.1) !important; }
  .light-theme header a, .light-theme header button { color: #f5f2ec !important; }
  .light-theme header .text-bone\\/60 { color: rgba(245, 242, 236, 0.6) !important; }
  .light-theme header .bg-glass { background-color: rgba(0,0,0,0.3) !important; border-color: rgba(255,255,255,0.2) !important; }
  .light-theme header svg { stroke: #f5f2ec !important; }
  .light-theme .emergency-bar-text { color: #f5f2ec !important; }
`;
    html = html.replace('</style>', newCss + '</style>');
    changed = true;
  }

  // 3. Fix Zobacz usługi button
  if (html.includes('Zobacz usługi &rarr;')) {
    html = html.replace('class="px-8 py-4 rounded-full border border-white/20 text-bone hover:bg-white/10', 'style="color: #f5f2ec !important;" class="px-8 py-4 rounded-full border border-white/20 text-bone hover:bg-white/10');
    changed = true;
  }
  if (html.includes('Skontaktuj się z nami &rarr;')) {
    html = html.replace('class="text-blue font-bold hover:text-white transition-colors flex items-center gap-2"', 'class="text-blue font-bold hover:text-white transition-colors flex items-center gap-2" style="color: #2563eb !important;"');
    changed = true;
  }

  // 4. Update Hero Blend HTML
  const oldBlend1 = '<div class="absolute inset-0 bg-[url(assets/hero.jpg)] bg-cover bg-center bg-fixed w-full h-full"></div>';
  const oldBlend2 = '<div class="absolute inset-0 bg-[url(../assets/hero.jpg)] bg-cover bg-center bg-fixed w-full h-full"></div>';
  const oldGrad = '<div class="absolute inset-0 hero-grad"></div>';
  const oldBottom = '<div class="absolute bottom-0 left-0 w-full h-16 -bottom-2 opacity-90 bg-gradient-to-t from-ink to-transparent z-0 pointer-events-none"></div>';
  const oldBottom2 = '<div class="absolute bottom-0 left-0 w-full h-16 -bottom-2 opacity-90 bg-gradient-to-t from-[#0b0f14] to-transparent z-0 pointer-events-none"></div>';

  if (html.includes(oldBlend1) && html.includes(oldGrad)) {
    const newBlend = `  <div class="absolute inset-0 hero-mask pointer-events-none z-0">
    <div class="absolute inset-0 bg-[url(assets/hero.jpg)] bg-cover bg-center bg-fixed w-full h-full"></div>
    <div class="absolute inset-0 hero-grad"></div>
  </div>`;
    html = html.replace(oldBlend1 + '\\n  ' + oldGrad, newBlend);
    if(html.includes(oldBottom)) html = html.replace(oldBottom, '');
    if(html.includes(oldBottom2)) html = html.replace(oldBottom2, '');
    changed = true;
  } else if (html.includes(oldBlend2) && html.includes(oldGrad)) {
    const newBlend = `  <div class="absolute inset-0 hero-mask pointer-events-none z-0">
    <div class="absolute inset-0 bg-[url(../assets/hero.jpg)] bg-cover bg-center bg-fixed w-full h-full"></div>
    <div class="absolute inset-0 hero-grad"></div>
  </div>`;
    html = html.replace(oldBlend2 + '\\n  ' + oldGrad, newBlend);
    if(html.includes(oldBottom)) html = html.replace(oldBottom, '');
    if(html.includes(oldBottom2)) html = html.replace(oldBottom2, '');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log('Processed ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  processHtmlFile(file);
});
