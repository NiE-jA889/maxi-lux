const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function generateRandomStripes() {
  const numStripes = Math.floor(Math.random() * 5) + 6; // 6 to 10 stripes
  let html = '';
  
  for(let i = 0; i < numStripes; i++) {
    const isHorizontalLike = Math.random() > 0.5;
    const rotate = Math.floor(Math.random() * 120) - 60; // -60 to 60 deg
    const top = Math.floor(Math.random() * 120) - 10; // -10% to 110%
    const left = Math.floor(Math.random() * 40) - 20; // -20% to 20%
    const height = Math.floor(Math.random() * 4) + 1; // 1px to 4px
    const opacity = (Math.floor(Math.random() * 20) + 5) / 100; // 0.05 to 0.25
    
    // Choose between solid blue or gradient
    const useGradient = Math.random() > 0.3;
    let bgStyle = '';
    if (useGradient) {
      bgStyle = `background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 1), transparent);`;
    } else {
      bgStyle = `background-color: rgba(37, 99, 235, 1);`;
    }

    const style = `top: ${top}%; left: ${left}%; width: 140vw; height: ${height}px; transform: rotate(${rotate}deg); opacity: ${opacity}; ${bgStyle}`;
    
    html += `  <div class="absolute origin-center" style="${style}"></div>\n`;
  }
  
  return `<div class="fixed inset-0 z-0 pointer-events-none overflow-hidden aesthetic-stripes" aria-hidden="true">\n${html}</div>`;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const $ = cheerio.load(content);
  
  // Remove old injected stripes
  if ($('.aesthetic-stripes').length > 0) {
    $('.aesthetic-stripes').remove();
    changed = true;
  }

  // Ensure body has bg-ink
  if (!$('body').hasClass('bg-ink')) {
    $('body').addClass('bg-ink');
    $('body').addClass('text-bone');
    changed = true;
  }

  // Inject the global stripes
  if ($('.aesthetic-stripes').length === 0) {
    $('body').prepend(generateRandomStripes());
    changed = true;
  }

  // Fix sections
  $('section').each((i, el) => {
    const $sec = $(el);
    if (!$sec.hasClass('relative')) $sec.addClass('relative');
    if (!$sec.hasClass('z-10')) $sec.addClass('z-10');
    
    // Remove solid bg-ink from sections to reveal the body background
    if ($sec.hasClass('bg-ink')) {
      $sec.removeClass('bg-ink');
      changed = true;
    }
  });

  // Make inner bg-coal divs frosted glass
  $('.bg-coal').each((i, el) => {
    const $el = $(el);
    // Don't apply frosted glass to the mobile menu to keep it legible
    if ($el.attr('id') === 'mobile-menu') return;
    
    $el.removeClass('bg-coal');
    $el.addClass('bg-black/30');
    $el.addClass('backdrop-blur-md');
    $el.addClass('border');
    $el.addClass('border-white/10');
    changed = true;
  });

  // Make the hero section inner box look nice
  // Some places might have had bg-ink which are now transparent.
  // The header should stay solid or frosted.
  $('header').each((i, el) => {
    const $h = $(el);
    if ($h.hasClass('bg-ink/95')) {
      // it already has backdrop blur, it's fine
    }
  });

  // Footer should be solid to cover stripes
  $('footer').each((i, el) => {
    const $f = $(el);
    if (!$f.hasClass('relative')) $f.addClass('relative');
    if (!$f.hasClass('z-20')) $f.addClass('z-20');
    if (!$f.hasClass('bg-ink')) $f.addClass('bg-ink'); // Ensure solid
    changed = true;
  });

  if (changed) {
    fs.writeFileSync(filePath, $.html());
    console.log('Applied unique global stripes to ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  processFile(file);
});
