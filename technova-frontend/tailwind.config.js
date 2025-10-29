/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      colors: {
        primary: {
          900: '#071633',
          600: '#0ea5a4',
        },
        accent: '#7CFFB2',
        muted: '#94a3b8',
        glass: 'rgba(255,255,255,0.04)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        glow: '0 8px 30px rgba(14,165,164,0.12)',
        'glow-lg': '0 20px 50px rgba(14,165,164,0.2)',
      },
      borderRadius: { 
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'network-pulse': 'network-pulse 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 20px rgba(14,165,164,0.4)' },
          '100%': { boxShadow: '0 0 30px rgba(14,165,164,0.8)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(14, 165, 164, 0.4), 0 0 40px rgba(14, 165, 164, 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(14, 165, 164, 0.6), 0 0 60px rgba(14, 165, 164, 0.4)' 
          }
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'network-pulse': {
          '0%, 100%': { 
            opacity: '0.4',
            transform: 'scale(1)' 
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1.05)' 
          }
        }
      }
    }
  },
  plugins: []
}