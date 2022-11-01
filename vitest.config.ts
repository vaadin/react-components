import react from "@vitejs/plugin-react";
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    target: 'esnext',
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});
