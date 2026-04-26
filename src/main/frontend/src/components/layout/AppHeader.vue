<script setup>
import { ref } from 'vue';

/**
 * 멀티페이지에서는 RouterLink 대신 일반 <a href>로 이동
 * → 브라우저가 풀 페이지 로드, 각 페이지의 JS/CSS만 따로 가져옴
 *
 * activeMenu prop으로 현재 페이지 표시
 */
const props = defineProps({
  activeMenu: { type: String, default: 'home' }
});

const searchQuery = ref('');

function onSearch() {
  if (!searchQuery.value.trim()) return;
  location.href = `/restaurants.html?q=${encodeURIComponent(searchQuery.value)}`;
}

const menus = [
  { key: 'home',        href: '/index.html',       label: '홈' },
  { key: 'recommend',   href: '/recommend.html',   label: '추천' },
  { key: 'restaurants', href: '/restaurants.html', label: '맛집 리스트' },
  { key: 'reviews',     href: '/reviews.html',     label: '리뷰' },
  { key: 'mypage',      href: '/mypage.html',      label: '마이페이지' }
];
</script>

<template>
  <header class="gnb">
    <div class="gnb-inner">
      <a href="/index.html" class="brand">
        <span class="brand-pin"></span>
        <span>픽잇</span>
      </a>

      <nav class="gnb-menu">
        <a
          v-for="m in menus"
          :key="m.key"
          :href="m.href"
          :class="{ active: m.key === activeMenu }"
        >{{ m.label }}</a>
      </nav>

      <div class="gnb-search">
        <input
          v-model="searchQuery"
          @keyup.enter="onSearch"
          type="text"
          placeholder="음식이나 맛집을 검색해 보세요"
        />
        <span class="gnb-search-icon">🔍</span>
      </div>

      <div class="gnb-actions">
        <a href="/login.html" class="btn-login">로그인</a>
        <a href="/signup.html" class="btn-signup">회원가입</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.gnb {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-line);
  position: sticky;
  top: 0;
  z-index: 100;
}
.gnb-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 32px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 24px;
  font-weight: 800;
  flex-shrink: 0;
}
.brand-pin {
  width: 28px;
  height: 28px;
  background: var(--color-primary);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  position: relative;
}
.brand-pin::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}
.gnb-menu { display: flex; gap: 28px; }
.gnb-menu a {
  font-size: 15px;
  font-weight: 500;
  padding: 6px 0;
  transition: color 0.15s;
}
.gnb-menu a:hover, .gnb-menu a.active { color: var(--color-primary); }

.gnb-search { flex: 1; max-width: 360px; position: relative; }
.gnb-search input {
  width: 100%;
  padding: 10px 44px 10px 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-bg);
  font-size: 13px;
}
.gnb-search input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: #fff;
}
.gnb-search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-muted);
  pointer-events: none;
}

.gnb-actions { display: flex; gap: 8px; }
.btn-login {
  padding: 9px 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 600;
  background: #fff;
}
.btn-login:hover { border-color: var(--color-text); }
.btn-signup {
  padding: 9px 22px;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 600;
}
.btn-signup:hover { background: var(--color-primary-dark); }
</style>
