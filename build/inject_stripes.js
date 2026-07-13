const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const stripesHtml = `
<div class="absolute inset-0 pointer-events-none overflow-hidden z-0 aesthetic-stripes" aria-hidden="true">
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[3000px] h-[1px] bg-blue/20 -rotate-45 mt-[10%]"></div>
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[3000px] h-[4px] bg-blue/5 -rotate-45 mt-[15%]"></div>
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[3000px] h-[1px] bg-gradient-to-r from-transparent via-blue/30 to-transparent -rotate-45 mt-[30%]"></div>
  
  <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[3000px] h-[2px] bg-blue/15 rotate-[30deg] mb-[10%]"></div>
  <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[3000px] h-[1px] bg-blue/25 rotate-[30deg] mb-[20%]"></div>
  <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[3000px] h-[6px] bg-blue/5 rotate-[30deg] mb-[30%]"></div>
  
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3000px] h-[1px] bg-gradient-to-r from-transparent via-blue/40 to-transparent rotate-[15deg]"></div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3000px] h-[1px] bg-gradient-to-r from-transparent via-blue/40 to-transparent -rotate-[15deg]"></div>
</div>
`;

function injectStripes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const $ = cheerio.load(content);
  
  // Find all sections with bg-ink
  $('section').each((i, el) => {
    const $sec = $(el);
    const classes = $sec.attr('class') || '';
    
    // Check if it has bg-ink and is relative
    if (classes.includes('bg-ink')) {
      if (!classes.includes('relative')) {
        $sec.addClass('relative');
      }
      if (!classes.includes('overflow-hidden')) {
        $sec.addClass('overflow-hidden');
      }

      // If stripes not already there
      if ($sec.find('.aesthetic-stripes').length === 0) {
        // Prepend stripes
        $sec.prepend(stripesHtml);
        
        // Ensure other children have relative z-10
        $sec.children().each((j, child) => {
          const $child = $(child);
          if (!$child.hasClass('aesthetic-stripes') && $child.prop('tagName').toLowerCase() === 'div') {
            if (!$child.hasClass('relative')) $child.addClass('relative');
            if (!$child.hasClass('z-10') && !$child.hasClass('z-20')) $child.addClass('z-10');
          }
        });
        
        changed = true;
      }
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, $.html());
    console.log('Injected stripes into ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  injectStripes(file);
});
