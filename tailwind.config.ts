import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontSize: {
                'hero': ['clamp(2rem, 8vw, 6rem)', {
                    lineHeight: '0.95',
                    letterSpacing: '-0.02em',
                    fontWeight: '700'
                }],
                'section': ['clamp(1.75rem, 4vw, 3rem)', {
                    lineHeight: '1.1',
                    letterSpacing: '-0.01em',
                    fontWeight: '700'
                }],
                'title': ['clamp(1.25rem, 3vw, 2rem)', {
                    lineHeight: '1.2',
                    letterSpacing: '-0.005em',
                    fontWeight: '600'
                }],
            },
            screens: {
                'xs': '475px',
                '3xl': '1920px',
            },
            colors: {
                'lumina': {
                    'primary': '#8B5CF6',
                    'accent': '#7C3AED',
                    'dark': '#0f0518',
                    'panel': '#1a1625',
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            },
            // ============================================
            // Z-INDEX SYSTEM - Centralized Layer Management
            // ============================================
            // This prevents z-index conflicts across components
            // Layer hierarchy (lowest to highest):
            // - background: -10 (ambient effects, decorations)
            // - base: 0 (default content)
            // - content: 10 (main page content, sections)
            // - elevated: 20 (cards, panels with hover states)
            // - sticky: 30 (sticky elements, floating buttons)
            // - header: 40 (navigation header)
            // - dropdown: 50 (dropdowns, tooltips)
            // - modal-backdrop: 90 (modal overlay)
            // - modal: 100 (modal content)
            // - toast: 110 (notifications, toasts)
            // - max: 9999 (emergency override - use sparingly!)
            zIndex: {
                'background': '-10',
                'behind': '-1',
                'base': '0',
                'content': '10',
                'elevated': '20',
                'sticky': '30',
                'header': '40',
                'dropdown': '50',
                'modal-backdrop': '90',
                'modal': '100',
                'toast': '110',
                'max': '9999',
            },
        },
    },
    plugins: [],
};
export default config;
