<script setup>
// 실제로는 Kakao/Naver Map API 연동 위치
</script>

<template>
  <section class="card-section">
    <div class="section-header">
      <h2 class="section-title">내 주변 맛집</h2>
      <a href="/map.html" class="section-action">지도 크게 보기 ⛶</a>
    </div>
    <div class="map-area">
      <span class="map-bg-text">지명 지도</span>
      <span class="map-pin p1">📍</span>
      <span class="map-pin p2">📍</span>
      <span class="map-pin p3">📍</span>
      <span class="map-pin p4">📍</span>
    </div>
    <div class="map-legend">
      <span>📍 추천 맛집</span>
      <span class="legend-pink">📍 내가 찜한 맛집</span>
      <span class="legend-info">📍 방문한 맛집</span>
    </div>
  </section>
</template>

<style scoped>
.section-action {
  font-size: 12px;
  color: var(--color-muted);
  border: 1px solid var(--color-border);
  padding: 5px 12px;
  border-radius: var(--radius-sm);
}

.map-area {
  height: 240px;
  background: linear-gradient(135deg, #e0e7ee 0%, #c8d3e0 100%);
  border-radius: var(--radius-md);
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.map-bg-text {
  color: rgba(0, 0, 0, 0.2);
  font-weight: 700;
  letter-spacing: 8px;
  font-size: 22px;
}
.map-pin { position: absolute; font-size: 24px; }
.p1 { top: 30%; left: 25%; }
.p2 { top: 25%; left: 55%; color: var(--color-pink); }
.p3 { top: 55%; left: 35%; color: var(--color-primary); }
.p4 { top: 40%; left: 70%; color: var(--color-info); }

.map-legend {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--color-muted);
}
.legend-pink { color: var(--color-pink); }
.legend-info { color: var(--color-info); }
</style>
