<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import { recommendApi } from '@/shared/api/recommend';

const reviews = ref([]);

onMounted(async () => {
  // 더 많은 리뷰를 위해 limit 늘림
  reviews.value = await recommendApi.getRecentReviews({ limit: 20 });
});
</script>

<template>
  <AppHeader active-menu="reviews" />

  <main class="container">
    <section class="page-head">
      <h1 class="page-title">리뷰</h1>
      <p class="page-desc">픽잇 사용자들의 솔직한 리뷰를 확인해보세요.</p>
    </section>

    <section class="card-section">
      <div class="review-list">
        <article v-for="review in reviews" :key="review.id" class="review-row">
          <div class="review-avatar">{{ review.avatar }}</div>
          <div class="review-content">
            <div class="review-header">
              <span class="review-author">{{ review.author }}</span>
              <span class="review-score">
                <span class="star">★</span>{{ review.rating }}
              </span>
            </div>
            <p class="review-text">{{ review.content }}</p>
            <p class="review-meta">{{ review.restaurant }} · {{ review.date }}</p>
          </div>
          <div class="review-thumb">{{ review.thumb }}</div>
        </article>
      </div>
    </section>
  </main>

  <AppFooter />
</template>
