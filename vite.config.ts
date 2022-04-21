import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr';
import react from 'vite-preset-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()]
})
