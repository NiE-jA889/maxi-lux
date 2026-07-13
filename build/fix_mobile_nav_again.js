const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function fixMobileMenuAgain(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Replace the button onclick to be robust
  const btnRegex = /<button id="mobile-services-btn"[^>]*>/;
  const matchBtn = content.match(btnRegex);
  if (matchBtn) {
    const newBtn = matchBtn[0].replace(/onclick="[^"]*"/, `onclick="event.preventDefault(); const m = this.nextElementSibling; if(m.classList.contains('hidden')){ m.classList.remove('hidden'); m.style.display='flex'; this.querySelector('svg').style.transform='rotate(180deg)'; } else { m.classList.add('hidden'); m.style.display='none'; this.querySelector('svg').style.transform='rotate(0deg)'; }"`);
    content = content.replace(matchBtn[0], newBtn);
    changed = true;
  }

  // 2. Ensure mobile-services-menu doesn't rely on tailwind toggle classes that might be missing
  const menuRegex = /<div id="mobile-services-menu"[^>]*>/;
  const matchMenu = content.match(menuRegex);
  if (matchMenu) {
    // Just ensure it has hidden class
    content = content.replace(matchMenu[0], '<div id="mobile-services-menu" class="hidden flex-col pl-4 text-sm bg-black/20 pb-2 border-b border-white/5">');
    changed = true;
  }

  // 3. Remove any remaining script tags for mobile menu
  const scriptRegex = /<script id="mobileMenuToggleScript">[\s\S]*?<\/script>/g;
  if (scriptRegex.test(content)) {
    content = content.replace(scriptRegex, '');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed mobile menu in ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  fixMobileMenuAgain(file);
});
