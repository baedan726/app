<script setup>
import { ref, onMounted } from 'vue';
import { recommendApi } from '@/shared/api/recommend';

const reviews = ref([]);

onMounted(async () => {
  try {
    const data = await recommendApi.getRecentReviews({ limit: 3 });
    reviews.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[RecentReviews] 로드 실패', e);
    reviews.value = [];
  }
});
</script>

<template>
  <section class="card-section">
    <div class="section-header">
      <h2 class="section-title">최근 리뷰</h2>
      <a href="/reviews.html" class="section-more">더 보기 ›</a>
    </div>
    <div class="review-grid" v-if="reviews.length > 0">
      <article v-for="review in reviews" :key="review.id" class="review-card">
        <div class="review-avatar">{{ review.avatar || '?' }}</div>
        <div class="review-content">
          <div class="review-header">
            <span class="review-author">{{ review.author || '익명' }}</span>
            <span class="review-score">
              <span class="star">★</span>{{ review.rating || 0 }}
            </span>
          </div>
          <p class="review-text">{{ review.content || '' }}</p>
          <p class="review-meta">{{ review.restaurant || '' }} · {{ review.date || '' }}</p>
        </div>
        <div class="review-thumb">{{ review.thumb || '🍽' }}</div>
      </article>
    </div>
    <div v-else class="empty-msg">아직 등록된 리뷰가 없습니다.</div>
  </section>
</template>

<style scoped>
.review-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.empty-msg {
  padding: 40px 20px;
  text-align: center;
  color: var(--color-muted);
  font-size: 13px;
}
.review-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 0 12px;
  border-top: 1px solid var(--color-line);
}
.review-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}
.review-content { flex: 1; min-width: 0; }
.review-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.review-author { font-size: 13px; font-weight: 700; }
.review-score { font-size: 12px; color: var(--color-muted); }
.review-text {
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.review-meta { font-size: 11px; color: var(--color-muted); }
.review-thumb {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, #fde68a 0%, #fb923c 100%);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
@media (max-width: 1024px) {
  .review-grid { grid-template-columns: 1fr; }
}
</style>
