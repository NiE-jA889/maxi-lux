const fs = require('fs');
const path = require('path');

function processHtmlFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Force Emergency Bar styling via inline styles
  const emergencyDiv = '<div class="bg-[#0b0f14] border-b border-white/5">';
  if (html.includes(emergencyDiv)) {
    html = html.replace(emergencyDiv, '<div style="background-color: #0b0f14 !important;" class="border-b border-white/5">');
    html = html.replace('<div class="max-w-7xl mx-auto px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-[#f5f2ec]">', '<div class="max-w-7xl mx-auto px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest" style="color: #f5f2ec !important;">');
    html = html.replace('<div class="flex items-center gap-2 text-[#f5f2ec]/70">', '<div class="flex items-center gap-2" style="color: rgba(245, 242, 236, 0.7) !important;">');
    changed = true;
  }

  // 2. Enhance Light Theme Shadow & Border
  if (html.includes('.light-theme .bg-glass {')) {
    const oldStyleBlock = `.light-theme .bg-glass {
    border: 1px solid rgba(0,0,0,0.1) !important;
  }`;
    if (html.includes(oldStyleBlock)) {
      html = html.replace(oldStyleBlock, `.light-theme .bg-glass {
    border: 1px solid rgba(0,0,0,0.15) !important;
    box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.12), 0 0 20px rgba(0, 0, 0, 0.04) !important;
  }`);
      changed = true;
    } else if (html.includes('border: 1px solid rgba(0,0,0,0.1) !important;')) {
      html = html.replace('border: 1px solid rgba(0,0,0,0.1) !important;', 'border: 1px solid rgba(0,0,0,0.15) !important;\n    box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.12), 0 0 20px rgba(0, 0, 0, 0.04) !important;');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log('Processed ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  processHtmlFile(file);
});
