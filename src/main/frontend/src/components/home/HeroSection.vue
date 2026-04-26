<script setup>
import { ref, onMounted } from 'vue';
import { weatherApi } from '@/shared/api/weather';

const weather = ref({
  temp: '--', feelsLike: '--', humidity: '--',
  description: '로딩중', icon: '☁️'
});

onMounted(async () => {
  try {
    weather.value = await weatherApi.getCurrent();
  } catch (e) {
    console.error('날씨 로드 실패', e);
  }
});

function goRecommend() { location.href = '/recommend.html'; }
function goNearby() { location.href = '/restaurants.html?nearby=true'; }
</script>

<template>
  <section class="hero">
    <div class="hero-text">
      <h1>오늘 날씨, 당신의 취향에<br/>딱 맞는 <span class="highlight">한 끼</span></h1>
      <p>날씨와 취향을 분석해 최고의 맛집을 추천해드려요.</p>
      <div class="hero-buttons">
        <button class="btn-hero btn-hero-primary" @click="goRecommend">
          <span>✨</span> 추천 받기
        </button>
        <button class="btn-hero btn-hero-secondary" @click="goNearby">
          <span>📍</span> 내 주변 보기
        </button>
      </div>
    </div>
    <div class="hero-illust"></div>

    <div class="weather-card">
      <p class="weather-label">현재 날씨</p>
      <div class="weather-main">
        <span class="weather-icon">{{ weather.icon }}</span>
        <span class="weather-temp">{{ weather.temp }}°C</span>
      </div>
      <p class="weather-desc">{{ weather.description }}</p>
      <p class="weather-meta">체감 {{ weather.feelsLike }}°C · 습도 {{ weather.humidity }}%</p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: var(--color-hero-bg);
  border-radius: var(--radius-xl);
  padding: 48px 56px;
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 32px;
  align-items: center;
  min-height: 320px;
  position: relative;
  overflow: hidden;
}
.hero-text h1 {
  font-size: 38px;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 14px;
}
.highlight { color: var(--color-primary); }
.hero-text p {
  font-size: 14px;
  color: var(--color-muted);
  margin-bottom: 28px;
}
.hero-buttons { display: flex; gap: 10px; }
.btn-hero {
  padding: 14px 28px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s;
}
.btn-hero-primary {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
}
.btn-hero-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}
.btn-hero-secondary {
  background: #fff;
  border: 1px solid var(--color-border);
}
.btn-hero-secondary:hover { border-color: var(--color-text); }

.hero-illust {
  height: 280px;
  background: linear-gradient(135deg, #cdd5e0 0%, #a8b3c7 100%);
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
}
.hero-illust::before {
  content: '🍲';
  font-size: 100px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
}

.weather-card {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 14px 18px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  min-width: 180px;
}
.weather-label { font-size: 11px; color: var(--color-muted); margin-bottom: 4px; }
.weather-main {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.weather-icon { font-size: 28px; }
.weather-temp {
  font-size: 26px;
  font-weight: 800;
}
.weather-desc {
  font-size: 13px;
  margin-bottom: 6px;
}
.weather-meta { font-size: 11px; color: var(--color-muted); }

@media (max-width: 1024px) {
  .hero { grid-template-columns: 1fr; padding: 32px; }
  .hero-text h1 { font-size: 28px; }
  .weather-card { position: static; margin-top: 16px; }
}
</style>
