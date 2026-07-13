const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find the marquee section and remove it
const startTag = '<!-- Marquee -->';
const endTag = '</section>';
const startIndex = html.indexOf(startTag);

if (startIndex !== -1) {
  // Find the end of the section
  const sectionEndIndex = html.indexOf(endTag, startIndex) + endTag.length;
  
  // Cut it out
  const before = html.substring(0, startIndex);
  const after = html.substring(sectionEndIndex);
  
  html = before + after;
  fs.writeFileSync('index.html', html);
  console.log('Removed marquee from index.html');
} else {
  console.log('Could not find Marquee section.');
}
