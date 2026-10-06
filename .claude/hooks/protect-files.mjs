// PreToolUse (Edit|Write|MultiEdit): block edits to secrets, lockfiles, git internals and merged migrations.
import { existsSync } from 'node:fs';
import path from 'node:path';
import { readInput, block } from './_read-input.mjs';

const input = await readInput();
const file = input?.tool_input?.file_path;
if (!file) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const rel = path.relative(root, path.resolve(root, file)).split(path.sep).join('/');
const base = path.posix.basename(rel);

if ((base === '.env' || base.startsWith('.env.')) && base !== '.env.example') {
  block(`Blocked: ${rel} holds secrets. Edit .env.example instead and ask the engineer to update .env.`);
}
if (base === 'pnpm-lock.yaml') block('Blocked: never edit the lockfile by hand. Use pnpm add/remove.');
if (rel.startsWith('.git/')) block('Blocked: do not touch .git internals.');
if (rel.startsWith('packages/db/migrations/') && existsSync(path.resolve(root, file))) {
  block(`Blocked: ${rel} already exists. Merged migrations are immutable — create a new one with /new-migration.`);
}
process.exit(0);
