<script setup>
const services = [
  { href: '/index.html',       label: '홈' },
  { href: '/recommend.html',   label: '추천' },
  { href: '/restaurants.html', label: '맛집 리스트' },
  { href: '/reviews.html',     label: '리뷰' }
];
const support = [
  { href: '/notice.html',  label: '공지사항' },
  { href: '/faq.html',     label: '자주 묻는 질문' },
  { href: '/contact.html', label: '문의하기' }
];
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="brand">
          <span class="brand-pin"></span>
          <span>픽잇</span>
        </div>
        <p>날씨와 취향을 분석해<br/>당신에게 딱 맞는 한 끼를 추천해드려요.</p>
      </div>

      <div class="footer-col">
        <h4>서비스</h4>
        <ul>
          <li v-for="m in services" :key="m.href">
            <a :href="m.href">{{ m.label }}</a>
          </li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>고객센터</h4>
        <ul>
          <li v-for="m in support" :key="m.href">
            <a :href="m.href">{{ m.label }}</a>
          </li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>회사 정보</h4>
        <p class="footer-info">
          <span>팀</span> PickEat<br/>
          <span>GitHub</span> <a href="#">🔗</a><br/>
          <span>이메일</span> pickeat@example.com
        </p>
      </div>

      <div class="footer-col">
        <h4>SNS</h4>
        <div class="footer-sns">
          <a href="#">📷</a>
          <a href="#">⚙️</a>
          <a href="#">📘</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">© 2026 PickEat. All rights reserved.</div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--color-surface);
  margin-top: 32px;
  padding: 40px 24px 28px;
  border-top: 1px solid var(--color-line);
}
.footer-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr 1fr;
  gap: 40px;
  margin-bottom: 28px;
}
.footer-brand { font-size: 12px; color: var(--color-muted); line-height: 1.6; }
.brand {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 12px;
}
.brand-pin {
  width: 22px;
  height: 22px;
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
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}
.footer-col h4 {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 14px;
}
.footer-col ul li { margin-bottom: 8px; }
.footer-col a { font-size: 12px; color: var(--color-muted); }
.footer-col a:hover { color: var(--color-primary); }
.footer-info { font-size: 12px; color: var(--color-muted); line-height: 1.7; }
.footer-info span { color: var(--color-text); margin-right: 6px; font-weight: 500; }
.footer-sns { display: flex; gap: 10px; }
.footer-sns a {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
  transition: all 0.15s;
}
.footer-sns a:hover { background: var(--color-primary); color: #fff; }
.footer-bottom {
  text-align: center;
  font-size: 11px;
  color: var(--color-soft);
  padding-top: 24px;
  border-top: 1px solid var(--color-line);
  max-width: var(--container-max);
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .footer-inner { grid-template-columns: 1fr 1fr; }
}
</style>
