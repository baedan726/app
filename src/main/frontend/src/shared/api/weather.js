import http from './http';
import { mockWeather } from '@/shared/mock/data';

const USE_MOCK = true;

export const weatherApi = {
  async getCurrent({ lat, lng } = {}) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 100));
      return mockWeather;
    }
    return http.get('/weather/current', { params: { lat, lng } });
  }
};
