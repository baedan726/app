/**
 * shared/composables/useUrlQuery.js — URL 쿼리 파라미터 읽기/쓰기 헬퍼
 *
 * MPA에서는 페이지 간 데이터 전달의 주요 수단이 URL 쿼리 (?q=치킨&category=...).
 * RestaurantsPage가 이미 이 패턴을 쓰고 있는데, 표준화해두면 검색·필터 처리가 단순해진다.
 *
 * 사용 예
 *   const { get, set, remove, all } = useUrlQuery();
 *   const category = get('category', '');     // 없으면 빈 문자열
 *   set('category', 'KOREAN');                // ?category=KOREAN 으로 갱신 (페이지 새로고침 없음)
 *   set('q', '치킨', { replace: false });      // 히스토리에 누적 (기본은 replace)
 */
export function useUrlQuery() {
    function _params() {
        return new URLSearchParams(location.search);
    }

    /** 쿼리 파라미터 읽기 */
    function get(key, defaultValue = '') {
        const v = _params().get(key);
        return v === null ? defaultValue : v;
    }

    /** 쿼리 파라미터 쓰기 (URL 갱신, 페이지 새로고침 없음) */
    function set(key, value, { replace = true } = {}) {
        const p = _params();
        if (value === null || value === undefined || value === '') {
            p.delete(key);
        } else {
            p.set(key, value);
        }
        const newUrl = location.pathname + (p.toString() ? '?' + p.toString() : '');
        if (replace) history.replaceState(null, '', newUrl);
        else         history.pushState(null, '', newUrl);
    }

    /** 여러 파라미터 한 번에 설정 */
    function setMany(obj, opts) {
        const p = _params();
        Object.entries(obj).forEach(([k, v]) => {
            if (v === null || v === undefined || v === '') p.delete(k);
            else p.set(k, v);
        });
        const newUrl = location.pathname + (p.toString() ? '?' + p.toString() : '');
        if (opts?.replace !== false) history.replaceState(null, '', newUrl);
        else                          history.pushState(null, '', newUrl);
    }

    function remove(key) { set(key, null); }

    function all() {
        const result = {};
        _params().forEach((v, k) => { result[k] = v; });
        return result;
    }

    return { get, set, setMany, remove, all };
}
