const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  let changed = false;

  const mobileMenu = $('#mobile-menu');
  
  if (mobileMenu.length > 0) {
    // 1. Find the parent of the first uslugi link, which is the flat div wrapper containing all the links
    const uslugiContainer = mobileMenu.find('a[href*="uslugi/"]').parent();
    
    // We only want to process if it's the flat container without an accordion
    if (uslugiContainer.length > 0 && !uslugiContainer.attr('id')) {
      const linksHtml = uslugiContainer.html();
      
      const newAccordionHtml = `
        <div class="border-b border-white/5">
          <button id="mobile-services-btn" class="w-full text-left px-2 py-3 hover:text-blue flex items-center justify-between font-medium">
            Usługi
            <svg id="mobile-services-icon" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div id="mobile-services-menu" class="hidden flex-col pl-4 text-sm bg-black/20 pb-2">
            ${linksHtml}
          </div>
        </div>
      `;
      
      uslugiContainer.replaceWith(newAccordionHtml);
      changed = true;
    }
  }

  // 2. Add the JS logic for the mobile menu toggle if it doesn't exist
  if (!content.includes('mobile-services-btn') || changed) {
    if (!content.includes('mobileMenuToggleScript')) {
      $('body').append(`
<script id="mobileMenuToggleScript">
  document.addEventListener('DOMContentLoaded', function() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if(mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mobileMenu.classList.toggle('hidden');
      });
    }

    const servicesBtn = document.getElementById('mobile-services-btn');
    const servicesMenu = document.getElementById('mobile-services-menu');
    const servicesIcon = document.getElementById('mobile-services-icon');
    if(servicesBtn && servicesMenu) {
      servicesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        servicesMenu.classList.toggle('hidden');
        servicesMenu.classList.toggle('flex');
        servicesIcon.classList.toggle('rotate-180');
      });
    }
  });
</script>
`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, $.html());
    console.log('Fixed mobile nav in ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  processFile(file);
});
