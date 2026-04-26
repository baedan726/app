# 정리 — 흩어진 파일 모으는 작업 순서

> 현재 상태: app/ 루트에 `pages/`, `shared/`, `package.json`, `INTEGRATION_GUIDE.md`가 잘못 떨어져 있고, `src/main/frontend/`는 비어 있음.
> 목표: 이 frontend 폴더 하나로 통일.

---

## 1단계 — 잘못 떨어진 파일 정리

Eclipse 또는 Windows 탐색기에서 **app/ 프로젝트 루트**의 다음 폴더·파일을 **삭제** 하세요. (이 zip에 다 들어있어서 안전합니다)

- `app/pages/`
- `app/shared/`
- `app/package.json`
- `app/INTEGRATION_GUIDE.md`

`pom.xml`, `Jenkinsfile`, `README.md`, `Dockerfile` 같은 건 **건드리지 마세요**. 그건 백엔드 파일입니다.

---

## 2단계 — webapp/vue 정리 (선택)

`src/main/webapp/vue/` 안에 학습용으로 만든 5개 HTML이 있을 텐데, 이 폴더는 **이제 안 씁니다**. 빌드 결과가 `webapp/` 루트에 직접 떨어지기 때문.

비우거나 폴더째 삭제하셔도 됩니다. 단, 다른 학습용 자료가 섞여 있으면 신중하게.

---

## 3단계 — frontend 폴더 통째로 배치

이 zip의 **`frontend/` 폴더 전체**를 `app/src/main/frontend/`로 **그대로 복사**.

복사 후 구조:

```
app/src/main/frontend/
├── package.json
├── vite.config.js
├── index.html
├── recommend.html
├── restaurants.html
├── reviews.html
├── mypage.html
├── .env.development
├── .env.production
├── .gitignore
├── README.md
├── INTEGRATION_GUIDE.md
├── SETUP.md                          ← 이 문서
├── public/
├── src/
│   ├── pages/
│   ├── components/
│   └── shared/
│       ├── api/
│       ├── composables/              ← ★ 새로 추가됨
│       ├── config/                   ← ★ 새로 추가됨
│       ├── mock/
│       ├── stores/
│       └── styles/
└── scripts/                          ← ★ 새로 추가됨
    └── deploy-to-egov.js
```

---

## 4단계 — npm 설치 및 실행

Eclipse는 npm을 직접 못 다루니까 **터미널/명령프롬프트**에서:

```bash
cd C:\path\to\app\src\main\frontend
npm install                         # 최초 1회만
npm run dev                         # http://localhost:3000 으로 개발 시작
```

`npm install`은 시간이 좀 걸립니다 (Vue, Vite, axios, Pinia 받아옴).

---

## 5단계 — Eclipse에서 node_modules 무시 설정

Eclipse가 `node_modules` 안의 수많은 파일을 인덱싱하면 굉장히 느려집니다. 다음 중 하나로 처리:

**방법 A** — Eclipse Resource Filter
1. `src/main/frontend` 폴더 우클릭 → Properties
2. Resource Filters → Add Filter
3. Filter type: Exclude all, Files and folders
4. Filter pattern: `node_modules` 입력 → OK
5. `dist`, `.vite`도 같은 방법으로 추가

**방법 B** — `.gitignore`에만 추가하고 Eclipse는 그냥 두기 (이미 .gitignore에 들어있음)

---

## 6단계 — 빌드 → eGov 배포 테스트

```bash
cd src/main/frontend
npm run deploy:dry                  # 무엇이 옮겨질지 미리 보기
npm run deploy:egov                 # 실제 빌드 + 복사
```

`deploy:egov` 실행 후 `app/src/main/webapp/`에 다음이 생성됨:

```
src/main/webapp/
├── (기존) WEB-INF/, common/, css/, images/, js/, index.jsp ...
├── (추가) index.html, recommend.html, restaurants.html, reviews.html, mypage.html
├── (추가) js/   ← Vite가 빌드한 JS
├── (추가) css/  ← Vite가 빌드한 CSS
└── (추가) images/, fonts/, assets/ (있으면)
```

WEB-INF, META-INF, *.jsp는 **절대 안 건드림** (스크립트가 보호).

---

## 7단계 — eGov 톰캣 재시작 후 확인

Eclipse에서 프로젝트 새로고침(F5) → 톰캣 재시작 →
브라우저로 `http://localhost:8080/index.html` 접속.

기존 eGov 화면이 아니라 PickEat 홈이 떠야 정상.

---

## 작업 흐름 (이후)

```bash
# ① 화면 작업할 때
cd src/main/frontend
npm run dev              # http://localhost:3000 (HMR 즉시 반영)

# ② eGov에 반영할 때
npm run deploy:egov      # 빌드 + webapp 복사

# ③ 백엔드 작업
Eclipse에서 평소대로 Java 수정 → 톰캣 재시작
```

dev 모드(3000)와 톰캣(8080)은 같이 띄워두세요. Vite 프록시가 `/api` 요청을 자동으로 8080으로 보냅니다.

---

## 한 줄 정리

> **app 루트에 흩어진 4개 항목 삭제 → 이 frontend 폴더를 src/main/frontend/에 통째로 복사 → npm install → 끝**
