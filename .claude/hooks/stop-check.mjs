// Stop: before Claude reports "done", run typecheck + affected unit tests if TS files changed.
import { spawnSync } from 'node:child_process';
import { readInput, block } from './_read-input.mjs';

const input = await readInput();
if (input?.stop_hook_active) process.exit(0); // already blocked once this cycle: avoid loops

const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const shell = process.platform === 'win32';
const run = (cmd, args) => spawnSync(cmd, args, { cwd, encoding: 'utf8', shell });

const status = run('git', ['status', '--porcelain', '--', '*.ts', '*.tsx']);
if (!status.stdout?.trim()) process.exit(0);

const tail = (s, n) => (s || '').split('\n').slice(-n).join('\n');
const tc = run('pnpm', ['-s', 'typecheck']);
if (tc.status !== 0) block('Typecheck failed. Fix these errors before finishing:\n' + tail(tc.stdout + tc.stderr, 40));
const ut = run('pnpm', ['-s', 'turbo', 'run', 'test:unit', '--affected']);
if (ut.status !== 0) block('Unit tests failed. Fix them (never skip or weaken tests) before finishing:\n' + tail(ut.stdout + ut.stderr, 60));
process.exit(0);
