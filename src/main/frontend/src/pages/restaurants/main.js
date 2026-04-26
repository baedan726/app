import { createApp } from 'vue';
import { createPinia } from 'pinia';
import RestaurantsPage from './RestaurantsPage.vue';

import '@/shared/styles/reset.css';
import './style.css';

createApp(RestaurantsPage).use(createPinia()).mount('#app');
