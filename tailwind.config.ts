import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'toss': {
          'blue': '#0064FF',
          'blue-hover': '#0051CC',
          'blue-light': '#E6F2FF',
          'blue-lighter': '#F0F7FF',
          'gray': {
            '900': '#191F28',
            '800': '#252B36',
            '700': '#333D4B',
            '600': '#4E5968',
            '500': '#6B7684',
            '400': '#8B95A1',
            '300': '#B0B8C1',
            '200': '#D1D6DB',
            '100': '#E5E8EB',
            '50': '#F2F4F6',
            '25': '#F9FAFB'
          },
          'red': '#F04452',
          'green': '#00C853',
          'orange': '#FF6B00',
          'yellow': '#FFB800'
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        'toss': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif']
      },
      fontSize: {
        'toss-h1': ['32px', { lineHeight: '42px', letterSpacing: '-0.5px', fontWeight: '700' }],
        'toss-h2': ['26px', { lineHeight: '36px', letterSpacing: '-0.3px', fontWeight: '600' }],
        'toss-h3': ['22px', { lineHeight: '30px', letterSpacing: '-0.2px', fontWeight: '600' }],
        'toss-body': ['17px', { lineHeight: '26px', fontWeight: '400' }],
        'toss-body-sm': ['15px', { lineHeight: '22px', fontWeight: '400' }],
        'toss-caption': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'toss-micro': ['12px', { lineHeight: '16px', fontWeight: '400' }]
      },
      spacing: {
        'toss-xs': '4px',
        'toss-sm': '8px',
        'toss-md': '16px',
        'toss-lg': '24px',
        'toss-xl': '32px',
        'toss-2xl': '48px'
      },
      borderRadius: {
        'toss-sm': '8px',
        'toss-md': '12px',
        'toss-lg': '16px',
        'toss-xl': '20px',
        'toss-2xl': '24px',
        'toss-full': '100px',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'toss-sm': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'toss-md': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'toss-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'toss-xl': '0 8px 24px rgba(0, 0, 0, 0.16)',
        'toss-focus': '0 0 0 4px #E6F2FF'
      },
      animation: {
        'toss-spring': 'spring 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'toss-slide-up': 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'toss-slide-down': 'slideDown 0.3s ease-out',
        'toss-fade-in': 'fadeIn 0.6s ease-out',
        'toss-scale-in': 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'toss-shimmer': 'shimmer 1.5s infinite',
        'toss-pulse': 'pulse 2s infinite',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        spring: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config