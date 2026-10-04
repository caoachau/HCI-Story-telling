import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': resolve(projectDir, '.') } },
  build: {
    rollupOptions: {
      input: {
        main: resolve(projectDir, 'index.html'),
        conChim: resolve(projectDir, 'con-chim.html'),
        aoBaOm: resolve(projectDir, 'ao-ba-om.html'),
        baoTangKhmer: resolve(projectDir, 'bao-tang-khmer.html'),
      },
    },
  },
});
