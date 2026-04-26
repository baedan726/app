<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import RecommendCard from '@/components/common/RecommendCard.vue';
import { recommendApi } from '@/shared/api/recommend';

const items = ref([]);

onMounted(async () => {
  items.value = await recommendApi.getTodayPicks();
});

async function onToggleLike(item) {
  item.liked = !item.liked;
  await recommendApi.toggleLike(item.id, item.liked);
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
      <div class="grid">
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
