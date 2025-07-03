import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // 保持与CRA相同的输出目录
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          recharts: ['recharts'],
          katex: ['katex', 'react-katex'],
          i18n: ['i18next', 'react-i18next']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    open: true, // 启动时自动打开浏览器
    headers: {
      // 在开发环境中设置CSP头部
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
        img-src 'self' data: https:;
        font-src 'self' data: https://cdn.jsdelivr.net;
        connect-src 'self' ws: wss:;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
      `.replace(/\s+/g, ' ').trim()
    }
  },
  define: {
    // 处理环境变量，保持与CRA兼容
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.PUBLIC_URL': JSON.stringify('/'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
}); 