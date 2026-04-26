import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';

/**
 * 멀티페이지(MPA) 빌드 설정
 * - 각 HTML 페이지가 독립된 진입점
 * - 페이지별로 JS / CSS 번들이 분리됨
 * - 페이지 간 공통 코드는 chunks/ 로 자동 분리
 */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // 빌드 출력물의 루트 폴더
    outDir: 'dist',
    // assetsInlineLimit: 0 → 작은 이미지도 별도 파일로 추출 (인라인 X)
    assetsInlineLimit: 0,
    rollupOptions: {
      // ★ 멀티페이지 진입점 등록
      input: {
        home:        resolve(__dirname, 'index.html'),
        recommend:   resolve(__dirname, 'recommend.html'),
        restaurants: resolve(__dirname, 'restaurants.html'),
        reviews:     resolve(__dirname, 'reviews.html'),
        mypage:      resolve(__dirname, 'mypage.html')
      },
      output: {
        // 페이지별 JS 분리: js/home-[hash].js
        entryFileNames: 'js/[name]-[hash].js',
        // 공통 청크: js/chunks/shared-[hash].js
        chunkFileNames: 'js/chunks/[name]-[hash].js',
        // CSS / 이미지 / 폰트 분리
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (name.endsWith('.css')) return 'css/[name]-[hash][extname]';
          if (/\.(png|jpe?g|gif|svg|webp)$/.test(name)) return 'images/[name]-[hash][extname]';
          if (/\.(woff2?|ttf|eot)$/.test(name)) return 'fonts/[name]-[hash][extname]';
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  server: {
    port: 3000,
    open: '/index.html',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
