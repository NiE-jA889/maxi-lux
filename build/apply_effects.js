const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function applyEffectsToFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  let changed = false;

  // Add AOS CSS
  if (!content.includes('aos.css')) {
    $('head').append('<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">\n');
    changed = true;
  }

  // Add AOS JS
  if (!content.includes('aos.js')) {
    $('body').append(`
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50
    });
  });
</script>
`);
    changed = true;
  }

  // Apply Parallax to Hero in index.html
  if (filePath === 'index.html' || filePath.endsWith('\\index.html')) {
    const heroImg = $('img[src="assets/hero.jpg"].absolute.inset-0');
    if (heroImg.length > 0) {
      // Changed to use double quotes instead of escaped single quotes to avoid syntax errors
      heroImg.replaceWith('<div class="absolute inset-0 bg-[url(assets/hero.jpg)] bg-cover bg-center bg-fixed w-full h-full"></div>');
      changed = true;
    }
    
    // Add generic scroll animations to major sections
    // Hero text
    $('.max-w-3xl > h1').attr('data-aos', 'fade-up');
    $('.max-w-3xl > p').attr('data-aos', 'fade-up').attr('data-aos-delay', '100');
    $('.max-w-3xl > .flex-wrap').attr('data-aos', 'fade-up').attr('data-aos-delay', '200');
    $('.mt-16.max-w-2xl').attr('data-aos', 'fade-up').attr('data-aos-delay', '300');
    
    // Services items
    $('#uslugi .grid > a').each((i, el) => {
      $(el).attr('data-aos', 'fade-up').attr('data-aos-delay', (i % 4) * 100);
      changed = true;
    });

    // About section elements
    $('#o-nas .grid > div').each((i, el) => {
      $(el).attr('data-aos', 'fade-up');
      changed = true;
    });
  }

  // Apply animations to other pages broadly
  if (filePath !== 'index.html' && !filePath.endsWith('\\index.html')) {
    $('h1, h2').attr('data-aos', 'fade-up');
    $('.grid > div, .grid > a').attr('data-aos', 'fade-up');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, $.html());
    console.log('Applied effects to ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  applyEffectsToFile(file);
});
