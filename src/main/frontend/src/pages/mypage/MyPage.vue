<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import RecommendCard from '@/components/common/RecommendCard.vue';
import { recommendApi } from '@/shared/api/recommend';

const user = ref({
  name: '지훈',
  email: 'jihun@example.com',
  joinedAt: '2024.05.12',
  reviewCount: 18,
  favoriteCount: 24
});

const favorites = ref([]);

onMounted(async () => {
  // 임시: 찜한 맛집 = 추천 목록 사용
  favorites.value = await recommendApi.getPersonalPicks();
});

async function onToggleLike(item) {
  item.liked = !item.liked;
  await recommendApi.toggleLike(item.id, item.liked);
}
</script>

<template>
  <AppHeader active-menu="mypage" />

  <main class="container">
    <section class="profile-card">
      <div class="profile-avatar">{{ user.name.charAt(0) }}</div>
      <div class="profile-info">
        <h1 class="profile-name">{{ user.name }}님</h1>
        <p class="profile-email">{{ user.email }}</p>
        <p class="profile-meta">가입일 {{ user.joinedAt }}</p>
      </div>
      <div class="profile-stats">
        <div class="stat">
          <span class="stat-value">{{ user.reviewCount }}</span>
          <span class="stat-label">작성한 리뷰</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ user.favoriteCount }}</span>
          <span class="stat-label">찜한 맛집</span>
        </div>
      </div>
    </section>

    <section class="card-section">
      <div class="section-header">
        <h2 class="section-title">찜한 맛집</h2>
        <a href="/restaurants.html" class="section-more">전체 보기 ›</a>
      </div>
      <div class="grid">
        <RecommendCard
          v-for="item in favorites"
          :key="item.id"
          :item="{ ...item, liked: true }"
          image-size="small"
          @toggle-like="onToggleLike"
        />
      </div>
    </section>
  </main>

  <AppFooter />
</template>
