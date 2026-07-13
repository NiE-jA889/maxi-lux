const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find the CSS badge
const startMarker = '<!-- 23 Years Badge -->';
const endMarker = '</div>\n    </div>\n  </div>\n</section>';

const startIndex = html.indexOf(startMarker);
if (startIndex !== -1) {
  const before = html.substring(0, startIndex);
  // Find the end marker
  const endIndex = html.indexOf(endMarker, startIndex);
  if (endIndex !== -1) {
    const after = html.substring(endIndex);
    
    const newBadge = `<!-- 23 Years Badge -->
    <div class="hidden lg:flex relative items-center justify-center mb-8 mr-12 z-20">
      <img src="order/order.png" alt="23 lata na rynku" class="w-48 h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500">
    </div>
`;
    html = before + newBadge + after;
    fs.writeFileSync('index.html', html);
    console.log('Replaced CSS badge with order/order.png');
  } else {
    console.log('Could not find end marker for badge');
  }
} else {
  console.log('Could not find start marker for badge');
}
