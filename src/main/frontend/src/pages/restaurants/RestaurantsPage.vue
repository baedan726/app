<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import RecommendCard from '@/components/common/RecommendCard.vue';
import { recommendApi } from '@/shared/api/recommend';

const items = ref([]);
const sortBy = ref('rating');
const loading = ref(false);
const error = ref(false);

// URL 쿼리에서 카테고리 읽기
const params = new URLSearchParams(location.search);
const initialCategory = params.get('category') || '';
const selectedCategory = ref(initialCategory);

const filterCategories = [
  { code: '',         name: '전체' },
  { code: 'KOREAN',   name: '한식' },
  { code: 'CHINESE',  name: '중식' },
  { code: 'JAPANESE', name: '일식' },
  { code: 'WESTERN',  name: '양식' },
  { code: 'CHICKEN',  name: '치킨' }
];

async function fetchItems() {
  loading.value = true;
  error.value = false;
  try {
    const params = selectedCategory.value
      ? { category: selectedCategory.value }
      : {};
    const data = await recommendApi.getRestaurants(params);
    items.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[RestaurantsPage] 맛집 목록 로드 실패', e);
    error.value = true;
    items.value = [];
  } finally {
    loading.value = false;
  }
}

// 카테고리 변경 시 URL 동기화 + 재조회
watch(selectedCategory, (newCat) => {
  // URL 갱신 (페이지 새로고침 없이)
  const url = new URL(location.href);
  if (newCat) url.searchParams.set('category', newCat);
  else url.searchParams.delete('category');
  history.replaceState(null, '', url);

  fetchItems();
});

onMounted(fetchItems);

const sortedItems = computed(() => {
  const list = [...items.value];
  if (sortBy.value === 'rating') {
    return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
  if (sortBy.value === 'review') {
    return list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  }
  return list;
});

async function onToggleLike(item) {
  if (!item || !item.id) return;
  const prevState = item.liked;
  item.liked = !prevState;
  try {
    await recommendApi.toggleLike(item.id, item.liked);
  } catch (e) {
    item.liked = prevState;
  }
}
</script>

<template>
  <AppHeader active-menu="restaurants" />

  <main class="container">
    <section class="page-head">
      <h1 class="page-title">맛집 리스트</h1>
      <p class="page-desc">조건에 맞는 맛집을 찾아보세요.</p>
    </section>

    <section class="card-section">
      <div class="filter-bar">
        <div class="filter-tags">
          <button
            v-for="cat in filterCategories"
            :key="cat.code"
            class="tag"
            :class="{ active: selectedCategory === cat.code }"
            @click="selectedCategory = cat.code"
          >{{ cat.name }}</button>
        </div>

        <select v-model="sortBy" class="sort-select">
          <option value="rating">평점순</option>
          <option value="review">리뷰순</option>
          <option value="distance">거리순</option>
        </select>
      </div>

      <!-- 로딩 -->
      <div v-if="loading" class="state-msg">맛집 목록을 불러오는 중...</div>

      <!-- 에러 -->
      <div v-else-if="error" class="state-msg state-error">
        목록을 불러오지 못했습니다.
        <button @click="fetchItems" class="retry-btn">다시 시도</button>
      </div>

      <!-- 빈 결과 -->
      <div v-else-if="sortedItems.length === 0" class="state-msg">
        조건에 맞는 맛집이 없습니다.
      </div>

      <!-- 정상 -->
      <div v-else class="grid">
        <RecommendCard
          v-for="item in sortedItems"
          :key="item.id"
          :item="item"
          image-size="small"
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
.state-error { color: var(--color-danger, #e25555); }
.retry-btn {
  margin-left: 16px;
  padding: 8px 20px;
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.retry-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
