import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    // vcg-aws deploys this folder (and CI uploads it), as with CRA before.
    outDir: 'build',
  },
  test: {
    environment: 'node',
  },
});
