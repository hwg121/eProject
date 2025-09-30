import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Debug configuration for troubleshooting
export default defineConfig({
  plugins: [
    react({
      // Basic React plugin without complex options
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true, // Enable source maps for debugging
    minify: false, // Disable minification for easier debugging
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable chunk splitting for simplicity
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 80,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 80,
    strictPort: true,
  },
  // Disable optimizations that might cause issues
  optimizeDeps: {
    disabled: true,
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});
