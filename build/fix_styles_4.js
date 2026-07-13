const fs = require('fs');
const path = require('path');

function processHtmlFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Zobacz usługi button in Hero (must be white text)
  if (html.includes('class="px-8 py-4 rounded-full border border-bone/25 text-bone hover:border-blue hover:text-blue transition inline-flex items-center gap-3"')) {
    html = html.replace('class="px-8 py-4 rounded-full border border-bone/25 text-bone hover:border-blue hover:text-blue transition inline-flex items-center gap-3"', 'style="color: #f5f2ec !important;" class="px-8 py-4 rounded-full border border-bone/25 text-bone hover:border-blue hover:text-blue transition inline-flex items-center gap-3"');
    changed = true;
  }

  // 2. Add extra CSS fixes for header dropdowns, chip backgrounds, and glass shadows
  if (html.includes('</style>') && !html.includes('.header-dropdown-fix')) {
    const cssFixes = `
  /* Dropdowns and mobile menus inside header MUST have a solid dark background in light theme so white text is readable */
  .light-theme header .bg-glass, .light-theme header #mobile-services-menu, .light-theme .header-dropdown-fix {
    background-color: #111827 !important;
    border-color: rgba(255,255,255,0.1) !important;
  }

  /* Make chip backgrounds slightly darker in light theme so text is more visible */
  .light-theme .chip {
    background: rgba(0,0,0,0.05) !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.03) !important;
  }

  /* Ensure the shadow around bg-glass (cards, pages) is extremely noticeable in light mode */
  .light-theme .bg-glass {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 30px rgba(0, 0, 0, 0.05) !important;
    border: 1px solid rgba(0,0,0,0.15) !important;
  }
`;
    html = html.replace('</style>', cssFixes + '</style>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log('Processed ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  processHtmlFile(file);
});
