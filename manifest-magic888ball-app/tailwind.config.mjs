/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        // Tailwind's default breakpoints
        sm: '640px',   // Small devices (phones)
        md: '768px',   // Medium devices (tablets)
        lg: '1024px',  // Large devices (laptops)
        xl: '1280px',  // Extra large devices (larger laptops/desktops)
        '2xl': '1536px', // 2x extra large screens
      },
    },
  },
  plugins: [],
};
