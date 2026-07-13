const fs = require('fs');
const path = require('path');

function removeConflictingScript(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find and remove the script block
  const scriptRegex = /<script id="mobileMenuToggleScript">[\s\S]*?<\/script>/g;
  if (scriptRegex.test(content)) {
    content = content.replace(scriptRegex, '');
    fs.writeFileSync(filePath, content);
    console.log('Removed conflicting script from ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  removeConflictingScript(file);
});
