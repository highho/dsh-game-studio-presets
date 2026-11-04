#!/usr/bin/env node
/**
 * 安装 / 卸载「游戏工作室」预设包。
 *
 *   node install.mjs            安装：把 skills/ 部署到技能目录
 *   node install.mjs --uninstall 卸载：移除已部署的技能
 *   node install.mjs --dry-run  只报告将要做什么
 *
 * 部署目标默认为 ~/.dsh/game-studio-skills，可用环境变量 DSH_GAME_SKILLS 覆盖
 * （与 cordis.patch.yml 中 customSkillDirs 的解析规则完全一致）。
 */
import { cp, rm, readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, 'skills');

// 与 cordis.patch.yml 保持一致：DSH_GAME_SKILLS 优先，否则 ~/.dsh/game-studio-skills
const DEST = process.env.DSH_GAME_SKILLS
  ? resolve(process.env.DSH_GAME_SKILLS)
  : join(homedir(), '.dsh', 'game-studio-skills');

const args = new Set(process.argv.slice(2));
const uninstall = args.has('--uninstall');
const dryRun = args.has('--dry-run');

async function main() {
  if (!existsSync(SRC)) {
    console.error(`✗ 找不到技能目录：${SRC}`);
    process.exit(1);
  }

  const buckets = (await readdir(SRC, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  // 统计每个桶里的技能数，便于确认部署完整
  const counts = {};
  for (const b of buckets) {
    const dirs = await readdir(join(SRC, b), { withFileTypes: true });
    let n = 0;
    for (const d of dirs) {
      if (!d.isDirectory()) continue;
      if (existsSync(join(SRC, b, d.name, 'SKILL.md'))) n++;
    }
    counts[b] = n;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  console.log(`技能桶 ${buckets.length} 个 / 技能 ${total} 个`);
  for (const b of buckets) console.log(`  ${b.padEnd(8)} ${counts[b]}`);
  console.log(`\n源目录   ${SRC}`);
  console.log(`部署到   ${DEST}`);

  if (uninstall) {
    if (dryRun) { console.log('\n[dry-run] 将删除上述目录'); return; }
    if (!existsSync(DEST)) { console.log('\n目标不存在，无需卸载。'); return; }
    await rm(DEST, { recursive: true, force: true });
    console.log('\n✓ 已移除部署的技能目录。');
    console.log('  （预设本体仍在 profile 里，如需一并移除请用 plugin_manager remove_bundle）');
    return;
  }

  if (dryRun) { console.log('\n[dry-run] 将把 skills/ 复制到上述目录'); return; }

  // 逐桶覆盖复制，保留目标目录里其他来路的技能
  for (const b of buckets) {
    await cp(join(SRC, b), join(DEST, b), { recursive: true, force: true });
  }
  console.log('\n✓ 技能已部署。');

  // 回读确认
  let ok = 0;
  for (const b of buckets) {
    const dirs = await readdir(join(DEST, b), { withFileTypes: true }).catch(() => []);
    for (const d of dirs) {
      if (existsSync(join(DEST, b, d.name, 'SKILL.md'))) ok++;
    }
  }
  console.log(`  回读校验：${ok}/${total} 个 SKILL.md 就位`);
  if (ok !== total) { console.error('✗ 部署不完整'); process.exit(1); }

  console.log(`\n下一步：重启 DeepSeek Harness，在「新建会话」里选择预设（如「游戏工作室 · 总控」）。
技能改动需新建会话才会生效；已有会话沿用启动时的版本。`);
}

main().catch((e) => { console.error(e); process.exit(1); });
