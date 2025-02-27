import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Shinkai-Anime/', // Замените "Shinkai-Anime" на название вашего репозитория
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
});