import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => {
  return {
    base: '/311-data/',
    build: {
      outDir: 'dist',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@root': __dirname,
        '@src': path.resolve(__dirname, "src/"),
        '@data': path.resolve(__dirname, 'backend/'),
        '@theme': path.resolve(__dirname, 'src/theme'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@dashboards': path.resolve(__dirname, 'src/components/Dashboards'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@reducers': path.resolve(__dirname, 'src/redux/reducers'),
        '@styles': path.resolve(__dirname, 'styles'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@settings': path.resolve(__dirname, 'src/settings'),
        '@db': path.resolve(__dirname, 'backend/'),
        '@routes': path.resolve(__dirname, 'src/routes/')
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: 'utils/test-setup.js'
    }
  };
});
