/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Dark Premium Theme ──────────────────────────────────────────
        bg: {
          base:    '#071426',
          surface: '#10223B',
          raised:  '#142B48',
          hover:   '#1a3457',
        },
        neon: {
          cyan:   '#00E5FF',
          orange: '#FF7A18',
          green:  '#00F5A0',
          red:    '#FF4D6D',
        },
        ink: {
          primary:   '#F1F5F9',
          secondary: '#94A3B8',
          muted:     '#64748B',
          disabled:  '#334155',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          dim:    'rgba(255,255,255,0.10)',
          glow:   'rgba(0,229,255,0.20)',
        },
        // Legacy (mantém compatibilidade)
        navy: {
          50:  '#eff6ff',
          100: '#dbeafe',
          600: '#1e3a5f',
          700: '#1a3254',
          800: '#152a45',
          900: '#0f1f33',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan':   '0 0 16px rgba(0,229,255,0.25)',
        'glow-orange': '0 0 16px rgba(255,122,24,0.30)',
        'card':        '0 4px 24px rgba(0,0,0,0.40)',
        'card-hover':  '0 8px 32px rgba(0,0,0,0.50)',
      },
      backgroundImage: {
        'gradient-brand':  'linear-gradient(135deg, #00E5FF 0%, #0077FF 100%)',
        'gradient-orange': 'linear-gradient(135deg, #FF7A18 0%, #FF4D6D 100%)',
        'gradient-dark':   'linear-gradient(180deg, #10223B 0%, #071426 100%)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'pulse-glow': { '0%,100%': { boxShadow: '0 0 8px rgba(0,229,255,0.3)' }, '50%': { boxShadow: '0 0 20px rgba(0,229,255,0.6)' } },
      },
      animation: {
        'fade-in':    'fade-in 0.25s ease-out both',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
