/**
 * shared/config/index.js — 환경변수 통합 래퍼
 *
 * import.meta.env를 코드 곳곳에서 직접 읽으면 오타·기본값 누락이 산재한다.
 * 한 곳에서 읽고 의미 있는 이름·기본값으로 export.
 */

const env = import.meta.env;

export const config = {
    /** Mock 사용 여부 — true면 모든 API 호출이 가짜 데이터 반환 */
    useMock: env.VITE_USE_MOCK === 'true',

    /** API 베이스 URL */
    apiBase: env.VITE_API_BASE || '/api',

    /** CSRF 토큰 요청 헤더명 */
    csrfHeader: env.VITE_CSRF_HEADER || 'X-XSRF-TOKEN',

    /** 미인증 시 리다이렉트 페이지 */
    loginUrl: env.VITE_LOGIN_URL || '/login.html',

    /** 앱 이름 (디버깅·로깅용) */
    appName: env.VITE_APP_NAME || 'PickEat',

    /** 현재 빌드 환경 */
    buildEnv: env.VITE_BUILD_ENV || env.MODE || 'development',

    /** dev 모드 여부 (Vite 기본 변수) */
    isDev: env.DEV === true,

    /** prod 모드 여부 */
    isProd: env.PROD === true
};

// 부팅 시 한 번 콘솔에 출력 — 환경 혼동 방지
if (config.isDev) {
    console.log('[config]', config);
}
