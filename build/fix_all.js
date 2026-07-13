const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function fixAllMobileMenus(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const $ = cheerio.load(content);
  const mobileMenu = $('#mobile-menu');
  
  if (mobileMenu.length > 0) {
    // Determine how to find the uslugi links based on if we are in root or uslugi/
    const isUslugiDir = filePath.includes('uslugi\\') || filePath.includes('uslugi/');
    
    // Find the container that holds the services links
    let uslugiContainer;
    if (isUslugiDir) {
      // In uslugi/, links look like "udraznianie-rur.html"
      // Let's just find the link for "udraznianie-rur.html"
      uslugiContainer = mobileMenu.find('a[href*="udraznianie-rur.html"]').parent();
    } else {
      uslugiContainer = mobileMenu.find('a[href*="uslugi/udraznianie-rur.html"]').parent();
    }

    if (uslugiContainer.length > 0 && !uslugiContainer.attr('id')) {
      const linksHtml = uslugiContainer.html();
      
      const newAccordionHtml = `
        <div class="border-b border-white/5">
          <button id="mobile-services-btn" onclick="event.preventDefault(); const m = this.nextElementSibling; if(m.classList.contains('hidden')){ m.classList.remove('hidden'); m.style.display='flex'; this.querySelector('svg').style.transform='rotate(180deg)'; } else { m.classList.add('hidden'); m.style.display='none'; this.querySelector('svg').style.transform='rotate(0deg)'; }" class="w-full text-left px-2 py-3 hover:text-blue flex items-center justify-between font-medium">
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

  // Double check that root files have the correct new robust onclick
  const btnRegex = /<button id="mobile-services-btn" onclick="[^"]*" class="[^"]*">/;
  const matchBtn = content.match(btnRegex);
  if (matchBtn) {
    if (matchBtn[0].includes('classList.toggle')) {
      const newBtn = matchBtn[0].replace(/onclick="[^"]*"/, `onclick="event.preventDefault(); const m = this.nextElementSibling; if(m.classList.contains('hidden')){ m.classList.remove('hidden'); m.style.display='flex'; this.querySelector('svg').style.transform='rotate(180deg)'; } else { m.classList.add('hidden'); m.style.display='none'; this.querySelector('svg').style.transform='rotate(0deg)'; }"`);
      content = content.replace(matchBtn[0], newBtn);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, $.html ? $.html() : content);
    console.log('Fixed mobile menu in ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  fixAllMobileMenus(file);
});
