#!/usr/bin/env node
/**
 * scripts/deploy-to-egov.js — 안전 버전 (격리 배포 + 매니페스트 기반)
 *
 * 변경점
 * - webapp 루트가 아니라 webapp/pickeat/ 로 격리 배포
 * - 이전 배포 파일 목록을 .pickeat-manifest.json 에 기록
 * - 다음 배포 시 manifest에 있는 파일만 정확히 삭제 (eGov 자원 절대 안 건드림)
 *
 * 사용법
 *   npm run deploy:egov   ← 빌드 + 배포
 *   npm run deploy:dry    ← 무엇이 옮겨지는지만 출력
 *
 * 접속 URL
 *   http://localhost:8080/pickeat/index.html
 */
import { readdirSync, statSync, rmSync, mkdirSync, copyFileSync,
         existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

const WEBAPP = process.env.EGOV_WEBAPP_PATH
    || join(ROOT, '..', 'webapp');
const SUBDIR = process.env.EGOV_DEPLOY_SUBDIR || 'pickeat';
const TARGET = join(WEBAPP, SUBDIR);

const MANIFEST = join(WEBAPP, '.pickeat-manifest.json');

const args = process.argv.slice(2);
const DRY = args.includes('--dry');

if (!existsSync(DIST)) {
    console.error('❌ dist/ 폴더가 없습니다. npm run build 먼저 실행하세요.');
    process.exit(1);
}
if (!existsSync(WEBAPP)) {
    console.error(`❌ webapp 경로가 없습니다: ${WEBAPP}`);
    process.exit(1);
}

function loadManifest() {
    if (!existsSync(MANIFEST)) return [];
    try {
        const raw = readFileSync(MANIFEST, 'utf8');
        return JSON.parse(raw).files || [];
    } catch {
        return [];
    }
}

function cleanPrevious() {
    const prev = loadManifest();
    if (prev.length === 0) {
        console.log('🆕 첫 배포 (manifest 없음) — 정리 단계 스킵');
        return;
    }
    console.log(`🧹 이전 배포 파일 ${prev.length}개 정리`);
    for (const rel of prev) {
        const p = join(WEBAPP, rel);
        if (existsSync(p)) {
            console.log(`   - ${rel}`);
            if (!DRY) rmSync(p, { force: true });
        }
    }
}

const deployedFiles = [];

function copyRecursive(src, dst) {
    const stat = statSync(src);
    if (stat.isDirectory()) {
        if (!existsSync(dst) && !DRY) mkdirSync(dst, { recursive: true });
        for (const entry of readdirSync(src)) {
            copyRecursive(join(src, entry), join(dst, entry));
        }
    } else {
        const rel = relative(WEBAPP, dst);
        deployedFiles.push(rel.replace(/\\/g, '/'));
        console.log(`   + ${rel}`);
        if (!DRY) copyFileSync(src, dst);
    }
}

function deploy() {
    console.log(`📦 dist/ → ${TARGET}/ 복사`);
    if (!existsSync(TARGET) && !DRY) mkdirSync(TARGET, { recursive: true });
    copyRecursive(DIST, TARGET);
}

function saveManifest() {
    const data = {
        deployedAt: new Date().toISOString(),
        target: relative(WEBAPP, TARGET).replace(/\\/g, '/'),
        files: deployedFiles
    };
    console.log(`📝 manifest 갱신: .pickeat-manifest.json (${deployedFiles.length} files)`);
    if (!DRY) writeFileSync(MANIFEST, JSON.stringify(data, null, 2), 'utf8');
}

console.log('='.repeat(60));
console.log(`PickEat → eGov 배포${DRY ? ' [DRY RUN]' : ''}`);
console.log('  source: ' + DIST);
console.log('  webapp: ' + WEBAPP);
console.log('  target: ' + TARGET);
console.log('='.repeat(60));

cleanPrevious();
deploy();
saveManifest();

console.log('');
console.log('✅ 배포 완료');
console.log('');
console.log(`접속 URL: http://localhost:8080/${SUBDIR}/index.html`);