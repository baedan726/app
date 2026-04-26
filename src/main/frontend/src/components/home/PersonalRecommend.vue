<script setup>
import { ref, onMounted, computed } from 'vue';
import { recommendApi } from '@/shared/api/recommend';
import RecommendCard from '@/components/common/RecommendCard.vue';

const props = defineProps({
  userName: { type: String, default: '지훈' }
});

const items = ref([]);
const greeting = computed(() => `${props.userName}님을 위한 맞춤 추천`);

async function load() {
  items.value = await recommendApi.getPersonalPicks();
}

async function onToggleLike(item) {
  const before = item.liked;
  item.liked = !item.liked;
  try {
    await recommendApi.toggleLike(item.id, item.liked);
  } catch (e) {
    item.liked = before;
  }
}

onMounted(load);
</script>

<template>
  <section class="card-section">
    <div class="section-header">
      <h2 class="section-title">{{ greeting }}</h2>
      <a href="/recommend.html" class="section-more">더 보기 ›</a>
    </div>
    <div class="recommend-list">
      <RecommendCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :show-rank="false"
        :show-reason-box="false"
        image-size="small"
        @toggle-like="onToggleLike"
      />
    </div>
  </section>
</template>

<style scoped>
.recommend-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

@media (max-width: 1024px) {
  .recommend-list { grid-template-columns: 1fr; }
}
</style>
