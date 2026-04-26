<script setup>
defineProps({
  item: { type: Object, required: true },
  showRank: { type: Boolean, default: false },
  showReasonBox: { type: Boolean, default: false },
  imageSize: { type: String, default: 'large' }
});

const emit = defineEmits(['toggle-like', 'click']);

function onLike(e, item) {
  e.stopPropagation();
  emit('toggle-like', item);
}
</script>

<template>
  <article class="recommend-card" @click="emit('click', item)">
    <div class="card-image" :class="`size-${imageSize}`">
      <span
        v-if="showRank && item.rank"
        class="card-rank"
        :class="{ 'rank-other': item.rank > 1 }"
      >{{ item.rank }}</span>

      <button
        class="card-like"
        :class="{ liked: item.liked }"
        @click="onLike($event, item)"
        :aria-label="item.liked ? '찜 취소' : '찜하기'"
      >{{ item.liked ? '❤️' : '🤍' }}</button>

      <span class="card-emoji">{{ item.image }}</span>
    </div>

    <div class="card-body">
      <div class="card-title">
        <span class="card-name">{{ item.name }}</span>
        <span class="card-rating">
          <span class="star">★</span>{{ item.rating }} ({{ item.reviewCount }})
        </span>
      </div>

      <div v-if="item.distance || item.tags" class="card-meta">
        <template v-if="item.distance">{{ item.distance }}</template>
        <template v-if="item.distance && item.tags"> · </template>
        <template v-if="item.tags">{{ item.tags }}</template>
      </div>

      <div v-if="showReasonBox && item.reason" class="card-reason">
        <p class="card-reason-label">🌧️ 추천 이유</p>
        {{ item.reason }}
      </div>
      <p v-else-if="item.reason" class="card-reason-line">{{ item.reason }}</p>
    </div>
  </article>
</template>

<style scoped>
.recommend-card {
  background: #fff;
  border: 1px solid var(--color-line);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
}
.recommend-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-soft);
}

.card-image {
  background: linear-gradient(135deg, #fde68a 0%, #fb923c 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-image.size-large { height: 160px; }
.card-image.size-small { height: 130px; }

.card-emoji { font-size: 60px; }
.size-small .card-emoji { font-size: 50px; }

.card-rank {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--color-primary);
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
}
.card-rank.rank-other { background: rgba(0, 0, 0, 0.5); }

.card-like {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 14px;
}
.card-like:hover { background: #fff; transform: scale(1.1); }

.card-body { padding: 14px; }
.card-title {
  font-size: 14px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 6px;
}
.card-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-rating {
  font-size: 12px;
  color: var(--color-muted);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
}
.card-meta {
  font-size: 12px;
  color: var(--color-muted);
  margin-bottom: 10px;
}

.card-reason {
  background: var(--color-primary-light);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  line-height: 1.5;
}
.card-reason-label {
  color: var(--color-primary-dark);
  font-weight: 700;
  margin-bottom: 2px;
}
.card-reason-line {
  font-size: 11px;
  color: var(--color-muted);
}
</style>
