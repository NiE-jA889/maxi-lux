const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function processFile(filePath, isSubdir) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace tailwind config hex colors
  content = content.replace(/amber:\s*'[^']+'/g, "blue: '#2563eb'");
  content = content.replace(/amberSoft:\s*'[^']+'/g, "blueSoft: '#60a5fa'");
  
  // 2. Replace classes and references
  content = content.replace(/amberSoft/g, 'blueSoft');
  content = content.replace(/amber/g, 'blue');
  
  // Now load with cheerio to replace the logo
  const $ = cheerio.load(content);
  
  // The logo link is usually the first 'a' inside the header.
  // In our template it is: <a href="#" class="flex items-center gap-3">
  const logoLink = $('header').find('a').first();
  if (logoLink.length > 0) {
    // The logo file path depends on subdir
    const logoPath = isSubdir ? '../logo/logo.png' : 'logo/logo.png';
    
    // Replace the inner HTML of the logo link with the new logo
    logoLink.html(`<img src="${logoPath}" alt="Maxi-Lux Logo" class="h-16 w-auto object-contain drop-shadow-xl" />`);
    
    // Make sure it links to the homepage properly
    logoLink.attr('href', isSubdir ? '../index.html' : 'index.html');
  }

  fs.writeFileSync(filePath, $.html());
  console.log('Updated ' + filePath);
}

// Gather files
const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f));

[...rootFiles, ...uslugiFiles].forEach(file => {
  const isSubdir = file.includes('uslugi') || file.includes('uslugi\\');
  processFile(file, isSubdir);
});
