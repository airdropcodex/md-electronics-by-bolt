/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // MD Electronics Brand Colors
        'westar': '#E6E5E2',
        'cod-gray': '#151414',
        'clay-creek': '#968C67',
        'sandstone': '#76685F',
        
        // Brand color aliases for semantic usage
        'brand': {
          'background': '#E6E5E2',    // Westar
          'primary': '#151414',       // Cod Gray
          'accent': '#968C67',        // Clay Creek
          'secondary': '#76685F',     // Sandstone
        }
      },
      fontFamily: {
        'pacifico': ['Pacifico', 'cursive'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};