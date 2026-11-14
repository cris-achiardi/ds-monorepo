import { it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

it('checks every rename syntax while preserving skill names and its own rules', () => {
  const root = mkdtempSync(join(tmpdir(), 'ds-rename-check-'));
  try {
    mkdirSync(join(root, 'scripts'));
    copyFileSync(join(REPO_ROOT, 'scripts/init-ds.mjs'), join(root, 'scripts/init-ds.mjs'));
    writeFileSync(join(root, 'ds.config.json'), JSON.stringify({ name: 'branded' }));
    const legacy = ['d', 's'].join('');
    const run = () =>
      spawnSync(process.execPath, [join(root, 'scripts/init-ds.mjs'), '--check'], {
        encoding: 'utf8',
      });
    // A skill name is agent tooling, not the brand, and must not count as a straggler.
    writeFileSync(join(root, 'example.md'), `${legacy}-decide`);
    expect(run().status).toBe(0);
    for (const text of [`@${legacy}/react`, `--${legacy}-color-fill`, `data-${legacy}-part`]) {
      writeFileSync(join(root, 'example.md'), text);
      const result = run();
      expect(result.status, text).toBe(1);
      expect(result.stderr).toContain('example.md');
    }
  } finally {
    // mkdtemp creates this dedicated test directory under the OS temp root.
    rmSync(root, { recursive: true, force: true });
  }
});
