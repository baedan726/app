import { createApp } from 'vue';
import { createPinia } from 'pinia';
import MyPage from './MyPage.vue';

import '@/shared/styles/reset.css';
import './style.css';

createApp(MyPage).use(createPinia()).mount('#app');
