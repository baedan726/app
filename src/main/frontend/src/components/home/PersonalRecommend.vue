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
  try {
    const data = await recommendApi.getPersonalPicks();
    items.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[PersonalRecommend] 로드 실패', e);
    items.value = [];
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
    <div class="recommend-list" v-if="items.length > 0">
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
    <div v-else class="empty-msg">맞춤 추천을 준비 중입니다.</div>
  </section>
</template>

<style scoped>
.recommend-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.empty-msg {
  padding: 40px 20px;
  text-align: center;
  color: var(--color-muted);
  font-size: 13px;
}
@media (max-width: 1024px) {
  .recommend-list { grid-template-columns: 1fr; }
}
</style>
