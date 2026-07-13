const fs = require('fs');
const path = require('path');

function fixHamburger(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Find the hamburger button onclick
  const badOnclick = "onclick=\"event.preventDefault(); const m = document.getElementById('mobile-menu'); if(m.classList.contains('hidden')) { m.classList.remove('hidden'); m.style.display = 'block'; } else { m.classList.add('hidden'); m.style.display = 'none'; }\"";
  const newOnclick = "onclick=\"event.preventDefault(); const m = document.getElementById('mobile-menu'); m.classList.toggle('hidden'); m.style.display = '';\"";
  
  if (html.includes(badOnclick)) {
    html = html.replace(badOnclick, newOnclick);
    changed = true;
  } else if (html.includes('id="mobile-menu-btn"')) {
    // If it's slightly different, use a regex to replace it
    html = html.replace(/onclick="event\.preventDefault\(\); const m = document\.getElementById\('mobile-menu'\);[^"]+"/, newOnclick);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log('Fixed hamburger in ' + filePath);
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
