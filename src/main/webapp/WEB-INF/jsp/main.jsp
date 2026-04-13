<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TripMate | 여행 플랫폼 팀 프로젝트</title>
  <link rel="stylesheet" href="<c:url value='/css/main.css'/>">
</head>
<body>

  <!-- ══ NAVBAR ══ -->
  <nav class="navbar">
    <a href="<c:url value='/main.do'/>" class="nav-logo">
      <div class="nav-logo-icon">✈️</div>
      TripMate
    </a>
    <ul class="nav-links">
      <li><a href="#team">팀 소개</a></li>
      <li><a href="#features">기능 소개</a></li>
      <li><a href="<c:url value='/uat/uia/egovLoginUsr.do'/>" class="nav-login">🔑 로그인</a></li>
    </ul>
  </nav>

  <!-- ══ HERO ══ -->
  <section class="hero">
    <div class="deco-circle dc1"></div>
    <div class="deco-circle dc2"></div>
    <div class="deco-circle dc3"></div>
    <span class="float-deco fd1">🌴</span>
    <span class="float-deco fd2">🗺️</span>
    <span class="float-deco fd3">⭐</span>
    <span class="float-deco fd4">🧳</span>

    <div class="hero-content">
      <div class="hero-badge">🎓 학원 팀 프로젝트 · 2025</div>

      <h1>
        세상의 모든<br>
        <span class="c-ocean">여행</span>을<br>
        <span class="c-coral">담다</span>
      </h1>

      <p class="hero-sub">
        여행지 정보 검색부터 일정 관리, 후기 공유까지!
        3인 개발팀이 eGovFramework로 함께 만들어가는
        여행 플랫폼 프로젝트입니다. 🌏
      </p>

      <div class="hero-btns">
        <a href="#team" class="btn-primary">
          👋 팀원 만나기
        </a>
        <a href="<c:url value='/uat/uia/egovLoginUsr.do'/>" class="btn-secondary">
          🔑 로그인하기
        </a>
      </div>

      <div class="hero-pills">
        <div class="pill"><span class="pill-icon">👥</span> 3인 팀 개발</div>
        <div class="pill"><span class="pill-icon">🛠️</span> eGovFramework</div>
        <div class="pill"><span class="pill-icon">🗄️</span> Oracle DB</div>
        <div class="pill"><span class="pill-icon">☕</span> Spring MVC</div>
      </div>
    </div>
  </section>

  <!-- ══ TEAM ══ -->
  <div class="section" id="team">
    <div class="team-header reveal">
      <div>
        <div class="section-eyebrow">✈️ Our Team</div>
        <h2>팀원을 소개합니다</h2>
        <p class="section-desc">각자의 역할로 함께 만들어가는 여행 플랫폼 개발팀이에요!</p>
      </div>
    </div>

    <div class="members-grid">

      <!-- Member 1 -->
      <a class="member-card reveal reveal-d1" href="<c:url value='/members/member1/intro.jsp'/>">
        <div class="card-top">
          <div class="member-avatar">💻</div>
          <div class="member-info">
            <div class="member-num">01 · 팀장</div>
            <div class="member-name">김민준</div>
            <span class="member-role">Back-End Lead</span>
          </div>
        </div>
        <p class="member-bio">
          서버와 DB 설계를 담당하는 팀장!
          Spring MVC와 Oracle을 잘 다루고
          팀의 든든한 기술 리더예요. 🚀
        </p>
        <div class="member-tags">
          <span class="tag">Java</span>
          <span class="tag">Spring MVC</span>
          <span class="tag">Oracle</span>
        </div>
        <div class="card-arrow">→</div>
      </a>

      <!-- Member 2 -->
      <a class="member-card reveal reveal-d2" href="<c:url value='/members/member2/intro.jsp'/>">
        <div class="card-top">
          <div class="member-avatar">🎨</div>
          <div class="member-info">
            <div class="member-num">02 · 팀원</div>
            <div class="member-name">이서연</div>
            <span class="member-role">UI / Front-End</span>
          </div>
        </div>
        <p class="member-bio">
          예쁜 화면을 만드는 프론트 담당!
          Figma로 디자인하고 JSP/CSS로
          감각 있게 구현해요. 🎯
        </p>
        <div class="member-tags">
          <span class="tag">HTML/CSS</span>
          <span class="tag">JSP</span>
          <span class="tag">Figma</span>
        </div>
        <div class="card-arrow">→</div>
      </a>

      <!-- Member 3 -->
      <a class="member-card reveal reveal-d3" href="<c:url value='/members/member3/intro.jsp'/>">
        <div class="card-top">
          <div class="member-avatar">🗄️</div>
          <div class="member-info">
            <div class="member-num">03 · 팀원</div>
            <div class="member-name">박지호</div>
            <span class="member-role">DB Engineer</span>
          </div>
        </div>
        <p class="member-bio">
          데이터 흐름을 책임지는 DB 전문가!
          복잡한 쿼리도 척척, MyBatis 매핑
          설계를 맡고 있어요. 📊
        </p>
        <div class="member-tags">
          <span class="tag">Oracle SQL</span>
          <span class="tag">MyBatis</span>
          <span class="tag">쿼리 최적화</span>
        </div>
        <div class="card-arrow">→</div>
      </a>

    </div>
  </div>

  <!-- ══ FEATURES ══ -->
  <div class="features-bg" id="features">
    <div class="section">
      <div class="reveal">
        <div class="section-eyebrow">🗺️ Features</div>
        <h2>주요 기능</h2>
        <p class="section-desc">TripMate가 제공하는 여행 서비스들이에요!</p>
      </div>
      <div class="features-grid">
        <div class="feat-card reveal reveal-d1">
          <span class="feat-icon">🔍</span>
          <div class="feat-title">여행지 검색</div>
          <p class="feat-desc">국내외 여행지 정보를 키워드로 빠르게 검색하고 상세 정보를 확인할 수 있어요.</p>
        </div>
        <div class="feat-card reveal reveal-d2">
          <span class="feat-icon">📅</span>
          <div class="feat-title">일정 관리</div>
          <p class="feat-desc">여행 일정을 날짜별로 등록하고 관리할 수 있는 개인 플래너 기능이에요.</p>
        </div>
        <div class="feat-card reveal reveal-d3">
          <span class="feat-icon">✍️</span>
          <div class="feat-title">후기 게시판</div>
          <p class="feat-desc">다녀온 여행지의 생생한 후기를 사진과 함께 공유하고 소통해요.</p>
        </div>
        <div class="feat-card reveal reveal-d1">
          <span class="feat-icon">❤️</span>
          <div class="feat-title">찜 목록</div>
          <p class="feat-desc">마음에 드는 여행지를 찜해두고 나만의 버킷리스트를 만들어보세요.</p>
        </div>
        <div class="feat-card reveal reveal-d2">
          <span class="feat-icon">👤</span>
          <div class="feat-title">회원 관리</div>
          <p class="feat-desc">eGov 표준 인증 기반의 회원가입, 로그인, 마이페이지 기능이에요.</p>
        </div>
        <div class="feat-card reveal reveal-d3">
          <span class="feat-icon">📊</span>
          <div class="feat-title">통계 & 관리자</div>
          <p class="feat-desc">관리자 페이지에서 여행지별 조회수, 후기 수 등 통계를 확인해요.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ══ 개발자 도구 ══ -->
  <div class="devtools-wrap">
    <div class="section devtools-section reveal">
      <div class="section-eyebrow">🛠️ Dev Tools</div>
      <h2>개발자 도구</h2>
      <p class="section-desc">프로젝트 개발에 필요한 문서와 자료를 모아뒀어요!</p>

      <div class="devtools-cards">

        <a href="/app/guide/team-dev-manual.html" class="devtool-card devtool-blue">
          <div class="dt-icon-wrap dt-blue-icon">📘</div>
          <div class="dt-body">
            <div class="dt-title">개발 환경 설정 가이드</div>
            <div class="dt-sub">eGov · Vue · MySQL · Git</div>
          </div>
          <div class="dt-arrow">→</div>
        </a>

        <a href="/app/guide/travel_storyboard_v3 (1).html" class="devtool-card devtool-green">
          <div class="dt-icon-wrap dt-green-icon">🗂️</div>
          <div class="dt-body">
            <div class="dt-title">스토리보드</div>
            <div class="dt-sub">화면 설계 · 기능 목록 · UI 흐름</div>
          </div>
          <div class="dt-arrow">→</div>
        </a>

      </div>
    </div>
  </div>

  <!-- ══ LOGIN CTA ══ -->
  <div class="login-cta">
    <div class="login-cta-inner reveal">
      <div class="login-cta-text">
        <h3>지금 바로 시작해볼까요? 🌍</h3>
        <p>로그인하고 나만의 여행 플랜을 만들어보세요.<br>eGovFramework 기반 표준 인증 시스템이에요.</p>
      </div>
      <a href="<c:url value='/uat/uia/egovLoginUsr.do'/>" class="btn-login-white">
        🔑 로그인하러 가기
      </a>
    </div>
  </div>

  <!-- ══ FOOTER ══ -->
  <footer>
    <div class="footer-inner">
      <a href="<c:url value='/main.do'/>" class="footer-logo">✈️ TripMate</a>
      <ul class="footer-links">
        <li><a href="#team">팀 소개</a></li>
        <li><a href="#features">기능 소개</a></li>
        <li><a href="<c:url value='/uat/uia/egovLoginUsr.do'/>">로그인</a></li>
      </ul>
      <span class="footer-copy">© 2025 TripMate Team · eGovFramework 팀 프로젝트</span>
    </div>
  </footer>

  <script>
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  </script>

</body>
</html>
