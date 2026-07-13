const fs = require('fs');
const path = require('path');
const https = require('https');

const pages = [
  { name: 'o-nas', url: 'https://maxi-lux.pl/o-nas/' },
  { name: 'wywoz-odpadow', url: 'https://maxi-lux.pl/wywoz-odpadow-bdo/' },
  { name: 'galeria', url: 'https://maxi-lux.pl/galeria/' },
  { name: 'dokumenty', url: 'https://maxi-lux.pl/dokumenty-do-pobrania/' },
  { name: 'kontakt', url: 'https://maxi-lux.pl/kontakt/' },
  { name: 'praca', url: 'https://maxi-lux.pl/praca/' },
  { name: 'zlecenie', url: 'https://maxi-lux.pl/zlecenie-uslugi/' },
  { name: 'udraznianie-rur', url: 'https://maxi-lux.pl/udraznianie-rur/', folder: 'uslugi' },
  { name: 'pogotowie-kanalizacyjne', url: 'https://maxi-lux.pl/pogotowie-kanalizacyjne/', folder: 'uslugi' },
  { name: 'przepychanie-rur', url: 'https://maxi-lux.pl/przepychanie-rur/', folder: 'uslugi' },
  { name: 'wuko', url: 'https://maxi-lux.pl/wuko/', folder: 'uslugi' },
  { name: 'czyszczenie-separatorow', url: 'https://maxi-lux.pl/czyszczenie-separatorow/', folder: 'uslugi' },
  { name: 'czyszczenie-piaskownikow', url: 'https://maxi-lux.pl/czyszczenie-piaskownikow/', folder: 'uslugi' },
  { name: 'serwis-przepompowni', url: 'https://maxi-lux.pl/serwis-przepompowni-sciekow/', folder: 'uslugi' },
  { name: 'inspekcja-kamera', url: 'https://maxi-lux.pl/inspekcja-kamera-kanalizacyjna/', folder: 'uslugi' },
  { name: 'cisnieniowe-mycie-zbiornikow', url: 'https://maxi-lux.pl/cisnieniowe-mycie-zbiornikow/', folder: 'uslugi' },
  { name: 'mycie-ulic', url: 'https://maxi-lux.pl/mycie-ulic-placow/', folder: 'uslugi' },
  { name: 'czyszczenie-przepustow', url: 'https://maxi-lux.pl/czyszczenie-przepustow-drogowych/', folder: 'uslugi' },
  { name: 'naprawy-bezwykopowe', url: 'https://maxi-lux.pl/naprawy-bezwykopowe-rur-metoda-quicklock/', folder: 'uslugi' },
  { name: 'lokalizacja-pokryw', url: 'https://maxi-lux.pl/lokalizacja-pokryw-kanalizacyjnych-studni/', folder: 'uslugi' },
  { name: 'frezowanie-kanalizacji', url: 'https://maxi-lux.pl/frezowanie-kanalizacji/', folder: 'uslugi' },
  { name: 'transport-adr', url: 'https://maxi-lux.pl/transport-adr/', folder: 'uslugi' }
];

const indexContent = fs.readFileSync('index.html', 'utf8');

// Extract header and footer from index.html
const headerMatch = indexContent.match(/(<!doctype html>[\s\S]*?<!-- Hero -->)/);
let header = headerMatch ? headerMatch[1] : '';

// Remove 'absolute' from header for subpages so it doesn't overlap content
header = header.replace('absolute top-8 md:top-10', 'relative py-8');

const footerMatch = indexContent.match(/(<!-- Footer -->[\s\S]*?<\/html>)/);
const footer = footerMatch ? footerMatch[1] : '';

// Create directories
if (!fs.existsSync('uslugi')) {
  fs.mkdirSync('uslugi');
}

const fetchUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
};

const extractContent = (html) => {
  // Very basic extraction: try to find the main content div or just strip scripts/styles
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : html;
  
  // Try to find main content area (div with class entry-content or similar)
  const contentMatch = body.match(/<div class="[^"]*entry-content[^"]*">([\s\S]*?)<\/div>\s*<!-- \.entry-content -->/i) || 
                       body.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
                       body.match(/<div class="[^"]*content[^"]*">([\s\S]*?)<\/div>/i);
                       
  if (contentMatch) body = contentMatch[1];
  
  // Strip tags but keep paragraphs, headings, lists
  body = body.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  body = body.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  body = body.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '');
  body = body.replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '');
  body = body.replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '');
  
  // Extract text and build clean HTML
  const cleanedText = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  
  return `
<section class="py-24 bg-ink relative min-h-[60vh]">
  <div class="max-w-4xl mx-auto px-6 relative z-10">
    <div class="rounded-[2rem] border border-white/10 bg-coal p-10 md:p-16">
      <h1 class="serif text-4xl md:text-5xl text-amber mb-8 border-b border-white/10 pb-6">Zestawienie informacji</h1>
      <div class="text-bone/80 space-y-6 leading-relaxed">
        <p>${cleanedText.substring(0, 5000)}</p>
      </div>
    </div>
  </div>
</section>`;
};

async function run() {
  for (const page of pages) {
    console.log(`Fetching ${page.url}...`);
    try {
      const html = await fetchUrl(page.url);
      const content = extractContent(html);
      
      let finalHeader = header;
      let finalFooter = footer;
      
      // Fix paths if in subfolder
      if (page.folder) {
        finalHeader = finalHeader.replace(/href="#/g, 'href="../index.html#');
        finalHeader = finalHeader.replace(/href="\.\.\//g, 'href="../');
        finalFooter = finalFooter.replace(/href="#/g, 'href="../index.html#');
      } else {
        finalHeader = finalHeader.replace(/href="#/g, 'href="index.html#');
        finalFooter = finalFooter.replace(/href="#/g, 'href="index.html#');
      }
      
      const filePath = page.folder ? path.join(page.folder, `${page.name}.html`) : `${page.name}.html`;
      fs.writeFileSync(filePath, finalHeader + content + finalFooter);
      console.log(`Saved ${filePath}`);
    } catch (e) {
      console.error(`Error on ${page.url}: ${e.message}`);
    }
  }
  console.log('Done!');
}

run();
