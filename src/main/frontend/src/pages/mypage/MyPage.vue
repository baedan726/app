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
const loading = ref(false);
const error = ref(false);

async function fetchFavorites() {
  loading.value = true;
  error.value = false;
  try {
    // 임시: 찜한 맛집 = 추천 목록 사용
    const data = await recommendApi.getPersonalPicks();
    favorites.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[MyPage] 찜한 맛집 로드 실패', e);
    error.value = true;
    favorites.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchFavorites);

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

      <!-- 로딩 -->
      <div v-if="loading" class="state-msg">불러오는 중...</div>

      <!-- 에러 -->
      <div v-else-if="error" class="state-msg state-error">
        찜한 맛집을 불러오지 못했습니다.
        <button @click="fetchFavorites" class="retry-btn">다시 시도</button>
      </div>

      <!-- 빈 결과 -->
      <div v-else-if="favorites.length === 0" class="state-msg">
        아직 찜한 맛집이 없습니다.
      </div>

      <!-- 정상 -->
      <div v-else class="grid">
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

<style scoped>
.state-msg {
  padding: 60px 20px;
  text-align: center;
  color: var(--color-muted);
  font-size: 14px;
}
.state-error { color: var(--color-danger, #e25555); }
.retry-btn {
  margin-left: 16px;
  padding: 6px 16px;
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
}
.retry-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
</style>
