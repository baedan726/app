# PickEat 멀티페이지 — 통합·운영 가이드

> 현재 소스 구조(Vite Multi-Page + Vue 3 SFC + Pinia + axios)는 그대로 유지하면서,
> 학습 단계의 임시 처리들을 운영 가능한 형태로 단계적으로 강화하는 가이드.

---

## 0. 이 구조가 왜 좋은 선택인가

같은 백엔드(eGov)를 두고 프론트는 다음 세 가지 선택지가 있다.

| 패턴 | HTML | 라우팅 | 빌드 도구 | 망분리 | 감리·산출물 |
|---|---|---|---|---|---|
| **Vue Island** (JSP+CDN) | 화면마다 JSP | Spring | 없음 | 강 | 강 |
| **Vite MPA** (현재) | 페이지마다 HTML | `<a href>` 네이티브 | Vite | 강 | 중 |
| 풀 SPA (Router) | 1장 (index.html) | Vue Router | Vite | 약 | 약 |

지금 패턴이 실용적인 이유는, 페이지마다 HTML이 따로 빌드되어 나오기 때문에 **eGov의 webapp/에 그대로 복사하면 끝**이라는 점이다. SPA fallback Controller도 필요 없고, 메뉴 권한 매핑도 페이지 단위로 깨끗하게 떨어진다. 동시에 .vue SFC와 Vite의 HMR·코드 분할 같은 모던 빌드 이점은 그대로 챙긴다.

---

## 1. 현재 소스의 약점과 보완 방향

학습 단계에서 자연스럽게 생긴 임시 처리들:

| 위치 | 현재 상태 | 운영용 개선 |
|---|---|---|
| `api/recommend.js` | `USE_MOCK = true` 하드코딩 | `.env`로 분리, 운영 빌드는 자동 false |
| `api/http.js` | CSRF 미처리, 401만 console.warn | CSRF 자동 헤더, 401→로그인 리다이렉트 |
| `stores/filter.js` | 페이지 이동 시 휘발 | sessionStorage 자동 영속화 |
| 페이지 컴포넌트 | loading/error 직접 ref로 관리 | `useApi` 컴포저블로 표준화 |
| 인증 페이지 (mypage 등) | 진입 시 인증 미검증 | `useAuthGuard` 컴포저블 |
| URL 쿼리 처리 | `URLSearchParams` 직접 사용 | `useUrlQuery` 컴포저블 |
| 배포 | 수동 복사 | `npm run deploy:egov` |

---

## 2. 적용 순서 (권장)

### 스텝 1 — 환경 설정 분리

`.env.development`, `.env.production` 생성. `USE_MOCK` 같은 값은 코드에서 빼고 환경변수로.

`src/shared/config/index.js`로 한 번에 wrap.

```javascript
import { config } from '@/shared/config';
if (config.useMock) { ... }
```

### 스텝 2 — http.js 강화

CSRF 자동 주입, 401 리다이렉트, ResultVO unwrap 헬퍼 추가.

```javascript
// 기존
http.interceptors.response.use(r => r.data, err => { ... });

// 변경 후 — 인터셉터에서 status별 표준 처리
// 401 → 로그인 페이지 (현재 URL을 redirect 쿼리로 보존)
// 403 → 권한 없음 alert
// 5xx → 시스템 관리자 안내
```

### 스텝 3 — filter store 영속화

페이지 새로고침/이동 후에도 검색 필터 유지. `watch` + `sessionStorage` 패턴.

### 스텝 4 — useApi 컴포저블 도입

기존 RestaurantsPage의 패턴:
```javascript
const items = ref([]);
onMounted(async () => { items.value = await recommendApi.getRestaurants(); });
```

→ 변경:
```javascript
const { data: items, loading, error, execute } = useApi(
    () => recommendApi.getRestaurants(),
    { defaultValue: [] }
);
```

loading/error 상태가 자동으로 따라온다. 5개 페이지 전부 적용 가능.

### 스텝 5 — useAuthGuard로 인증 페이지 보호

mypage처럼 로그인이 필요한 페이지의 main.js:

```javascript
import { useAuthGuard } from '@/shared/composables/useAuthGuard';

(async () => {
    const user = await useAuthGuard();   // 401이면 자동 리다이렉트
    if (!user) return;

    const app = createApp(MyPage, { user });
    app.use(createPinia());
    app.mount('#app');
})();
```

### 스텝 6 — useUrlQuery로 URL 동기화

검색 조건이 URL에 반영되어야 북마크·뒤로가기·새로고침 시 일관성. RestaurantsPage가 이미 일부 적용 중인데, 표준화 가능.

```javascript
const query = useUrlQuery();
const category = ref(query.get('category', ''));
watch(category, (v) => query.set('category', v));
```

---

## 3. eGov 백엔드와의 실제 연결

### dev 모드

`vite.config.js`의 프록시 설정대로 `localhost:8080`(eGov)으로 자동 전달. `.env.development`에서 `VITE_USE_MOCK=true`이면 백엔드가 안 떠 있어도 mock으로 작동.

### 프로덕션 빌드

`.env.production`이 적용되어 `VITE_USE_MOCK=false`로 강제됨. 빌드 산출물의 모든 axios 호출이 진짜 `/api/**`로 나간다.

### eGov 배포

```bash
npm run deploy:egov
```

`vite build` 후 `scripts/deploy-to-egov.js`가 다음을 수행:

1. `dist/` 존재 확인
2. eGov webapp의 기존 산출물(`*.html`, `js/`, `css/`, `images/`, `fonts/`, `assets/`) 정리
3. **WEB-INF, META-INF, *.jsp는 절대 건드리지 않음**
4. `dist/`의 모든 파일을 webapp 루트로 복사

