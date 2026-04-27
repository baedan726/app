<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import { recommendApi } from '@/shared/api/recommend';

const reviews = ref([]);
const loading = ref(false);
const error = ref(false);

async function fetchReviews() {
  loading.value = true;
  error.value = false;
  try {
    const data = await recommendApi.getRecentReviews({ limit: 20 });
    reviews.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[ReviewsPage] 리뷰 로드 실패', e);
    error.value = true;
    reviews.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchReviews);
</script>

<template>
  <AppHeader active-menu="reviews" />

  <main class="container">
    <section class="page-head">
      <h1 class="page-title">리뷰</h1>
      <p class="page-desc">픽잇 사용자들의 솔직한 리뷰를 확인해보세요.</p>
    </section>

    <section class="card-section">
      <!-- 로딩 -->
      <div v-if="loading" class="state-msg">리뷰를 불러오는 중...</div>

      <!-- 에러 -->
      <div v-else-if="error" class="state-msg state-error">
        리뷰 목록을 불러오지 못했습니다.
        <button @click="fetchReviews" class="retry-btn">다시 시도</button>
      </div>

      <!-- 빈 결과 -->
      <div v-else-if="reviews.length === 0" class="state-msg">
        아직 등록된 리뷰가 없습니다.
      </div>

      <!-- 정상 -->
      <div v-else class="review-list">
        <article v-for="review in reviews" :key="review.id" class="review-row">
          <div class="review-avatar">{{ review.avatar || '?' }}</div>
          <div class="review-content">
            <div class="review-header">
              <span class="review-author">{{ review.author || '익명' }}</span>
              <span class="review-score">
                <span class="star">★</span>{{ review.rating || 0 }}
              </span>
            </div>
            <p class="review-text">{{ review.content || '' }}</p>
            <p class="review-meta">
              {{ review.restaurant || '' }} · {{ review.date || '' }}
            </p>
          </div>
          <div class="review-thumb">{{ review.thumb || '🍽' }}</div>
        </article>
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
