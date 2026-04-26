import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ReviewsPage from './ReviewsPage.vue';

import '@/shared/styles/reset.css';
import './style.css';

createApp(ReviewsPage).use(createPinia()).mount('#app');
