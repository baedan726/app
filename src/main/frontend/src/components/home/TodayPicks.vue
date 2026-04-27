<script setup>
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useFilterStore } from '@/shared/stores/filter';
import { weatherApi } from '@/shared/api/weather';
import { recommendApi } from '@/shared/api/recommend';
import RecommendCard from '@/components/common/RecommendCard.vue';

const filterStore = useFilterStore();
const { selectedSituations, keyword } = storeToRefs(filterStore);

const picks = ref([]);
const mealCode = ref('-');

async function load() {
  try {
    const [list, weather] = await Promise.all([
      recommendApi.getTodayPicks({
        situations: selectedSituations.value,
        keyword: keyword.value
      }),
      weatherApi.getCurrent()
    ]);
    picks.value = Array.isArray(list) ? list : [];
    mealCode.value = (weather && weather.code) || '-';
  } catch (e) {
    console.error('[TodayPicks] 로드 실패', e);
    picks.value = [];
    mealCode.value = '-';
  }
}

async function onToggleLike(item) {
  if (!item || !item.id) return;
  const before = item.liked;
  item.liked = !item.liked;
  try {
    await recommendApi.toggleLike(item.id, item.liked);
  } catch (e) {
    item.liked = before;
    alert('찜 처리 실패');
  }
}

onMounted(load);
watch([selectedSituations, keyword], load, { deep: true });
</script>

<template>
  <section class="card-section">
    <div class="section-header">
      <div>
        <h2 class="section-title">오늘의 추천</h2>
        <p class="section-subtitle">날씨와 취향을 분석한 맞춤 추천이에요!</p>
      </div>
      <div class="mealcode">
        <span class="mealcode-pill">오늘의 먹코드</span>
        <span class="mealcode-code">{{ mealCode }}</span>
        <span class="mealcode-desc">(비 · 피곤 · 밥 · 저가)</span>
      </div>
    </div>

    <div class="recommend-grid" v-if="picks.length > 0">
      <RecommendCard
        v-for="item in picks"
        :key="item.id"
        :item="item"
        :show-rank="true"
        :show-reason-box="true"
        image-size="large"
        @toggle-like="onToggleLike"
      />
      <button class="carousel-nav" aria-label="다음">›</button>
    </div>
    <div v-else class="empty-msg">조건에 맞는 추천이 없습니다.</div>
  </section>
</template>

<style scoped>
.mealcode { display: flex; align-items: center; gap: 10px; }
.mealcode-pill {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 700;
}
.mealcode-code {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: 4px;
}
.mealcode-desc { font-size: 11px; color: var(--color-muted); }

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  position: relative;
}
.empty-msg {
  padding: 60px 20px;
  text-align: center;
  color: var(--color-muted);
  font-size: 14px;
}
.carousel-nav {
  position: absolute;
  top: 50%;
  right: -16px;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  z-index: 2;
}
.carousel-nav:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

@media (max-width: 1024px) {
  .recommend-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
