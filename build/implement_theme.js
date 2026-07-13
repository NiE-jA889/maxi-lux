const fs = require('fs');
const path = require('path');

const oldTailwindConfig = `tailwind.config = {
    theme: {
      extend: {
        colors: {
          ink: '#0b0f14',
          coal: '#111820',
          steel: '#1a2530',
          bone: '#f5f2ec',
          mist: '#e5e0d6',
          blue: '#2563eb',
          blueSoft: '#60a5fa',
          rust: '#c94a15',
        },
        fontFamily: {
          serif: ['"Instrument Serif"', 'serif'],
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
      }
    }
  }`;

const newTailwindConfig = `tailwind.config = {
    theme: {
      extend: {
        colors: {
          ink: 'var(--color-ink)',
          coal: 'var(--color-coal)',
          steel: 'var(--color-steel)',
          bone: 'var(--color-bone)',
          mist: 'var(--color-mist)',
          blue: 'var(--color-blue)',
          blueSoft: 'var(--color-blue-soft)',
          rust: 'var(--color-rust)',
          glass: 'var(--color-glass)',
          glassBorder: 'var(--color-glass-border)',
        },
        fontFamily: {
          serif: ['"Instrument Serif"', 'serif'],
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
      }
    }
  }`;

const themeStyles = `
  :root {
    --color-ink: #0b0f14;
    --color-coal: #111820;
    --color-steel: #1a2530;
    --color-bone: #f5f2ec;
    --color-mist: #e5e0d6;
    --color-glass: rgba(0, 0, 0, 0.3);
    --color-glass-border: rgba(255, 255, 255, 0.1);
    --color-blue: #2563eb;
    --color-blue-soft: #60a5fa;
    --color-rust: #c94a15;
  }
  .light-theme {
    --color-ink: #ffffff;
    --color-coal: #f3f4f6;
    --color-steel: #e5e7eb;
    --color-bone: #111827;
    --color-mist: #374151;
    --color-glass: rgba(255, 255, 255, 0.6);
    --color-glass-border: rgba(0, 0, 0, 0.1);
  }
`;

const themeSwitcherHtml = `
      <!-- Theme Switcher -->
      <div class="flex flex-col items-center justify-center mr-6">
        <div class="flex items-center gap-2 bg-coal/50 backdrop-blur-md rounded-full px-2 py-1 border border-glassBorder mb-1">
          <button id="theme-dark-btn" onclick="setTheme('dark')" class="w-6 h-6 rounded-full bg-blue hover:scale-110 transition-transform shadow-[0_0_10px_rgba(37,99,235,0.5)] border-2 border-white" aria-label="Dark theme"></button>
          <button id="theme-light-btn" onclick="setTheme('light')" class="w-6 h-6 rounded-full bg-white hover:scale-110 transition-transform border border-mist shadow-sm" aria-label="Light theme"></button>
        </div>
        <span class="text-[9px] uppercase tracking-wider text-mist">Zmień motyw</span>
      </div>
`;

const themeScriptHtml = `
<script>
  // Theme Manager
  function setTheme(theme) {
    const isLight = theme === 'light';
    if (isLight) {
      document.body.classList.add('light-theme');
      document.getElementById('theme-light-btn').classList.add('border-2', 'border-blue', 'scale-110');
      document.getElementById('theme-dark-btn').classList.remove('border-2', 'border-white', 'scale-110');
    } else {
      document.body.classList.remove('light-theme');
      document.getElementById('theme-dark-btn').classList.add('border-2', 'border-white', 'scale-110');
      document.getElementById('theme-light-btn').classList.remove('border-2', 'border-blue', 'scale-110');
    }
    localStorage.setItem('maxilux_theme', theme);
  }

  // Initialize theme on load
  document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('maxilux_theme') || 'dark';
    setTheme(savedTheme);
  });
  // Execute immediately to prevent flash of wrong theme
  const initialTheme = localStorage.getItem('maxilux_theme');
  if (initialTheme === 'light') { document.body.classList.add('light-theme'); }
</script>
`;

function processHtmlFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Replace Tailwind config
  if (html.includes(oldTailwindConfig)) {
    html = html.replace(oldTailwindConfig, newTailwindConfig);
    changed = true;
  }

  // 2. Replace hardcoded body style and add CSS variables
  if (html.includes('body { background:#0b0f14; color:#f5f2ec; font-family:Inter,system-ui,sans-serif; }')) {
    html = html.replace(
      'body { background:#0b0f14; color:#f5f2ec; font-family:Inter,system-ui,sans-serif; }',
      'body { background:var(--color-ink); color:var(--color-bone); font-family:Inter,system-ui,sans-serif; transition: background-color 0.4s ease, color 0.4s ease; }\n' + themeStyles
    );
    changed = true;
  } else if (!html.includes('--color-ink')) {
     // Fallback if the body style was already modified somehow, but vars are missing
     html = html.replace('<style>', '<style>\n' + themeStyles);
     changed = true;
  }

  // 3. Inject Theme Switcher in the Header
  // The header has a div with "max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between"
  const headerNavRegex = /(<nav[^>]*>)/i;
  if (!html.includes('id="theme-dark-btn"')) {
    const match = html.match(headerNavRegex);
    if (match) {
      // Inject before the <nav> element
      html = html.replace(match[0], themeSwitcherHtml + match[0]);
      changed = true;
    }
  }

  // 4. Inject Theme Script
  if (!html.includes('function setTheme(theme)')) {
    html = html.replace('</body>', themeScriptHtml + '\n</body>');
    changed = true;
  }

  // 5. Replace hardcoded utility classes with variable-based ones
  // Replace `bg-black/30 backdrop-blur-md` with `bg-glass backdrop-blur-md`
  const oldBgGlass = /bg-black\/30/g;
  if (oldBgGlass.test(html)) {
    html = html.replace(oldBgGlass, 'bg-glass');
    changed = true;
  }

  // Replace `border-white/10` with `border-glassBorder`
  const oldBorder = /border-white\/10/g;
  if (oldBorder.test(html)) {
    html = html.replace(oldBorder, 'border-glassBorder');
    changed = true;
  }

  // Fix blue circles logic (bg-blue/10 or bg-blue/20) - those actually look good on both dark and light!
  // Wait, `text-bone/70` in light mode might be problematic if bone is #111827 (dark). `text-bone/70` will be dark/70, which is fine!
  // Wait, `border-bone/25` -> `border-bone/25`. In light mode, bone is #111827, so it's dark/25. That's good!

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log('Updated ' + filePath);
  }
}

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const uslugiFiles = fs.existsSync('uslugi') ? fs.readdirSync('uslugi').filter(f => f.endsWith('.html')).map(f => path.join('uslugi', f)) : [];

[...rootFiles, ...uslugiFiles].forEach(file => {
  processHtmlFile(file);
});
