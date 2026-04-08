import { defineConfig } from 'vite';

export default defineConfig({  
  server: {  
    proxy: {  
      '/ingest/static': {  
        target: 'https://eu-assets.i.posthog.com',  
        changeOrigin: true,  
        rewrite: (path) => path.replace(/^\/ingest/, ''), // видаляємо тільки /ingest, залишаємо /static  
      },  
      '/ingest': {  
        target: 'https://eu.i.posthog.com',  
        changeOrigin: true,  
        rewrite: (path) => path.replace(/^\/ingest/, ''),  
      },  
    },  
  },  
});  