dry run으로 미리 확인 가능:
```bash
EGOV_WEBAPP_PATH=/path/to/egov/src/main/webapp npm run deploy:dry
```

### Spring 측 설정

별다른 설정 거의 불필요. 정적 리소스 핸들러만 등록.

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 정적 자원은 Spring이 자동 서빙. 화면별 컨트롤러 불필요.
        registry.addResourceHandler("/*.html", "/js/**", "/css/**",
                                    "/images/**", "/fonts/**", "/assets/**")
                .addResourceLocations("/")
                .setCachePeriod(60 * 60 * 24 * 30);   // 30일 캐시
    }
}
```

`/api/**` 는 기존 `@RestController`가 처리. 화면 진입용 Controller는 **하나도 추가하지 않는다**.

### Spring Security CSRF (선택)

CSRF를 활성화한다면 SecurityConfig에서 CookieCsrfTokenRepository를 사용하면 axios가 자동으로 토큰을 헤더에 실어 보낸다.

```java
http.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
    .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()));
```

`http.js`의 `getCsrfToken()`이 쿠키에서 자동으로 토큰을 꺼내 헤더에 넣는다.

---

## 4. 새 페이지 추가 워크플로우 (개정판)

기존 README의 4단계를 운영 환경에 맞춰 보완.

```
① pickeat-multi/notice.html               생성
② src/pages/notice/                       폴더 생성
   ├── main.js
   ├── NoticePage.vue
   └── style.css
③ vite.config.js의 input에 등록
④ AppHeader.vue의 menus 배열에 추가
⑤ (인증 필요 시) main.js에서 useAuthGuard 호출
⑥ (eGov 권한 필요 시) Spring SecurityConfig에 /notice.html 정책 추가
```

5번과 6번이 중요하다. 공공기관 시스템에서는 **페이지 추가 = 메뉴 권한 추가**가 늘 따라온다.

---

## 5. 페이지 분리 원칙 — 어디에 무엇을 둘 것인가

```
pages/{name}/                ← 그 페이지에서만 쓰는 것
  ├── main.js                  진입점
  ├── XxxPage.vue              페이지 컴포넌트 (페이지의 골격)
  └── style.css                페이지 전용 CSS

components/layout/           ← 모든 페이지가 공통으로 쓰는 레이아웃
  ├── AppHeader.vue
  └── AppFooter.vue

components/{domain}/         ← 특정 페이지만 쓰지만 페이지보다 작은 단위
  └── HeroSection.vue          (홈에서만 쓰는 컴포넌트)

components/common/           ← 여러 페이지에서 재사용되는 컴포넌트
  └── RecommendCard.vue        (홈, 추천, 맛집 리스트 모두 사용)

shared/                      ← Vue가 아닌 순수 로직·설정
  ├── api/                     백엔드 통신 모듈
  ├── stores/                  Pinia 스토어
  ├── composables/             재사용 훅 함수
  ├── config/                  환경변수 wrap
  ├── styles/                  CSS 변수, reset
  └── mock/                    mock 데이터
```

판단 기준:

- **페이지 단 1곳에서만 쓰는가?** → `pages/{name}/` 내부
- **2개 이상 페이지에서 쓰는가?** → `components/{domain or common}/`
- **Vue 컴포넌트가 아닌 순수 함수·상태·설정인가?** → `shared/`
- **3번 이상 반복되는 onMounted+ref 패턴인가?** → `shared/composables/`로 추출

---

## 6. 자주 하는 실수 (이 구조 한정)

1. **페이지 컴포넌트에서 axios 직접 import** → URL이 분산. 도메인별 API 모듈을 통해서만.
2. **`<RouterLink>` 사용 시도** → 이 프로젝트에 vue-router 의존성 없음. `<a href>` 사용.
3. **Pinia 스토어가 페이지 간에 자동 공유될 거라고 기대** → 페이지 새로고침 시 초기화. 영속이 필요하면 sessionStorage 백업.
4. **`window.history.pushState`로 페이지 이동 시도** → 다른 페이지의 JS 번들이 로드되지 않음. 페이지 이동은 `location.href` 또는 `<a href>`.
5. **`USE_MOCK = true`인 상태로 운영 빌드** → `.env.production` 도입으로 차단 가능.
6. **CSRF 미처리** → POST/PUT/DELETE에서 403. http.js 인터셉터가 자동 처리하도록.
7. **페이지마다 main.js에서 똑같은 보일러플레이트 반복** → 공통 부트 함수로 추출 고려:
   ```javascript
   // shared/bootstrap.js (확장 아이디어)
   export function bootstrap(component, options = {}) {
       const app = createApp(component, options.props);
       app.use(createPinia());
       app.mount('#app');
       return app;
   }
   ```

---

## 7. 다음 학습 단계

이 구조에서 자연스럽게 밟을 수 있는 다음 단계:

- **TypeScript 도입**: `<script setup lang="ts">`. VO 정의가 명확해진다.
- **Vitest** 단위 테스트 — composable과 store부터 테스트하기 좋다.
- **공통 부트 함수**(`bootstrap.js`)로 main.js 중복 제거
- **공통 에러 바운더리** 컴포넌트
- **i18n** (페이지마다 메시지 카탈로그 분리도 자연스러움)
- **Storybook** — 컴포넌트가 많으니 도입 효과 큼
- **SSE/WebSocket** 실시간 알림 (마이페이지 예약 상태 등)

---

이 가이드의 모든 파일은 기존 `pickeat-multi/` 프로젝트의 폴더 구조를 그대로 따른다.
원하는 스텝부터 점진적으로 도입할 수 있고, 한 번에 다 적용하지 않아도 된다.
