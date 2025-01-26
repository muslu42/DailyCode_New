import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';  // Ensure this plugin is installed

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Deduplicate dependencies (e.g., avoid multiple versions of React)
    dedupe: ['react', 'react-dom'],
    
    // Alias configuration (e.g., mapping 'fs' to a mock or polyfill)
alias: {
      fs: 'fs'  // This could be for mocking the 'fs' module (if you're working with Node.js-specific packages in a browser environment)
    },
  },
  optimizeDeps: {
    // Pre-bundle dependencies (e.g., ensure 'lucide-react' is optimized)
    include: ['lucide-react'],
  },
build: {
    rollupOptions: {
      input: 'src/main.tsx', // Ensure Vite knows your entry point
    },
  },
  server: {
    open: true,  // Automatically open the app in the browser
  },
  base:'/'
});