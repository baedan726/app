#!/usr/bin/env node
/**
 * scripts/deploy-to-egov.js — 빌드 산출물을 같은 프로젝트의 webapp/로 복사
 *
 * 위치 가정
 *   app/                          ← eGov 프로젝트 루트
 *     ├ src/main/webapp/          ← 배포 대상
 *     └ src/main/frontend/        ← 이 스크립트가 있는 곳 (Vite 루트)
 *           └ scripts/
 *               └ deploy-to-egov.js
 *
 * 사용법
 *   npm run deploy:egov           ← vite build + 자동 복사
 *   npm run deploy:dry            ← 복사 없이 무엇이 옮겨질지만 출력
 *
 *   다른 위치로 복사하려면 환경변수로 덮어쓰기:
 *     EGOV_WEBAPP_PATH=/other/path node scripts/deploy-to-egov.js
 *
 * 안전장치
 *   - WEB-INF, META-INF, *.jsp는 절대 삭제·덮어쓰기 안 함
 *   - 정리 대상은 *.html, /js, /css, /images, /fonts, /assets 만
 *   - --dry 옵션으로 사전 확인
 */
import { readdirSync, statSync, rmSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');                 // = src/main/frontend/
const DIST = join(ROOT, 'dist');

// 기본 대상: 같은 프로젝트의 webapp (../webapp)
const DEFAULT_TARGET = join(ROOT, '..', 'webapp');

// ----- 옵션 파싱 -----
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const TARGET = process.env.EGOV_WEBAPP_PATH
    || args.find((a) => !a.startsWith('--'))
    || DEFAULT_TARGET;

if (!existsSync(DIST)) {
    console.error('❌ dist/ 폴더가 없습니다. 먼저 npm run build 실행하세요.');
    process.exit(1);
}

if (!existsSync(TARGET)) {
    console.error(`❌ 대상 경로가 존재하지 않습니다: ${TARGET}`);
    process.exit(1);
}

// ----- 보호 대상 -----
const PROTECTED = new Set(['WEB-INF', 'META-INF']);
function isProtected(name) {
    return PROTECTED.has(name) || name.endsWith('.jsp') || name.startsWith('.');
}

// ----- 기존 빌드 산출물 정리 -----
const CLEAN_DIRS = ['js', 'css', 'images', 'fonts', 'assets'];

function cleanTarget() {
    console.log(`🧹 기존 산출물 정리: ${TARGET}`);

    // 1) 정리 대상 디렉토리
    for (const d of CLEAN_DIRS) {
        const p = join(TARGET, d);
        if (existsSync(p)) {
            console.log(`   - rmdir ${d}/`);
            if (!DRY) rmSync(p, { recursive: true, force: true });
        }
    }

    // 2) 루트의 *.html (jsp는 보호)
    const entries = readdirSync(TARGET);
    for (const name of entries) {
        if (isProtected(name)) continue;
        if (!name.endsWith('.html')) continue;
        const p = join(TARGET, name);
        console.log(`   - rm ${name}`);
        if (!DRY) rmSync(p, { force: true });
    }
}

// ----- dist/ → target/ 재귀 복사 -----
function copyRecursive(src, dst) {
    const stat = statSync(src);
    if (stat.isDirectory()) {
        if (!existsSync(dst) && !DRY) mkdirSync(dst, { recursive: true });
        for (const entry of readdirSync(src)) {
            copyRecursive(join(src, entry), join(dst, entry));
        }
    } else {
        const rel = relative(DIST, src);
        console.log(`   + ${rel}`);
        if (!DRY) copyFileSync(src, dst);
    }
}

function deploy() {
    console.log(`📦 dist/ → ${TARGET}/ 복사`);
    copyRecursive(DIST, TARGET);
}

// ----- 실행 -----
console.log('='.repeat(60));
console.log(`PickEat → eGov 배포${DRY ? ' [DRY RUN]' : ''}`);
console.log('  source: ' + DIST);
console.log('  target: ' + TARGET);
console.log('='.repeat(60));

cleanTarget();
deploy();

console.log('');
console.log('✅ 배포 완료');
console.log('');
console.log('확인 사항:');
console.log('  1. eGov 프로젝트 webapp 폴더에 5개 HTML과 js/, css/ 폴더 생성됐는지');
console.log('  2. WEB-INF, META-INF, *.jsp는 그대로 보존됐는지');
console.log('  3. Eclipse 프로젝트 새로고침(F5) 후 톰캣 재시작');
