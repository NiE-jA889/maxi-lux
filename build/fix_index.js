const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// The hero section ends with:
//       <div class="mt-16 grid grid-cols-3 gap-6 max-w-xl">
//         ...
//       </div>
//     <div class="mt-12 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-blue/5 h-[400px]">
//       <iframe ...></iframe>
//     </div>
//   </div>
// </div></section>

// 1. Extract the map block
const mapStartString = '<div class="mt-12 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-blue/5 h-[400px]">';
const mapStartIndex = html.indexOf(mapStartString);

let mapHTML = '';
if (mapStartIndex !== -1) {
  const mapEndString = '</iframe>\n    </div>';
  const mapEndIndex = html.indexOf(mapEndString, mapStartIndex);
  if (mapEndIndex !== -1) {
    mapHTML = html.substring(mapStartIndex, mapEndIndex + mapEndString.length);
    // Remove the map block from its current location
    html = html.substring(0, mapStartIndex) + html.substring(mapEndIndex + mapEndString.length);
  }
}

// 2. Insert the map at the end of #kontakt section
if (mapHTML) {
  const kontaktRegex = /(<section id="kontakt"[^>]*>[\s\S]*?)<\/section>/;
  html = html.replace(kontaktRegex, (match, p1) => {
    // p1 contains everything inside the section except the closing tag.
    // However, the section usually has nested divs. 
    // Let's insert the map inside the main container before the section closes.
    // The kontakt section ends with:
    //       </div>
    //     </div>
    //   </div>
    // </section>
    // We can insert the map right before the closing section tag.
    return p1 + '\n<div class="max-w-7xl mx-auto px-6">\n' + mapHTML + '\n</div>\n</section>';
  });
}

// 3. Clean up the Hero section and add the badge
const heroRegex = /(<section class="relative min-h-\[100vh\][^>]*>[\s\S]*?<div class="mt-16 grid grid-cols-3 gap-6 max-w-xl">[\s\S]*?<\/div>)([\s\S]*?)(<\/section>)/;
html = html.replace(heroRegex, (match, beforeBadge, trailingGarbage, closeSection) => {
  // beforeBadge is everything up to the end of the stats grid.
  const badgeHTML = `
    </div> <!-- Close max-w-3xl -->
    <!-- Right Side: Badge -->
    <div class="hidden lg:flex relative items-center justify-center mb-8 mr-12 z-20">
      <img src="order/order.png" alt="" class="w-64 h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500">
    </div>
  </div> <!-- Close max-w-7xl -->
  `;
  return beforeBadge + badgeHTML + closeSection;
});

// Also remove the old CSS badge placeholder if it exists anywhere else
html = html.replace(/<!-- 23 Years Badge -->[\s\S]*?<div class="hidden lg:flex relative items-center justify-center mb-8 mr-12 z-20">[\s\S]*?<\/div>\n/g, '');


fs.writeFileSync('index.html', html);
console.log('Fixed index.html layout.');
