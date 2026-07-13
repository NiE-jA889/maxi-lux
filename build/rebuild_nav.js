const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function processFile(filePath, isSubdir) {
  let content = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(content);
  
  // Find original header
  const header = $('header');
  if (header.length === 0) return;
  
  // Extract desktop nav HTML
  const navHtml = header.find('nav').html();
  const indexHref = isSubdir ? '../index.html' : 'index.html';
  const logoHref = isSubdir ? '../logo/logo.png' : 'logo/logo.png';
  const zlecenieHref = isSubdir ? '../zlecenie.html' : 'zlecenie.html';
  
  // Create mobile links by stripping out dropdown behavior and formatting as simple links
  let mobileNavHtml = navHtml.replace(/<div class="relative group[^>]*>[\s\S]*?<button[^>]*>([\s\S]*?)<\/button>[\s\S]*?<div class="absolute[^>]*>([\s\S]*?)<\/div>[\s\S]*?<\/div>/g, (match, btnContent, dropdownContent) => {
    // Just dump the dropdown content links directly into the mobile menu
    return dropdownContent.replace(/class="[^"]*"/g, 'class="px-2 py-3 border-b border-white/5 hover:text-blue block"');
  });
  // Clean up classes for mobile links
  mobileNavHtml = mobileNavHtml.replace(/class="hover:text-blue transition-colors"/g, 'class="px-2 py-3 border-b border-white/5 hover:text-blue block"');
  mobileNavHtml = mobileNavHtml.replace(/<button[^>]*aria-label="Szukaj"[^>]*>[\s\S]*?<\/button>/g, '');
  
  const newHeader = `
<header class="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-white/10 shadow-2xl transition-all duration-300">
  <div class="max-w-[1400px] mx-auto px-4 md:px-6 py-2 flex items-center justify-between">
    <a href="${indexHref}" class="flex items-center gap-3">
      <img src="${logoHref}" alt="Maxi-Lux Logo" class="h-20 md:h-28 w-auto object-contain drop-shadow-2xl">
    </a>
    
    <nav class="hidden lg:flex items-center gap-6 text-sm font-medium text-bone/90">
      ${navHtml}
    </nav>
    
    <div class="hidden lg:flex items-center gap-4">
      <a href="${zlecenieHref}" class="bg-blue text-ink px-6 py-2.5 rounded-sm font-semibold text-sm hover:bg-blueSoft transition-colors shadow-lg shadow-blue/20">Zlecenie wykonania usługi</a>
    </div>

    <!-- Hamburger -->
    <button id="mobile-menu-btn" class="lg:hidden text-bone focus:outline-none p-2 hover:text-blue transition-colors">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
    </button>
  </div>
  
  <!-- Mobile Menu -->
  <div id="mobile-menu" class="hidden lg:hidden bg-coal border-t border-white/10 absolute left-0 right-0 max-h-[85vh] overflow-y-auto shadow-2xl w-full">
    <div class="px-6 py-4 flex flex-col font-medium text-bone/90">
      ${mobileNavHtml}
      <a href="${zlecenieHref}" class="bg-blue text-ink px-6 py-4 rounded-xl text-center mt-6 font-bold shadow-xl shadow-blue/20">Zlecenie wykonania usługi</a>
    </div>
  </div>
</header>
  `;
  
  // Also add the script to toggle menu if not exists
  let scriptHtml = '';
  if (!content.includes('mobile-menu-btn')) {
    scriptHtml = `
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if(btn && menu) {
      btn.addEventListener('click', function() {
        menu.classList.toggle('hidden');
      });
    }
  });
</script>
`;
  }
  
  header.replaceWith(newHeader);
  
  let finalHtml = $.html();
  if (scriptHtml) {
    finalHtml = finalHtml.replace('</body>', scriptHtml + '\n</body>');
  }
  
  fs.writeFileSync(filePath, finalHtml);
  console.log('Rebuilt nav in ' + filePath);
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  const isSubdir = file.includes('uslugi') || file.includes('uslugi\\');
  processFile(file, isSubdir);
});
