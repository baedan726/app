/**
 * shared/api/recommend.js — 추천/맛집 도메인 API 모듈
 *
 * 기존 버전 대비 변경
 * - USE_MOCK 하드코딩 → config.useMock (.env 기반)
 *   .env.development는 true, .env.production은 false. 운영 배포 시 자동 차단.
 * - mock과 real 호출을 한 번에 보기 좋게 정리
 *
 * 페이지 컴포넌트(.vue)는 axios를 직접 import하지 않고 이 모듈만 사용.
 * → API URL·페이로드 형식이 한 곳에 모이고, mock↔real 전환이 투명.
 */
import http from './http';
import { config } from '@/shared/config';
import {
    mockTodayPicks, mockCategories, mockSituations,
    mockPersonalPicks, mockReviews, mockRestaurants
} from '@/shared/mock/data';

// 짧은 지연으로 실제 네트워크처럼 흉내 (mock 모드 한정)
const fakeDelay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export const recommendApi = {
    async getTodayPicks(params = {}) {
        if (config.useMock) {
            await fakeDelay();
            return mockTodayPicks;
        }
        return http.get('/recommendations/today', { params });
    },

    async getPersonalPicks() {
        if (config.useMock) {
            await fakeDelay(100);
            return mockPersonalPicks;
        }
        return http.get('/recommendations/personal');
    },

    async getCategories() {
        if (config.useMock) return mockCategories;
        return http.get('/categories');
    },

    async getSituations() {
        if (config.useMock) return mockSituations;
        return http.get('/situations');
    },

    async getRecentReviews({ limit = 3 } = {}) {
        if (config.useMock) {
            await fakeDelay(120);
            return mockReviews.slice(0, limit);
        }
        return http.get('/reviews/recent', { params: { limit } });
    },

    async getRestaurants(params = {}) {
        if (config.useMock) {
            await fakeDelay();
            // mock에서도 카테고리 필터 흉내
            if (params.category) {
                return mockRestaurants.filter((r) => r.category === params.category);
            }
            return mockRestaurants;
        }
        return http.get('/restaurants', { params });
    },

    async toggleLike(restaurantId, liked) {
        if (config.useMock) {
            await fakeDelay(60);
            return { ok: true };
        }
        return http.post(`/restaurants/${restaurantId}/like`, { liked });
    }
};
