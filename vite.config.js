import { defineConfig, loadEnv } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
  build: {
    sourcemap: true,
  },
  plugins: [
    sentryVitePlugin({
      org: 'none-c7h',
      project: 'javascript-vue',
      authToken: env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: ['dist/**'],
        filesToDeleteAfterUpload: ['dist/**/*.map'],
      },
    }),
  ],
  server: {  
    proxy: {  
      '/ingest/static': {  
        target: 'https://eu-assets.i.posthog.com',  
        changeOrigin: true,  
        rewrite: (path) => path.replace(/^\/ingest/, ''),
      },  
      '/ingest': {  
        target: 'https://eu.i.posthog.com',  
        changeOrigin: true,  
        rewrite: (path) => path.replace(/^\/ingest/, ''),  
      },
      '/sentry-tunnel': {
        target: 'https://o4511185606410240.ingest.de.sentry.io',
        changeOrigin: true,
        rewrite: () => '/api/4511185631576144/envelope/',
      },
    },  
  },
  };
});