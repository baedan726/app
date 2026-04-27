<script setup>
import { ref, onMounted } from 'vue';
import { useFilterStore } from '@/shared/stores/filter';
import { recommendApi } from '@/shared/api/recommend';

const filterStore = useFilterStore();
const situations = ref([]);
const localKeyword = ref('');
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const data = await recommendApi.getSituations();
    // ★ 방어 코드: 응답이 배열이 아니면 빈 배열로 처리
    //    eGov가 HTML 에러 페이지나 다른 형식 줘도 화면 안 깨짐
    situations.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[SituationFilter] 상황 목록 로드 실패', e);
    situations.value = [];
  } finally {
    loading.value = false;
  }
});

const isActive = (code) => filterStore.selectedSituations.includes(code);

function toggle(s) {
  if (s && s.code) filterStore.toggleSituation(s.code);
}

function applyKeyword() {
  filterStore.setKeyword(localKeyword.value);
}
</script>

<template>
  <section class="card-section">
    <div class="situation-box">
      <div class="situation-search">
        <input
          v-model="localKeyword"
          @keyup.enter="applyKeyword"
          placeholder="음식, 맛집, 지역을 검색해 보세요"
        />
        <span class="situation-search-icon">🔍</span>
      </div>

      <div class="situation-content">
        <div class="situation-label">
          상황 선택 <small>(복수 선택 가능)</small>
        </div>

        <!-- ★ situations이 배열이고 비어있지 않을 때만 렌더링 -->
        <div class="tag-list" v-if="situations.length > 0">
          <button
            v-for="s in situations"
            :key="s.code"
            class="tag"
            :class="{ active: isActive(s.code) }"
            @click="toggle(s)"
          >{{ s.label }}</button>
        </div>
        <div class="tag-list" v-else-if="loading">
          <span class="loading-text">불러오는 중...</span>
        </div>
        <div class="tag-list" v-else>
          <span class="loading-text">상황 데이터를 불러오지 못했습니다</span>
        </div>

        <button class="tag tag-filter">≡ 상세 필터</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.situation-box {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 28px;
  align-items: center;
}
.situation-search { position: relative; }
.situation-search input {
  width: 100%;
  padding: 12px 44px 12px 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #fff;
  font-size: 13px;
}
.situation-search input:focus {
  outline: none;
  border-color: var(--color-primary);
}
.situation-search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-muted);
  pointer-events: none;
}

.situation-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.situation-label {
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}
.situation-label small {
  font-size: 11px;
  color: var(--color-muted);
  font-weight: 400;
  margin-left: 4px;
}

.tag-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.loading-text {
  font-size: 13px;
  color: var(--color-muted);
  padding: 7px 0;
}
.tag {
  padding: 7px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 500;
  background: #fff;
  transition: all 0.15s;
}
.tag:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.tag.active {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
  font-weight: 600;
}
.tag-filter {
  background: var(--color-text);
  color: #fff;
  border-color: var(--color-text);
  margin-left: auto;
}
.tag-filter:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  color: #fff;
}

@media (max-width: 1024px) {
  .situation-box { grid-template-columns: 1fr; }
}
</style>
