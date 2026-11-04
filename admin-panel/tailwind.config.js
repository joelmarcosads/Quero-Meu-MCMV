/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Identidade visual Market Imobi
        navy: {
          50:  '#eff6ff',
          100: '#dbeafe',
          600: '#1e3a5f',
          700: '#1a3254',
          800: '#152a45',
          900: '#0f1f33',
        },
        brand: {
          blue:   '#1e3a5f', // azul-marinho
          white:  '#ffffff',
          gray:   '#f3f4f6', // cinza claro
          orange: '#f97316', // laranja CTAs
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
