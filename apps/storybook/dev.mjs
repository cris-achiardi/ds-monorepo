#!/usr/bin/env node
/**
 * `pnpm dev:storybook` — start Storybook on STORYBOOK_PORT, defaulting to 6006.
 *
 * A launcher rather than an inline `-p` flag reading the variable in package.json, because pnpm
 * runs scripts through cmd.exe on Windows, where POSIX variable expansion is not available.
 */
import { spawn } from 'node:child_process';

const port = process.env.STORYBOOK_PORT || '6006';
if (!/^\d+$/.test(port)) {
  console.error(`STORYBOOK_PORT must be a number, got "${port}".`);
  process.exit(1);
}

const child = spawn('storybook', ['dev', '-p', port, ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
child.on('exit', (code) => process.exit(code ?? 1));
