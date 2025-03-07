import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // или '0.0.0.0' для локальной сети
    port: 5173,       // используемый порт
  },
  base: '/Shinkai-Anime/'
});
