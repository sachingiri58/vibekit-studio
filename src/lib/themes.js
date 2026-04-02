// src/lib/themes.js
// All 6 vibe presets — each defines CSS variables applied to published/preview pages

export const THEMES = {
  pastel: {
    id: 'pastel',
    name: 'Pastel Soft',
    emoji: '🌸',
    desc: 'Warm, rounded & friendly',
    preview: ['#fdf8f3', '#e87b4b', '#fde8dc'],
    vars: {
      '--t-bg': '#fdf8f3',
      '--t-surface': '#ffffff',
      '--t-text': '#2d2418',
      '--t-text2': '#6b5d50',
      '--t-accent': '#e87b4b',
      '--t-accent-light': '#fde8dc',
      '--t-border': '#f0e6d8',
      '--t-radius': '14px',
      '--t-radius-pill': '999px',
      '--t-font': "'Nunito', sans-serif",
      '--t-font-display': "'Lora', serif",
      '--t-btn-bg': '#e87b4b',
      '--t-btn-text': '#ffffff',
      '--t-btn-radius': '12px',
      '--t-hero-bg': 'linear-gradient(135deg,#fdf8f3 0%,#fef4ee 100%)',
      '--t-shadow': '0 4px 20px rgba(45,36,24,0.08)',
    }
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Editorial',
    emoji: '📰',
    desc: 'Clean, serif & spacious',
    preview: ['#f9f7f4', '#1a1a1a', '#e8e4dc'],
    vars: {
      '--t-bg': '#f9f7f4',
      '--t-surface': '#ffffff',
      '--t-text': '#1a1a1a',
      '--t-text2': '#555555',
      '--t-accent': '#1a1a1a',
      '--t-accent-light': '#f0ede8',
      '--t-border': '#e8e4dc',
      '--t-radius': '4px',
      '--t-radius-pill': '4px',
      '--t-font': "'DM Sans', 'Helvetica Neue', sans-serif",
      '--t-font-display': "'Playfair Display', serif",
      '--t-btn-bg': '#1a1a1a',
      '--t-btn-text': '#ffffff',
      '--t-btn-radius': '4px',
      '--t-hero-bg': '#f9f7f4',
      '--t-shadow': '0 1px 4px rgba(0,0,0,0.08)',
    }
  },
  neobrutalist: {
    id: 'neobrutalist',
    name: 'Neo-Brutal',
    emoji: '⚡',
    desc: 'Bold, raw & loud',
    preview: ['#f5f0e8', '#ff3e00', '#ffe600'],
    vars: {
      '--t-bg': '#f5f0e8',
      '--t-surface': '#ffe600',
      '--t-text': '#1a1a1a',
      '--t-text2': '#333333',
      '--t-accent': '#ff3e00',
      '--t-accent-light': '#ffe600',
      '--t-border': '#1a1a1a',
      '--t-radius': '0px',
      '--t-radius-pill': '0px',
      '--t-font': "'Space Mono', monospace",
      '--t-font-display': "'Syne', sans-serif",
      '--t-btn-bg': '#ff3e00',
      '--t-btn-text': '#ffffff',
      '--t-btn-radius': '0px',
      '--t-hero-bg': '#f5f0e8',
      '--t-shadow': '4px 4px 0 #1a1a1a',
    }
  },
  darkneon: {
    id: 'darkneon',
    name: 'Dark / Neon',
    emoji: '🌃',
    desc: 'Electric, dark & glowing',
    preview: ['#0a0a18', '#00ff88', '#7928ca'],
    vars: {
      '--t-bg': '#0a0a18',
      '--t-surface': '#12122a',
      '--t-text': '#e8e8ff',
      '--t-text2': '#9999bb',
      '--t-accent': '#00ff88',
      '--t-accent-light': '#00ff8820',
      '--t-border': '#ffffff15',
      '--t-radius': '10px',
      '--t-radius-pill': '999px',
      '--t-font': "'Inter', 'DM Sans', sans-serif",
      '--t-font-display': "'Space Grotesk', sans-serif",
      '--t-btn-bg': '#00ff88',
      '--t-btn-text': '#0a0a18',
      '--t-btn-radius': '8px',
      '--t-hero-bg': 'radial-gradient(ellipse at top left, #1a0a3a 0%, #0a0a18 60%)',
      '--t-shadow': '0 0 30px rgba(0,255,136,0.15)',
    }
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury / Serif',
    emoji: '✨',
    desc: 'Gold, refined & premium',
    preview: ['#0a0804', '#c8aa64', '#e8dcc8'],
    vars: {
      '--t-bg': '#0a0804',
      '--t-surface': '#141008',
      '--t-text': '#e8dcc8',
      '--t-text2': '#a89070',
      '--t-accent': '#c8aa64',
      '--t-accent-light': '#c8aa6420',
      '--t-border': '#c8aa6425',
      '--t-radius': '2px',
      '--t-radius-pill': '2px',
      '--t-font': "'Cormorant Garamond', serif",
      '--t-font-display': "'Cormorant Garamond', serif",
      '--t-btn-bg': 'transparent',
      '--t-btn-text': '#c8aa64',
      '--t-btn-radius': '0px',
      '--t-hero-bg': 'linear-gradient(160deg,#120c04 0%,#0a0804 100%)',
      '--t-shadow': '0 4px 24px rgba(0,0,0,0.5)',
    }
  },
  retro: {
    id: 'retro',
    name: 'Retro / Pixel',
    emoji: '🕹️',
    desc: '8-bit, fun & nostalgic',
    preview: ['#fffbe6', '#2563eb', '#f59e0b'],
    vars: {
      '--t-bg': '#fffbe6',
      '--t-surface': '#ffffff',
      '--t-text': '#1e3a8a',
      '--t-text2': '#3b5fc0',
      '--t-accent': '#f59e0b',
      '--t-accent-light': '#fef3c7',
      '--t-border': '#1e3a8a',
      '--t-radius': '0px',
      '--t-radius-pill': '0px',
      '--t-font': "'Press Start 2P', 'Courier New', monospace",
      '--t-font-display': "'Press Start 2P', monospace",
      '--t-btn-bg': '#f59e0b',
      '--t-btn-text': '#1e3a8a',
      '--t-btn-radius': '0px',
      '--t-hero-bg': '#fffbe6',
      '--t-shadow': '3px 3px 0 #1e3a8a',
    }
  }
}

export function getTheme(id) {
  return THEMES[id] || THEMES.pastel
}

export function applyTheme(id, element) {
  const theme = getTheme(id)
  Object.entries(theme.vars).forEach(([key, val]) => {
    element.style.setProperty(key, val)
  })
}

export function getThemeVarsString(id) {
  const theme = getTheme(id)
  return Object.entries(theme.vars).map(([k, v]) => `${k}: ${v};`).join(' ')
}
