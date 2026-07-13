const fs = require('fs');
const path = require('path');

function fixHamburger(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Fix the button onclick
  const newOnclick = "onclick=\"event.preventDefault(); const m = document.getElementById('mobile-menu'); if(m.style.display === 'block') { m.style.display = 'none'; } else { m.style.display = 'block'; }\"";
  
  html = html.replace(/onclick="event\.preventDefault\(\); const m = document\.getElementById\('mobile-menu'\);[^"]+"/, newOnclick);

  // 2. Fix the mobile menu div initial state
  const oldMenuDiv = '<div id="mobile-menu" class="hidden lg:hidden';
  const newMenuDiv = '<div id="mobile-menu" style="display: none;" class="lg:hidden';
  if (html.includes(oldMenuDiv)) {
    html = html.replace(oldMenuDiv, newMenuDiv);
  } else if (!html.includes('style="display: none;"') && html.includes('id="mobile-menu"')) {
    html = html.replace('<div id="mobile-menu" class="lg:hidden', newMenuDiv);
  }
  
  changed = true; // Always write back to be sure

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log('Fixed hamburger logic in ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  fixHamburger(file);
});

// Sync to build directory
const buildDir = path.join(__dirname, 'build');
if (fs.existsSync(buildDir)) {
  [...rootFiles, ...uslugiFiles].forEach(file => {
    const dest = path.join(buildDir, file);
    fs.copyFileSync(file, dest);
  });
  console.log('Synced HTML files to build directory.');
}
