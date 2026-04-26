/**
 * shared/composables/useApi.js — 비동기 API 호출 상태 표준화
 *
 * 모든 페이지에서 공통적으로 필요한 패턴:
 *   "API 호출 중에는 로딩 표시, 실패하면 에러 메시지, 성공하면 데이터 바인딩"
 *
 * 이 컴포저블이 그 패턴을 캡슐화해서 페이지마다 똑같은 코드를 반복하지 않게 한다.
 *
 * 사용 예
 * <script setup>
 *   import { useApi } from '@/shared/composables/useApi';
 *   import { recommendApi } from '@/shared/api/recommend';
 *
 *   const { data, loading, error, execute } = useApi(
 *       () => recommendApi.getRestaurants({ category: 'KOREAN' }),
 *       { immediate: true, defaultValue: [] }
 *   );
 * </script>
 *
 * <template>
 *   <div v-if="loading">로딩중...</div>
 *   <div v-else-if="error">{{ error.message }}</div>
 *   <div v-else>
 *     <RecommendCard v-for="r in data" :key="r.id" :item="r" />
 *   </div>
 * </template>
 */
import { ref, onMounted } from 'vue';

/**
 * @param {Function} apiFn - 호출할 API 함수 (async, Promise 반환)
 * @param {Object} options
 * @param {boolean} options.immediate - 마운트 시 자동 호출 여부 (기본 true)
 * @param {*} options.defaultValue - data의 초기값
 * @param {Function} options.onSuccess - 성공 콜백 (data) => void
 * @param {Function} options.onError - 에러 콜백 (error) => void
 */
export function useApi(apiFn, options = {}) {
    const {
        immediate = true,
        defaultValue = null,
        onSuccess,
        onError
    } = options;

    const data = ref(defaultValue);
    const loading = ref(false);
    const error = ref(null);

    /**
     * API 호출 실행. 인자는 apiFn에 그대로 전달.
     * 이미 진행 중이면 중복 호출 방지.
     */
    async function execute(...args) {
        if (loading.value) return data.value;

        loading.value = true;
        error.value = null;
        try {
            const result = await apiFn(...args);
            data.value = result;
            if (onSuccess) onSuccess(result);
            return result;
        } catch (err) {
            error.value = err;
            if (onError) onError(err);
            // http.js 인터셉터가 이미 alert로 사용자 알림은 처리.
            // 여기서는 컴포넌트에서 추가 분기 가능하도록 ref만 갱신.
            console.error('[useApi]', err);
            return undefined;
        } finally {
            loading.value = false;
        }
    }

    if (immediate) {
        onMounted(execute);
    }

    return {
        data,
        loading,
        error,
        execute
    };
}
