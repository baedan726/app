# 픽잇 (PickEat) — Vue 3 Multi-Page

**페이지별로 HTML / JS / CSS가 완전히 분리되는 구조**. SPA처럼 한 덩어리로 번들되지 않고, 페이지마다 독립된 진입점을 가진다.

## 빠른 시작

```bash
cd pickeat-multi
npm install
npm run dev          # http://localhost:3000
npm run build        # dist/ 빌드 (페이지별 분리 출력)
npm run preview      # 빌드 결과 미리보기
```

## 핵심: 페이지가 분리된다는 의미

### 1. 진입점이 페이지 수만큼 있다

```
프로젝트 루트/
├── index.html          ← 홈 진입점
├── recommend.html      ← 추천 진입점
├── restaurants.html    ← 맛집 리스트 진입점
├── reviews.html        ← 리뷰 진입점
└── mypage.html         ← 마이페이지 진입점
```

각 HTML은 자기만의 `<script>`를 로드:

```html
<!-- index.html -->
<script type="module" src="/src/pages/home/main.js"></script>

<!-- recommend.html -->
<script type="module" src="/src/pages/recommend/main.js"></script>
```

### 2. 페이지마다 자기 폴더

```
src/pages/
├── home/
│   ├── main.js          ← 진입점 (Vue 마운트)
│   ├── HomePage.vue     ← 페이지 컴포넌트
│   └── style.css        ← 이 페이지만의 CSS
├── recommend/
│   ├── main.js
│   ├── RecommendPage.vue
│   └── style.css
├── restaurants/...
├── reviews/...
└── mypage/...
```

### 3. 빌드하면 진짜로 분리된 파일들

```bash
npm run build
```

```
dist/
├── index.html              ← 홈
├── recommend.html          ← 추천
├── restaurants.html
├── reviews.html
├── mypage.html
│
├── js/
│   ├── home-a3f5c2.js          ← 홈만 로드하는 JS
│   ├── recommend-b2e1d4.js     ← 추천만 로드하는 JS
│   ├── restaurants-c8a9e1.js
│   ├── reviews-d3b4f7.js
│   ├── mypage-e5c8a2.js
│   └── chunks/
│       └── shared-f7d9b3.js    ← 공통 코드 (Vue, axios, 공유 컴포넌트)
│
└── css/
    ├── home-9f2c.css
    ├── recommend-7e1d.css
    ├── restaurants-3a8b.css
    ├── reviews-c4d2.css
    └── mypage-2e1f.css
```

홈 페이지를 열면 `home-*.js` + `home-*.css` + `shared-*.js`만 로드. 추천 페이지의 코드는 다운로드되지 않는다.

## 폴더 구조 전체

```
pickeat-multi/
├── package.json
├── vite.config.js                ★ 멀티페이지 입력 설정
│
├── index.html                    ← 5개 진입 HTML
├── recommend.html
├── restaurants.html
├── reviews.html
├── mypage.html
│
└── src/
    ├── pages/                    ★ 페이지별 폴더
    │   ├── home/
    │   │   ├── main.js
    │   │   ├── HomePage.vue
    │   │   └── style.css
    │   ├── recommend/
    │   ├── restaurants/
    │   ├── reviews/
    │   └── mypage/
    │
    ├── components/               ← 페이지가 공유하는 컴포넌트
    │   ├── layout/
    │   │   ├── AppHeader.vue     (모든 페이지 사용)
    │   │   └── AppFooter.vue
    │   ├── home/                 (홈 전용 - 7개)
    │   │   ├── HeroSection.vue
    │   │   ├── SituationFilter.vue
    │   │   ├── TodayPicks.vue
    │   │   ├── CategoryGrid.vue
    │   │   ├── NearbyMap.vue
    │   │   ├── PersonalRecommend.vue
    │   │   └── RecentReviews.vue
    │   └── common/
    │       └── RecommendCard.vue (재사용 카드)
    │
    └── shared/                   ← 페이지가 공유하는 로직
        ├── styles/
        │   ├── variables.css
        │   └── reset.css
        ├── api/
        │   ├── http.js
        │   ├── weather.js
        │   └── recommend.js
        ├── mock/
        │   └── data.js
        └── stores/
            └── filter.js
```

