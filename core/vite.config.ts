import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/app/index.ts',
      name: 'CoreLib',
      fileName: (format) => `core-lib.${format === 'es' ? 'es.js' : 'umd.js'}`,
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
  },
});