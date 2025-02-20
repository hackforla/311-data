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
        '@data': path.resolve(__dirname, 'data'),
        '@theme': path.resolve(__dirname, 'theme'),
        '@components': path.resolve(__dirname, 'components'),
        '@dashboards': path.resolve(__dirname, 'components/Dashboards'),
        '@hooks': path.resolve(__dirname, 'hooks'),
        '@reducers': path.resolve(__dirname, 'redux/reducers'),
        '@styles': path.resolve(__dirname, 'styles'),
        '@assets': path.resolve(__dirname, 'assets'),
        '@utils': path.resolve(__dirname, 'utils'),
        '@settings': path.resolve(__dirname, 'settings'),
        '@db': path.resolve(__dirname, 'components/db'),
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: 'utils/test-setup.js'
    }
  };
});
