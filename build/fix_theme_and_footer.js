const fs = require('fs');
const path = require('path');

const newFooterHtml = `<footer class="bg-ink border-t border-glassBorder pt-12 pb-6 relative z-20">
  <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 mb-8">
    <!-- Adres -->
    <div class="flex flex-col items-center text-center">
      <h3 class="font-bold text-bone mb-2">Adres</h3>
      <div class="w-24 h-[1px] bg-glassBorder relative mb-4">
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-ink flex items-center justify-center text-blue">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
        </div>
      </div>
      <div class="text-sm text-bone/80 space-y-1">
        <p class="font-bold text-bone">MAXI-LUX Krzysztof Jarosiński</p>
        <p>ul. Wawrzyniecka 78,</p>
        <p>05-340 Kołbiel k/Warszawy</p>
        <p class="mt-2">NIP: 521 185 58 30</p>
        <p>BDO: 000557924</p>
      </div>
    </div>
    
    <!-- Kontakt -->
    <div class="flex flex-col items-center text-center">
      <h3 class="font-bold text-bone mb-2">Kontakt</h3>
      <div class="w-24 h-[1px] bg-glassBorder relative mb-4">
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-ink flex items-center justify-center text-blue">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
        </div>
      </div>
      <div class="text-sm text-bone/80 space-y-1">
        <p>Telefon: <a href="tel:+48513412313" class="hover:text-blue transition border-b border-blue/30">513 412 313</a></p>
        <p>E-mail: <a href="mailto:biuro@maxi-lux.pl" class="hover:text-blue transition border-b border-blue/30">biuro@maxi-lux.pl</a></p>
      </div>
    </div>

    <!-- Usługi -->
    <div class="flex flex-col items-center text-center">
      <h3 class="font-bold text-bone mb-2">Usługi</h3>
      <div class="w-24 h-[1px] bg-glassBorder relative mb-4">
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-ink flex items-center justify-center text-blue">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>
        </div>
      </div>
      <div class="text-sm text-bone/80 space-y-1">
        <p><a href="#uslugi" class="hover:text-blue transition border-b border-transparent hover:border-blue/30 font-bold text-bone">Udrażnianie rur kanalizacyjnych</a></p>
        <p><a href="#uslugi" class="hover:text-blue transition border-b border-transparent hover:border-blue/30 font-bold text-bone">Pogotowie kanalizacyjne</a></p>
        <p><a href="#uslugi" class="hover:text-blue transition border-b border-transparent hover:border-blue/30 font-bold text-bone">Przepychanie rur</a></p>
        <p><a href="#uslugi" class="hover:text-blue transition border-b border-transparent hover:border-blue/30 font-bold text-bone">WUKO</a></p>
        <p><a href="#uslugi" class="hover:text-blue transition border-b border-transparent hover:border-blue/30 font-bold text-bone">Czyszczenie separatorów</a></p>
        <p><a href="#uslugi" class="hover:text-blue transition border-b border-transparent hover:border-blue/30 font-bold text-bone">Transport ADR</a></p>
      </div>
    </div>

    <!-- Map -->
    <div class="flex items-center justify-center">
      <div class="w-full h-40 rounded-lg overflow-hidden border border-glassBorder drop-shadow-lg">
         <iframe title="Lokalizacja firmy Maxi-Lux" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2449.9698162755!2d21.471223077185265!3d52.11667797195825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471f2b647f80891b%3A0xf12cd70fa696d011!2sMAXI-LUX%20%7C%20WUKO%20Pogotowie%20kanalizacyjne!5e0!3m2!1spl!2spl!4v1759231409172!5m2!1spl!2spl" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  </div>
  
  <div class="max-w-7xl mx-auto px-6 pt-6 border-t border-glassBorder flex flex-col md:flex-row items-center justify-between text-xs text-bone/50">
    <p>Copyright 2026 &copy; Maxi-Lux</p>
    <div class="flex gap-2 mt-4 md:mt-0">
      <a href="#" class="hover:text-blue transition">Polityka prywatności</a> |
      <a href="#" class="hover:text-blue transition">RODO</a> |
      <a href="#" class="hover:text-blue transition">BLOG</a> |
      <a href="#kontakt" class="hover:text-blue transition">Kontakt</a>
    </div>
    <a href="#" class="hover:text-blue transition mt-4 md:mt-0">SEO</a>
  </div>
</footer>`;

// Extra CSS to fix visibility in light mode
const lightThemeCSSFixes = `
  /* Lepsza widoczność w jasnym motywie */
  .light-theme .aesthetic-stripes div {
    opacity: 0.3 !important; /* ciemniejsze paski w tle */
  }
  .light-theme img[src*="logo.png"] {
    /* odwracamy kolory loga z białego na czarne z użyciem inwersji i obrotu odcieni, by niebieski został niebieskim! */
    filter: invert(1) hue-rotate(180deg) brightness(0.8) drop-shadow(0 4px 6px rgba(0,0,0,0.1)) !important;
  }
`;

function fixFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Replace Footer
  // Znajdujemy <footer> do </footer>
  const footerRegex = /<footer[^>]*>[\s\S]*?<\/footer>/;
  const match = html.match(footerRegex);
  if (match) {
    // Check if it's already the new footer to avoid double updates or overwriting unnecessarily
    if (!match[0].includes('MAXI-LUX Krzysztof Jarosiński')) {
      html = html.replace(match[0], newFooterHtml);
      changed = true;
    } else {
      // It has the text, so we just overwrite anyway to be sure it has the new HTML
      html = html.replace(match[0], newFooterHtml);
      changed = true;
    }
  }

  // 2. Fix Light Theme visibility (lines, logo, borders)
  // We need to change --color-glass-border in .light-theme
  if (html.includes('--color-glass-border: rgba(0, 0, 0, 0.1);')) {
    html = html.replace('--color-glass-border: rgba(0, 0, 0, 0.1);', '--color-glass-border: rgba(0, 0, 0, 0.25);');
    changed = true;
  }
  
  // Inject the extra CSS right before </style>
  if (!html.includes('.light-theme img[src*="logo.png"]')) {
    html = html.replace('</style>', lightThemeCSSFixes + '\n</style>');
    changed = true;
  }

  // Ensure all bg-black/30 are really replaced (maybe some were added or missed)
  // Also check bg-coal/50 for borders if they exist, but borders are mostly border-glassBorder now.
  
  // Actually, wait, the "Pełna oferta" grid cards might use bg-black/30 or similar. Let's make sure they use bg-glass.
  if (html.includes('bg-black/30')) {
     html = html.replace(/bg-black\/30/g, 'bg-glass');
     changed = true;
  }
  if (html.includes('border-white/10')) {
     html = html.replace(/border-white\/10/g, 'border-glassBorder');
     changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log('Fixed theme & footer in ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  fixFile(file);
});
