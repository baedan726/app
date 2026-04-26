<script setup>
import { ref, onMounted } from 'vue';
import { recommendApi } from '@/shared/api/recommend';

const categories = ref([]);

onMounted(async () => {
  categories.value = await recommendApi.getCategories();
});

function selectCategory(cat) {
  location.href = `/restaurants.html?category=${cat.code}`;
}
</script>

<template>
  <section class="card-section">
    <div class="section-header">
      <h2 class="section-title">카테고리 추천</h2>
      <a href="/restaurants.html" class="section-more">전체 보기 ›</a>
    </div>
    <div class="category-grid">
      <button
        v-for="cat in categories"
        :key="cat.code"
        class="category-item"
        @click="selectCategory(cat)"
      >
        <span class="category-icon">{{ cat.icon }}</span>
        <span class="category-name">{{ cat.name }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
}
.category-item {
  background: #fff;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  padding: 18px 12px;
  text-align: center;
  transition: all 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.category-item:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  transform: translateY(-2px);
}
.category-icon { font-size: 36px; }
.category-name {
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .category-grid { grid-template-columns: repeat(4, 1fr); }
}
</style>
