/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff8ff',
          100: '#dbeffe',
          200: '#bfe1fd',
          300: '#93cdfb',
          400: '#60b0f8',
          500: '#3b92f3',
          600: '#2574e1',
          700: '#1d5ccf',
          800: '#1e4da8',
          900: '#1e4386',
          950: '#172b57',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scanline: {
          '0%': { top: '-10%' },
          '100%': { top: '110%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        pop: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '60%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.215,0.61,0.355,1) infinite',
        'fade-up': 'fade-up 0.45s ease both',
        'fade-in': 'fade-in 0.35s ease both',
        'slide-in': 'slide-in 0.4s ease both',
        scanline: 'scanline 1.4s ease-in-out infinite alternate',
        blink: 'blink 1.1s ease-in-out infinite',
        'bounce-dot': 'bounceDot 1.2s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        pop: 'pop 0.35s ease both',
      },
      boxShadow: {
        kiosk: '0 12px 40px -12px rgba(13,148,136,0.25), 0 4px 12px -4px rgba(15,23,42,0.08)',
        card: '0 1px 3px rgba(15,23,42,0.06), 0 8px 24px -12px rgba(15,23,42,0.12)',
        'card-lg': '0 4px 6px -2px rgba(15,23,42,0.05), 0 18px 40px -16px rgba(15,23,42,0.18)',
      },
    },
  },
  plugins: [],
};
