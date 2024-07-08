/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        mxxl: { 'max': '1535px' },
        // => @media (max-width: 1535px) { ... }
        mxl: { 'max': '1279px' },
        // => @media (max-width: 1279px) { ... }
        mlg: { 'max': '1023px' },
        // => @media (max-width: 1023px) { ... }
        mmd: { 'max': '767px' },
        // => @media (max-width: 767px) { ... }
        msm: { 'max': '639px' },
        // => @media (max-width: 639px) { ... }
        mss: { 'max': '550px' },
        // => @media (max-width: 550px) { ... }
        mxs: { 'max': "480px" }
        // => @media (max-width: 480px) { ... }
      },
      
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"],
  },
};
