import { createApp } from 'vue';
import { createPinia } from 'pinia';
import RecommendPage from './RecommendPage.vue';

import '@/shared/styles/reset.css';
import './style.css';

createApp(RecommendPage).use(createPinia()).mount('#app');
