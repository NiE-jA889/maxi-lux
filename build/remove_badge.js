const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Regex to remove the badge container
const badgeRegex = /<!-- Right Side: Badge -->[\s\S]*?<div class="hidden lg:flex relative items-center justify-center mb-8 mr-12 z-20">[\s\S]*?<img src="order\/order\.png"[^>]*>[\s\S]*?<\/div>/;

if (badgeRegex.test(html)) {
  html = html.replace(badgeRegex, '');
  fs.writeFileSync('index.html', html);
  console.log('Badge successfully removed from index.html.');
} else {
  console.log('Could not find the badge in index.html.');
}
