import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    target: 'esnext',
  },
  plugins: [react()],
  test: {
    globals: true,
    deps: {
      inline: ['highcharts'],
      registerNodeLoader: true,
    },
    environment: 'happy-dom',
  },
});
