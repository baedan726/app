/**
 * shared/composables/useAuthGuard.js — 페이지 진입 시 인증 체크
 *
 * MPA에서는 Vue Router의 beforeEach 가드를 쓸 수 없다. (Router 자체가 없음)
 * 대신 각 페이지의 main.js나 Page.vue의 onMounted에서 호출.
 *
 * 동작
 * 1. /api/auth/me 호출해서 현재 세션이 유효한지 확인
 * 2. 401 응답이면 http.js 인터셉터가 자동으로 로그인 페이지로 리다이렉트
 * 3. 200이면 사용자 정보 반환
 *
 * 사용 예 (mypage.html 같은 인증 필요 페이지)
 * // src/pages/mypage/main.js
 * import { useAuthGuard } from '@/shared/composables/useAuthGuard';
 *
 * (async () => {
 *     const user = await useAuthGuard();
 *     if (!user) return;  // 인터셉터가 이미 리다이렉트 처리
 *     // ... Vue 앱 마운트
 * })();
 *
 * 주의: 클라이언트 가드는 UX 보조. 진짜 보안은 반드시 서버 API에서 한 번 더 검증.
 */
import http from '@/shared/api/http';
import { config } from '@/shared/config';

let cachedUser = null;

/**
 * @param {Object} options
 * @param {string[]} options.requiredRoles - 필요 권한. 사용자에게 없으면 alert 후 home으로.
 * @param {boolean} options.useCache - 같은 페이지 라이프사이클 내 재호출 시 캐시 사용 (기본 true)
 */
export async function useAuthGuard(options = {}) {
    const { requiredRoles, useCache = true } = options;

    // mock 모드: 가짜 사용자
    if (config.useMock) {
        return {
            uniqId: 'USRTEST',
            userName: '테스트사용자',
            roles: ['USER']
        };
    }

    if (useCache && cachedUser) {
        return verifyRoles(cachedUser, requiredRoles);
    }

    try {
        const user = await http.get('/auth/me');
        cachedUser = user;
        return verifyRoles(user, requiredRoles);
    } catch (err) {
        // 401은 http.js가 이미 리다이렉트 처리. 여기 도달하면 다른 에러.
        return null;
    }
}

function verifyRoles(user, requiredRoles) {
    if (!requiredRoles || requiredRoles.length === 0) return user;

    const hasRole = requiredRoles.some((r) => (user.roles || []).includes(r));
    if (!hasRole) {
        alert('해당 페이지에 대한 접근 권한이 없습니다.');
        location.href = '/index.html';
        return null;
    }
    return user;
}

/** 캐시 강제 무효화 — 로그아웃/권한 변경 후 호출 */
export function invalidateAuthCache() {
    cachedUser = null;
}
