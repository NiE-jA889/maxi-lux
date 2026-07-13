const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Remove map from footer
  const mapRegex = /<!-- Map -->[\s\S]*?<\/div>\s*<\/div>/;
  if (html.match(mapRegex)) {
    html = html.replace(mapRegex, '');
    changed = true;
  }
  // Change grid-cols-4 to grid-cols-3 in footer
  if (html.includes('grid md:grid-cols-4 gap-10')) {
    html = html.replace('grid md:grid-cols-4 gap-10', 'grid md:grid-cols-3 gap-10');
    changed = true;
  }

  // 2. Fix the border in injected CSS
  if (html.includes('border: 1px solid rgba(0, 0, 0, 0.08) !important;')) {
    html = html.replace('border: 1px solid rgba(0, 0, 0, 0.08) !important;', '');
    changed = true;
  }
  if (html.includes('.light-theme .border-glassBorder {\n    border-color: rgba(0, 0, 0, 0.15) !important;')) {
    html = html.replace('.light-theme .border-glassBorder {\n    border-color: rgba(0, 0, 0, 0.15) !important;', '.light-theme .border-glassBorder {\n    border-color: rgba(0, 0, 0, 0.25) !important;');
    changed = true;
  }
  
  // Make dark mode border stronger
  if (html.includes('--color-glass-border: rgba(255, 255, 255, 0.1);')) {
    html = html.replace('--color-glass-border: rgba(255, 255, 255, 0.1);', '--color-glass-border: rgba(255, 255, 255, 0.2);');
    changed = true;
  }

  // 3. Fix hero blend
  if (html.includes('h-64 bg-gradient-to-t')) {
    html = html.replace('h-64 bg-gradient-to-t', 'h-32 -bottom-1 bg-gradient-to-t');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log('Processed ' + filePath);
  }
}

// Przetwarzanie wszystkich plików HTML
const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'dokumenty.html');
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  processFile(file);
});

// Specjalna poprawka dla dokumenty.html
const indexHtml = fs.readFileSync('index.html', 'utf8');
const headerEnd = indexHtml.indexOf('<!-- Hero -->');
const footerStart = indexHtml.indexOf('<!-- Footer -->');

if (headerEnd !== -1 && footerStart !== -1) {
  const headerPart = indexHtml.substring(0, headerEnd);
  const footerPart = indexHtml.substring(footerStart);
  
  // Ustawiamy właściwy tytuł dla dokumenty
  const customHeaderPart = headerPart.replace('<title>MAXI-LUX — Pogotowie Kanalizacyjne 24/7 | Warszawa i okolice</title>', '<title>Dokumenty do pobrania | Maxi-Lux</title>');

  const contentPart = `<!-- Dokumenty -->
<section class="py-32 relative min-h-[70vh] overflow-hidden z-10 flex items-center justify-center">
  <div class="max-w-[800px] mx-auto px-6 relative z-10 w-full text-center" data-aos="fade-up">
    <div class="rounded-[2rem] border border-glassBorder p-10 md:p-16 overflow-hidden bg-glass backdrop-blur-md shadow-2xl">
      <h2 class="serif text-4xl md:text-5xl mb-6 text-blue leading-none">Dokumenty do pobrania</h2>
      <p class="text-bone/80 mb-10 leading-relaxed text-lg">Ta zawartość jest chroniona hasłem. Wprowadź poniżej hasło, aby uzyskać dostęp do panelu dokumentów BDO.</p>
      <form action="?action=ppw_postpass&type=individual&callback_url=https%3A%2F%2Fmaxi-lux.pl%2Fdokumenty-do-pobrania%2F" method="post" class="flex flex-col md:flex-row gap-4 justify-center items-center">
        <input placeholder="Wprowadź hasło..." name="post_password" type="password" class="w-full md:w-auto md:min-w-[300px] px-6 py-4 rounded-full bg-ink border border-glassBorder text-bone focus:outline-none focus:border-blue transition-colors shadow-inner placeholder:text-bone/30">
        <input type="hidden" name="post_id" value="468">
        <button type="submit" class="w-full md:w-auto bg-blue hover:bg-blueSoft text-ink font-bold px-10 py-4 rounded-full transition-all shadow-lg shadow-blue/20">Wejście</button>
      </form>
    </div>
  </div>
</section>
`;

  fs.writeFileSync('dokumenty.html', customHeaderPart + contentPart + footerPart);
  console.log('Rebuilt dokumenty.html');
}

