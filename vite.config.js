import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles')
    }
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    host: true,
    cors: true
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    minify: 'terser',
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React libraries
          vendor: ['react', 'react-dom'],
          // Firebase chunk for Firebase services
          firebase: [
            'firebase/app', 
            'firebase/firestore', 
            'firebase/auth'
          ]
        },
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    // Build optimizations
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    open: true
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    postcss: './postcss.config.js'
  },
  
  // Optimized dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'firebase/app',
      'firebase/firestore',
      'firebase/auth'
    ]
  },
  
  // Base public path
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  
  // Enable legacy browser support if needed
  // build: {
  //   target: ['es2015', 'chrome63'],
  //   polyfillDynamicImport: false
  // }
})