import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                },
                'construction-primary': 'oklch(var(--construction-primary))',
                'construction-accent': 'oklch(var(--construction-accent))',
                'construction-dark': 'oklch(var(--construction-dark))',
                success: {
                    DEFAULT: 'oklch(var(--success) / <alpha-value>)',
                    foreground: 'oklch(var(--success-foreground))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
                soft: '0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 4px 16px -4px rgba(0, 0, 0, 0.06)',
                elevated: '0 4px 16px -2px rgba(0, 0, 0, 0.1), 0 8px 32px -4px rgba(0, 0, 0, 0.08)',
                'tool-glass': '0 4px 24px -4px oklch(0.08 0 0 / 0.6)',
                'nexus-glow': '0 0 20px -4px oklch(0.45 0.12 245 / 0.4)',
                'anomaly-glow': '0 0 20px -4px oklch(0.55 0.22 25 / 0.4)',
                "'anomaly-pulse'": '0 0 20px -4px oklch(0.55 0.22 25 / 0.6)',
                "'worker-active'": '0 0 16px -4px oklch(0.68 0.18 245 / 0.5)',
                "ai-input-focus": '0 0 0 3px rgba(230, 126, 34, 0.3)',
                "ifc-upload": '0 8px 32px rgba(30, 58, 95, 0.2)',
                "pdf-export": '0 4px 16px rgba(230, 126, 34, 0.25)',
                "three-viewer": '0 12px 48px rgba(0, 0, 0, 0.4)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'slide-in': {
                    from: { opacity: '0', transform: 'translateX(-20px)' },
                    to: { opacity: '1', transform: 'translateX(0)' }
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 oklch(0.45 0.12 245 / 0.4)' },
                    '50%': { opacity: '0.85', boxShadow: '0 0 12px 4px oklch(0.45 0.12 245 / 0.2)' }
                },
                'slide-result': {
                    from: { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
                    to: { opacity: '1', transform: 'translateY(0) scale(1)' }
                },
                'stagger-card': {
                    from: { opacity: '0', transform: 'translateY(16px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'honeycomb-pulse': {
                    '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
                    '50%': { opacity: '1', transform: 'scale(1.05)' }
                },
                "'insight-stagger'": '{ 0% { opacity: 0; transform: translateX(-12px) }, 100% { opacity: 1; transform: translateX(0) } }',
                "'pipeline-pulse'": '{ 0%, 100% { opacity: 0.4 }, 50% { opacity: 1 } }',
                "ifc-parse-progress": { '0%': { width: '0%' }, '100%': { width: '100%' } },
                "pdf-export-success": { '0%': { transform: 'scale(0.8)', opacity: '0' }, '100%': { transform: 'scale(1.0)', opacity: '1' } },
                "three-orbit-spin": { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
                "upload-drag-pulse": { '0%, 100%': { transform: 'scale(1.0)' }, '50%': { transform: 'scale(1.02)' } },
                "recording-pulse": { '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 oklch(0.7 0.22 42 / 0.4)' }, '50%': { opacity: '0.7', boxShadow: '0 0 8px 4px oklch(0.7 0.22 42 / 0.2)' } },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.6s ease-out',
                'slide-in': 'slide-in 0.5s ease-out',
                'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
                'slide-result': 'slide-result 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                'stagger-card': 'stagger-card 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                'honeycomb-pulse': 'honeycomb-pulse 2s ease-in-out infinite',
                "'insight-stagger'": 'insight-stagger 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                "'pipeline-pulse'": 'pipeline-pulse 1.5s ease-in-out infinite',
                "ifc-parse-progress": 'ifc-parse-progress 2s ease-in-out infinite',
                "pdf-export-success": 'pdf-export-success 0.6s ease-out',
                "three-orbit-spin": 'three-orbit-spin 20s linear infinite',
                "upload-drag-pulse": 'upload-drag-pulse 1.5s ease-in-out infinite',
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem'
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};

