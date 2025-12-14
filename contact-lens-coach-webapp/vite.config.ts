import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // If you deploy on GitHub Pages, set base to '/<REPO_NAME>/'
  // Example: base: '/contact-lens-coach/',
  base: '/',
});
