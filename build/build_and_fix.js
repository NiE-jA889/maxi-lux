const fs = require('fs');
const path = require('path');

function fixMobileMenu(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const oldMenuDef = 'id="mobile-menu" class="hidden lg:hidden bg-coal border-t border-glassBorder absolute left-0 right-0 max-h-[85vh] overflow-y-auto shadow-2xl w-full"';
  const newMenuDef = 'id="mobile-menu" class="hidden lg:hidden bg-coal border-t border-glassBorder absolute top-full left-0 right-0 max-h-[85vh] overflow-y-auto shadow-2xl w-full"';

  if (html.includes(oldMenuDef)) {
    html = html.replace(oldMenuDef, newMenuDef);
    changed = true;
  }

  // Optimize mobile view: Ensure the hero section content fits nicely. Let's make sure the text size is good on mobile.
  // "Zapchane rury?" text is text-6xl md:text-8xl, which is fine on mobile.
  // Let's add pointer-events-none to the hamburger icon so clicks don't miss the button.
  if (html.includes('<button id="mobile-menu-btn"')) {
    html = html.replace('<svg class="w-8 h-8"', '<svg class="w-8 h-8 pointer-events-none"');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log('Fixed mobile menu in ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  fixMobileMenu(file);
});

// Create build directory
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Helper to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    // Ignore build dir itself and .gemini or other unwanted dirs
    if (entry.name === 'build' || entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      // Only copy web assets
      if (srcPath.endsWith('.html') || srcPath.endsWith('.css') || srcPath.endsWith('.js') || srcPath.endsWith('.png') || srcPath.endsWith('.jpg') || srcPath.endsWith('.svg') || srcPath.endsWith('.webp')) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

console.log('Copying files to build directory...');
copyDir(__dirname, buildDir);
console.log('Build complete! Ready for deployment.');
