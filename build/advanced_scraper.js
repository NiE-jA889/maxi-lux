const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');

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

const headerMatch = indexContent.match(/(<!doctype html>[\s\S]*?<!-- Hero -->)/);
let header = headerMatch ? headerMatch[1] : '';
header = header.replace('absolute top-8 md:top-10', 'relative py-8');

const footerMatch = indexContent.match(/(<!-- Footer -->[\s\S]*?<\/html>)/);
const footer = footerMatch ? footerMatch[1] : '';

const fetchUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
};

const extractContent = (html, pageUrl) => {
  const $ = cheerio.load(html);
  
  // Enfold theme puts everything in #main, but fullwidth elements break out of <main> tags.
  let contentArea = $('#main').clone();
  
  if (contentArea.length === 0) {
    contentArea = $('body').clone();
    contentArea.find('header, footer, nav').remove();
  }

  // Remove footer areas from Enfold
  contentArea.find('#footer, #socket, .footer_color, .socket_color').remove();
  
  // Clean up unwanted elements from contentArea
  contentArea.find('script, style').remove();

  // Remove some known noisy elements (social shares, comments, extra navigation)
  contentArea.find('.sharedaddy, #comments, .navigation, .sidebar').remove();
  
  // Fix image URLs to be absolute if they are relative
  contentArea.find('img').each((i, el) => {
    let src = $(el).attr('src');
    let srcset = $(el).attr('srcset');
    
    if (src && src.startsWith('/')) {
      $(el).attr('src', 'https://maxi-lux.pl' + src);
    }
    if (srcset) {
        $(el).removeAttr('srcset'); // Remove srcset to simplify and force using the main src
    }
    
    // Add tailwind classes to images to make them look good in the dark theme
    $(el).addClass('rounded-xl border border-white/10 shadow-xl max-w-full h-auto my-6');
  });

  // Apply some basic tailwind typography classes to make it fit our theme
  contentArea.find('h1, h2, h3, h4, h5, h6').addClass('serif text-amber mb-4 mt-8');
  contentArea.find('h1').addClass('text-4xl md:text-5xl border-b border-white/10 pb-4');
  contentArea.find('h2').addClass('text-3xl');
  contentArea.find('h3').addClass('text-2xl');
  contentArea.find('p, li').addClass('text-bone/80 mb-4 leading-relaxed');
  contentArea.find('ul').addClass('list-disc pl-6 mb-6');
  contentArea.find('ol').addClass('list-decimal pl-6 mb-6');
  contentArea.find('a').addClass('text-amber hover:text-amberSoft underline transition-colors');
  contentArea.find('iframe').addClass('rounded-xl border border-white/10 w-full my-6 aspect-video'); // For youtube embeds

  return `
<section class="py-24 bg-ink relative min-h-[70vh]">
  <div class="max-w-[1000px] mx-auto px-6 relative z-10">
    <div class="rounded-[2rem] border border-white/10 bg-coal p-10 md:p-16 overflow-hidden">
      ${contentArea.html() || '<p class="text-bone">Brak treści do wyświetlenia.</p>'}
    </div>
  </div>
</section>`;
};

async function run() {
  for (const page of pages) {
    console.log(`Fetching ${page.url}...`);
    try {
      const html = await fetchUrl(page.url);
      const content = extractContent(html, page.url);
      
      let finalHeader = header;
      let finalFooter = footer;
      
      if (page.folder) {
        finalHeader = finalHeader.replace(/href="index.html/g, 'href="../index.html');
        finalHeader = finalHeader.replace(/href="o-nas.html/g, 'href="../o-nas.html');
        finalHeader = finalHeader.replace(/href="wywoz-odpadow.html/g, 'href="../wywoz-odpadow.html');
        finalHeader = finalHeader.replace(/href="galeria.html/g, 'href="../galeria.html');
        finalHeader = finalHeader.replace(/href="dokumenty.html/g, 'href="../dokumenty.html');
        finalHeader = finalHeader.replace(/href="kontakt.html/g, 'href="../kontakt.html');
        finalHeader = finalHeader.replace(/href="praca.html/g, 'href="../praca.html');
        finalHeader = finalHeader.replace(/href="zlecenie.html/g, 'href="../zlecenie.html');
        finalHeader = finalHeader.replace(/href="uslugi\//g, 'href="'); // Fix dropdown links
        finalHeader = finalHeader.replace(/src="assets\//g, 'src="../assets/');
        finalFooter = finalFooter.replace(/href="#/g, 'href="../index.html#');
      } else {
        // Fix dropdown links if we are in root
        // They already point to uslugi/ which is correct
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