## 페이지 추가하는 법 (4단계)

새 페이지 `notice.html` 추가하고 싶다면:

**① HTML 파일 생성** (`notice.html`)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>공지사항 - 픽잇</title>
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/pages/notice/main.js"></script>
</body>
</html>
```

**② 페이지 폴더 생성** (`src/pages/notice/`)
- `main.js`, `NoticePage.vue`, `style.css`

**③ Vite 설정에 등록** (`vite.config.js`의 `input`)
```js
input: {
  home: resolve(__dirname, 'index.html'),
  // ...
  notice: resolve(__dirname, 'notice.html')   // ← 추가
}
```

**④ AppHeader 메뉴 배열에 추가** (필요시)

## SPA vs MPA 비교 (왜 이렇게 했는지)

| 항목 | SPA (이전 버전) | MPA (이번 버전) |
|---|---|---|
| 진입점 | 1개 (index.html) | **5개** (페이지별) |
| JS 번들 | 1개 (한 덩어리) | **페이지별 분리** + 공통 청크 |
| CSS 번들 | 1개 | **페이지별 분리** |
| 라우팅 | Vue Router (클라이언트) | **브라우저 네이티브** (`<a href>`) |
| 페이지 전환 | 빠름 (JS만 실행) | 풀 페이지 로드 |
| 초기 로딩 | 느림 (전체 번들) | **빠름** (해당 페이지 것만) |
| Pinia store | 페이지 간 유지 | **페이지마다 초기화** |
| eGov 통합 | 어려움 (history fallback 필요) | **쉬움** (정적 파일 서빙만) |

페이지 간 상태 유지가 필요하면 `sessionStorage`/`localStorage` 사용. 어차피 페이지가 분리되어 있으니 페이지마다 책임이 명확해서 큰 시스템에서는 오히려 유지보수 유리.

## 페이지 간 이동

`<RouterLink>` 대신 일반 `<a href>`:

```vue
<!-- AppHeader.vue -->
<a href="/recommend.html">추천</a>
<a href="/restaurants.html">맛집 리스트</a>
```

브라우저가 풀 페이지 로드 → 새 페이지의 JS/CSS만 다운로드 → 마운트.

## eGov 배포

빌드 결과 `dist/*` 를 그대로 `webapp/` 직속에 복사. 페이지 라우팅을 Spring이 신경쓸 필요 없음 (각각이 정적 HTML이니까).

```
src/main/webapp/
├── index.html
├── recommend.html
├── restaurants.html
├── reviews.html
├── mypage.html
├── js/
└── css/
```

`WebMvcConfig`에 정적 리소스 핸들러만 등록:
```java
registry.addResourceHandler("/js/**", "/css/**", "/*.html")
        .addResourceLocations("/");
```

이전 SPA 버전에서 필요했던 SPA fallback Controller는 **불필요**. 각 페이지가 진짜 정적 HTML 파일이라 Spring이 자동으로 서빙.

## API 연동 시 주의

페이지를 새로 열 때마다 Pinia store가 초기화됨. 검색 필터/장바구니처럼 페이지 간 유지가 필요한 상태는:

```js
// shared/stores/filter.js 에서
import { useStorage } from '@vueuse/core';  // 또는 직접 sessionStorage 활용

const selectedSituations = useStorage('filter:situations', []);
```

또는 간단히:
```js
const stored = sessionStorage.getItem('filter:situations');
const selectedSituations = ref(stored ? JSON.parse(stored) : []);
watch(selectedSituations, v => sessionStorage.setItem('filter:situations', JSON.stringify(v)), { deep: true });
```

## 디자인 토큰

`src/shared/styles/variables.css` 한 파일에서 모든 색/반경/그림자 정의. 모든 컴포넌트의 `<style scoped>`가 이 변수만 참조하므로 브랜드 색 변경은 한 줄 수정.
