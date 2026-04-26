/**
 * shared/api/http.js — axios 공통 인스턴스 (production-ready)
 *
 * 기존 버전 대비 추가
 * - CSRF 토큰 자동 헤더 주입 (eGov Spring Security 호환)
 * - 401 → 로그인 페이지 리다이렉트 (현재 URL을 redirect 쿼리로 보존)
 * - 403 → 권한 없음 안내
 * - 5xx → 표준 안내 메시지
 * - ResultVO 표준 응답 unwrap 헬퍼 (resultCode '00' 검증)
 * - 요청 ID 자동 생성 (운영 트래킹·문의 대응)
 *
 * 페이지 컴포넌트는 이 파일을 직접 import하지 말고,
 * api/recommend.js, api/sample.js 같은 도메인별 모듈을 통해 사용.
 */
import axios from 'axios';
import { config } from '@/shared/config';

// ----- 인스턴스 -----
const http = axios.create({
    baseURL: config.apiBase,
    timeout: 15000,
    withCredentials: true,                    // 세션 쿠키 동반
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json'
    }
});

// ----- CSRF 토큰 추출 -----
function getCsrfToken() {
    // 1) 메타태그 (서버 렌더링 시 주입한 경우)
    const meta = document.querySelector('meta[name="_csrf"]');
    if (meta) return meta.getAttribute('content');

    // 2) 쿠키 (Spring Security CookieCsrfTokenRepository 사용 시)
    const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
}

// ----- 요청 ID 생성 (운영 추적용) -----
function genRequestId() {
    return 'req-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

// ----- 요청 인터셉터 -----
http.interceptors.request.use(
    (cfg) => {
        const method = (cfg.method || 'get').toUpperCase();

        // GET 외에는 CSRF 토큰 주입 (Spring Security 기본정책: GET은 검증 제외)
        if (method !== 'GET') {
            const token = getCsrfToken();
            if (token) cfg.headers[config.csrfHeader] = token;
        }

        // 운영 추적용 헤더
        cfg.headers['X-Request-Id'] = genRequestId();

        return cfg;
    },
    (error) => Promise.reject(error)
);

// ----- 응답 인터셉터 -----
http.interceptors.response.use(
    // 성공: response.data만 반환 (기존 동작 유지)
    (response) => response.data,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // 미인증 — 로그인 페이지로. 현재 URL은 redirect 쿼리로 보존
            const current = encodeURIComponent(location.pathname + location.search);
            alert('로그인이 만료되었습니다. 다시 로그인 해주세요.');
            location.href = `${config.loginUrl}?redirect=${current}`;
            return new Promise(() => {}); // 후속 처리 차단
        }
        if (status === 403) {
            alert('접근 권한이 없습니다.');
        } else if (status === 422 || status === 400) {
            const msg = error.response?.data?.resultMessage
                || error.response?.data?.message
                || '입력값을 확인해 주세요.';
            alert(msg);
        } else if (status >= 500) {
            console.error('[server error]', error.response?.data);
            alert('서버 오류가 발생했습니다. 시스템 관리자에게 문의해 주세요.');
        } else if (!error.response) {
            // 네트워크 단절·타임아웃
            console.warn('[network]', error.message);
        }

        return Promise.reject(error);
    }
);

/**
 * unwrap — eGov ResultVO 표준 응답 처리
 *
 * 백엔드가 { resultCode, resultMessage, result } 포맷으로 응답한다는 가정.
 * resultCode가 '00'이 아니면 alert + reject.
 *
 * 사용 예
 *   const data = await unwrap(http.post('/sample/list', searchVO));
 */
export async function unwrap(promise) {
    const data = await promise;
    if (data && data.resultCode === '00') {
        return data.result;
    }
    const msg = data?.resultMessage || '처리 중 오류가 발생했습니다.';
    alert(msg);
    throw new Error(msg);
}

export default http;
