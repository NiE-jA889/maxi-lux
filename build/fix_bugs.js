const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// --- 1. Fix Mobile Menu by using inline onclicks to guarantee execution ---
function fixMobileMenu(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add inline onclick to hamburger button
  const hamburgerRegex = /<button id="mobile-menu-btn"[^>]*>/;
  const matchBtn = content.match(hamburgerRegex);
  if (matchBtn && !matchBtn[0].includes('onclick')) {
    const newBtn = matchBtn[0].replace('class="', 'onclick="document.getElementById(\'mobile-menu\').classList.toggle(\'hidden\')" class="');
    content = content.replace(hamburgerRegex, newBtn);
    changed = true;
  }

  // Add inline onclick to services accordion
  const servicesRegex = /<button id="mobile-services-btn"[^>]*>/;
  const matchServices = content.match(servicesRegex);
  if (matchServices && !matchServices[0].includes('onclick')) {
    const newServicesBtn = matchServices[0].replace('class="', 'onclick="event.preventDefault(); document.getElementById(\'mobile-services-menu\').classList.toggle(\'hidden\'); document.getElementById(\'mobile-services-menu\').classList.toggle(\'flex\'); document.getElementById(\'mobile-services-icon\').classList.toggle(\'rotate-180\')" class="');
    content = content.replace(servicesRegex, newServicesBtn);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  fixMobileMenu(file);
});
console.log('Mobile menu inline scripts added.');

// --- 2. Fix Gallery Lightbox ---
const galeriaPath = 'galeria.html';
if (fs.existsSync(galeriaPath)) {
  let gContent = fs.readFileSync(galeriaPath, 'utf8');
  const $g = cheerio.load(gContent);
  
  // Add fslightbox script
  if (!gContent.includes('fslightbox')) {
    $g('body').append('<script src="https://cdnjs.cloudflare.com/ajax/libs/fslightbox/3.4.1/index.min.js"></script>');
  }

  // Change div gallery wrappers to anchor tags for lightbox
  let galleryUpdated = false;
  $g('.grid.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-4').find('> div').each((i, el) => {
    // If it's a div, change it to an A tag
    if (el.tagName.toLowerCase() === 'div') {
      const img = $g(el).find('img').first();
      const src = img.attr('src');
      
      if (src) {
        // Create an a tag with the exact same classes and content
        const aTag = $g('<a></a>');
        aTag.attr('href', src);
        aTag.attr('data-fslightbox', 'gallery');
        aTag.attr('class', $g(el).attr('class'));
        // Ensure cursor pointer for clarity
        aTag.addClass('cursor-pointer');
        aTag.html($g(el).html());
        
        $g(el).replaceWith(aTag);
        galleryUpdated = true;
      }
    }
  });

  if (galleryUpdated || !gContent.includes('fslightbox')) {
    fs.writeFileSync(galeriaPath, $g.html());
    console.log('Gallery lightbox implemented!');
  }
}
