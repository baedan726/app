<script setup>
import { ref, onMounted, computed } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import RecommendCard from '@/components/common/RecommendCard.vue';
import { recommendApi } from '@/shared/api/recommend';

const items = ref([]);
const sortBy = ref('rating');  // rating | distance | review

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

onMounted(async () => {
  items.value = await recommendApi.getRestaurants();
});

const sortedItems = computed(() => {
  const list = [...items.value];
  if (sortBy.value === 'rating') {
    return list.sort((a, b) => b.rating - a.rating);
  }
  if (sortBy.value === 'review') {
    return list.sort((a, b) => b.reviewCount - a.reviewCount);
  }
  return list;
});

async function onToggleLike(item) {
  item.liked = !item.liked;
  await recommendApi.toggleLike(item.id, item.liked);
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

      <div class="grid">
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
