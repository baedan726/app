/**
 * 홈 페이지 진입점
 *
 * Vite 빌드 시 이 파일이 home.js (또는 home-[hash].js)로 번들링됨
 * 이 파일에서 import하는 모든 .vue / .css가 home 페이지 번들에 포함
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import HomePage from './HomePage.vue';

// 공통 스타일 (모든 페이지가 import)
import '@/shared/styles/reset.css';

// 페이지 전용 스타일 (이 페이지만 사용)
import './style.css';

const app = createApp(HomePage);
app.use(createPinia());
app.mount('#app');
