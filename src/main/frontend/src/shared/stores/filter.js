/**
 * shared/stores/filter.js — 필터(상황 태그 + 검색어) 스토어
 *
 * 기존 버전 대비 변경
 * - sessionStorage 자동 영속화 (페이지 새로고침/이동 후에도 유지)
 * - 직렬화/역직렬화 안전 처리
 *
 * MPA 구조에서는 페이지가 바뀌면 Pinia 인스턴스 자체가 새로 생성된다.
 * 즉 store는 페이지 간 자동 공유되지 않는다.
 * 그래서 sessionStorage에 백업해두고, 다음 페이지에서 init 시점에 복구한다.
 *
 * sessionStorage 선택 이유
 * - 탭 닫으면 사라짐 (사용자 의도와 일치)
 * - localStorage 대비 보안 위험 ↓ (다른 탭과 격리)
 * - 도메인 전체에서 공유되므로 페이지 간 호환
 */
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

const STORAGE_KEY = 'pickeat:filter';

// ----- sessionStorage 헬퍼 -----
function readState() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.warn('[filter store] storage read failed', e);
        return null;
    }
}

function writeState(state) {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn('[filter store] storage write failed', e);
    }
}

export const useFilterStore = defineStore('filter', () => {
    // ----- 초기값 (sessionStorage 우선, 없으면 빈 값) -----
    const restored = readState();

    const selectedSituations = ref(restored?.selectedSituations || []);
    const keyword = ref(restored?.keyword || '');

    // ----- 자동 영속화 -----
    // ref가 변경될 때마다 sessionStorage에 동기화. deep watch로 배열 내부 변경도 감지.
    watch(
        [selectedSituations, keyword],
        () => {
            writeState({
                selectedSituations: selectedSituations.value,
                keyword: keyword.value
            });
        },
        { deep: true }
    );

    // ----- computed -----
    const isFiltered = computed(() =>
        selectedSituations.value.length > 0 || keyword.value.trim() !== ''
    );

    // ----- actions -----
    function toggleSituation(code) {
        const idx = selectedSituations.value.indexOf(code);
        if (idx === -1) selectedSituations.value.push(code);
        else selectedSituations.value.splice(idx, 1);
    }

    function setKeyword(value) {
        keyword.value = value;
    }

    function reset() {
        selectedSituations.value = [];
        keyword.value = '';
    }

    function clearStorage() {
        sessionStorage.removeItem(STORAGE_KEY);
        reset();
    }

    return {
        selectedSituations, keyword, isFiltered,
        toggleSituation, setKeyword, reset, clearStorage
    };
});
