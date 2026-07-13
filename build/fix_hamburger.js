const fs = require('fs');
const path = require('path');

function fixHamburger(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const btnRegex = /<button id="mobile-menu-btn"[^>]*>/;
  const matchBtn = content.match(btnRegex);
  
  if (matchBtn) {
    // Completely rewrite the onclick attribute
    let newBtn = matchBtn[0];
    
    // Remove any existing onclick to avoid duplicates
    newBtn = newBtn.replace(/onclick="[^"]*"\s*/g, '');
    
    // Insert new robust onclick
    const newOnclick = `onclick="event.preventDefault(); const m = document.getElementById('mobile-menu'); if(m.classList.contains('hidden')) { m.classList.remove('hidden'); m.style.display = 'block'; } else { m.classList.add('hidden'); m.style.display = 'none'; }" `;
    newBtn = newBtn.replace('class="', newOnclick + 'class="');
    
    if (newBtn !== matchBtn[0]) {
      content = content.replace(matchBtn[0], newBtn);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed hamburger in ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  fixHamburger(file);
});
