<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import RecommendCard from '@/components/common/RecommendCard.vue';
import { recommendApi } from '@/shared/api/recommend';

const items = ref([]);
const loading = ref(false);
const error = ref(false);

async function fetchItems() {
  loading.value = true;
  error.value = false;
  try {
    const data = await recommendApi.getTodayPicks();
    items.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[RecommendPage] 추천 목록 로드 실패', e);
    error.value = true;
    items.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchItems);

async function onToggleLike(item) {
  if (!item || !item.id) return;
  const prevState = item.liked;
  item.liked = !prevState;
  try {
    await recommendApi.toggleLike(item.id, item.liked);
  } catch (e) {
    item.liked = prevState; // 실패 시 롤백
  }
}
</script>

<template>
  <AppHeader active-menu="recommend" />

  <main class="container">
    <section class="page-head">
      <h1 class="page-title">맞춤 추천</h1>
      <p class="page-desc">날씨와 취향, 상황을 종합해서 추천해드려요.</p>
    </section>

    <section class="card-section">
      <!-- 로딩 -->
      <div v-if="loading" class="state-msg">
        추천 목록을 불러오는 중...
      </div>

      <!-- 에러 -->
      <div v-else-if="error" class="state-msg state-error">
        일시적 오류로 추천 목록을 불러오지 못했습니다.
        <button @click="fetchItems" class="retry-btn">다시 시도</button>
      </div>

      <!-- 빈 결과 -->
      <div v-else-if="items.length === 0" class="state-msg">
        추천할 맛집이 없습니다.
      </div>

      <!-- 정상 -->
      <div v-else class="grid">
        <RecommendCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          :show-rank="true"
          :show-reason-box="true"
          image-size="large"
          @toggle-like="onToggleLike"
        />
      </div>
    </section>
  </main>

  <AppFooter />
</template>

<style scoped>
.state-msg {
  padding: 80px 20px;
  text-align: center;
  color: var(--color-muted);
  font-size: 15px;
}
.state-error {
  color: var(--color-danger, #e25555);
}
.retry-btn {
  margin-left: 16px;
  padding: 8px 20px;
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 14px;
}
.retry-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
