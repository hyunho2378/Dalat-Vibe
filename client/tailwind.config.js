/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // NUCLEAR RESET - Dalat Vibe color palette
                background: '#FAFAF9',
                primary: '#064E3B',      // FORCED Deep Emerald Green
                accent: '#2C3E50',       // Deep Navy
                foreground: '#2D2D2D',
            },
            fontFamily: {
                // Elegant serif for headings
                tenor: ['"Tenor Sans"', 'sans-serif'],
                // Modern sans for body text
                manrope: ['Manrope', 'sans-serif'],
            },
            aspectRatio: {
                '3/4': '3 / 4',
            },
        },
    },
    plugins: [],
}
