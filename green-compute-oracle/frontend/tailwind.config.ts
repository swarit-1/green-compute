import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Premium green palette
                emerald: {
                    50: "#ecfdf5",
                    100: "#d1fae5",
                    200: "#a7f3d0",
                    300: "#6ee7b7",
                    400: "#34d399",
                    500: "#10b981",
                    600: "#059669",
                    700: "#047857",
                    800: "#065f46",
                    900: "#064e3b",
                    950: "#022c22",
                },
                // Dark background palette
                dark: {
                    50: "#f8fafc",
                    100: "#f1f5f9",
                    200: "#e2e8f0",
                    300: "#cbd5e1",
                    400: "#94a3b8",
                    500: "#64748b",
                    600: "#475569",
                    700: "#334155",
                    800: "#1e293b",
                    900: "#0f172a",
                    950: "#020617",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            spacing: {
                18: "4.5rem",
                88: "22rem",
                128: "32rem",
            },
            boxShadow: {
                glow: "0 0 20px rgba(16, 185, 129, 0.5)",
                "glow-lg": "0 0 40px rgba(16, 185, 129, 0.6)",
                "glow-emerald": "0 0 30px rgba(52, 211, 153, 0.5)",
                glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                premium: "0 20px 60px rgba(0, 0, 0, 0.6)",
            },
            backdropBlur: {
                xs: "2px",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "gradient-mesh": "linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-up": "slideUp 0.4s ease-out",
                "glow-pulse": "glowPulse 2s ease-in-out infinite",
                "float": "float 20s ease-in-out infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideUp: {
                    "0%": { transform: "translateY(100%)" },
                    "100%": { transform: "translateY(0)" },
                },
                glowPulse: {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" },
                    "50%": { boxShadow: "0 0 40px rgba(16, 185, 129, 0.8)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-20px)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
