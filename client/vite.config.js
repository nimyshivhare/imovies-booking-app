import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  define: {
    'process.env': {
      REACT_APP_API_URL: 'http://localhost:5000/api',
      REACT_APP_SOCKET_URL: 'http://localhost:5000',
    },
  },
  server: {
    port: 3000,
    open: false,
    host: true,
  },
});
