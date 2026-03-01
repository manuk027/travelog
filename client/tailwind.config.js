/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981', // Emerald — nature green
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                    950: '#022c22',
                },
                accent: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e', // Green accent — lighter green
                    600: '#16a34a',
                    700: '#15803d',
                },
                surface: {
                    50: '#f0fdf4',
                    100: '#f1f8f5',
                    200: '#e2efe8',
                    800: '#1a2e26',
                    900: '#0f1f1a',
                    950: '#071210',
                },
                dark: {
                    bag: '#0a1510',
                    card: '#132218',
                    elevated: '#1a2e22',
                    text: '#ecfdf5',
                    muted: '#86b89a'
                }
            },
            boxShadow: {
                'soft': '0 1px 3px rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.06)',
                'soft-dark': '0 1px 3px rgba(0,0,0,0.2), 0 4px 24px rgba(0,0,0,0.4)',
                'glow': '0 0 20px rgba(16, 185, 129, 0.2)',
                'glow-lg': '0 0 40px rgba(16, 185, 129, 0.25)',
                'card-hover': '0 8px 30px rgba(0,0,0,0.08)',
                'card-hover-dark': '0 8px 30px rgba(0,0,0,0.5)',
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
                logo: ['"DM Serif Display"', 'Georgia', 'serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-pattern': 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)',
                'hero-dark': 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)',
                'mesh-gradient': 'linear-gradient(135deg, #059669 0%, #065f46 50%, #f59e0b 100%)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            }
        },
    },
    plugins: [],
}
