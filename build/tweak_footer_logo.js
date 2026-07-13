const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the footer tag
  const footerRegex = /<footer[^>]*>([\s\S]*?)<\/footer>/i;
  const match = content.match(footerRegex);
  
  if (match) {
    let footerHTML = match[0];
    
    // Replace the img tag in the footer
    const imgRegex = /<img src="([^"]+logo\.png)" alt="Maxi-Lux Logo"[^>]*>/;
    const imgMatch = footerHTML.match(imgRegex);
    
    if (imgMatch) {
      const src = imgMatch[1];
      const newLogoHTML = `
      <div class="flex items-center justify-start overflow-hidden w-64 h-24 relative mb-4">
        <img src="${src}" alt="Maxi-Lux Logo" class="absolute w-[200%] h-[200%] object-contain drop-shadow-2xl scale-[1.5] origin-left">
      </div>`;
      
      footerHTML = footerHTML.replace(imgRegex, newLogoHTML);
      
      content = content.replace(footerRegex, footerHTML);
      fs.writeFileSync(filePath, content);
      console.log('Tweaked footer logo in ' + filePath);
    }
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  processFile(file);
});
