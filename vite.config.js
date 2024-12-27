import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    reactRefresh(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [],
      manifest: {
        name: 'CTPL-Agent',
        short_name: 'CTPL-Agent',
        start_url: '.',
        background_color: '#F4F4F4',
        theme_color: '#E53636',
        display: 'standalone',
        icons: [
          {
            src: '/ctpl_agent_ico_192x192.svg',
            sizes: '192x192',
            type: 'image/svg',
          },
          {
            src: '/ctpl_agent_ico_512x512.svg',
            sizes: '512x512',
            type: 'image/svg',
          },
        ],
      },
    })
  ],
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
