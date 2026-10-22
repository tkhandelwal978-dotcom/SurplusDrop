// PreToolUse (Edit|Write|MultiEdit): block edits to secrets, lockfiles, git internals and merged migrations.
import { spawnSync } from 'node:child_process';
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
if (rel.startsWith('packages/db/migrations/')) {
  // "Merged" means the file exists on main (local or remote-tracking). Files that exist only on the
  // current branch stay editable, which custom migrations (drizzle-kit generate --custom) need.
  // If git cannot answer, fall back to the strict rule: any existing file is locked.
  const git = (args) => spawnSync('git', args, { cwd: root, stdio: 'ignore' }).status === 0;
  const onMain = (ref) => git(['cat-file', '-e', `${ref}:${rel}`]);
  const gitWorks = git(['rev-parse', '--verify', '--quiet', 'main']);
  const merged = gitWorks
    ? onMain('main') || onMain('origin/main')
    : existsSync(path.resolve(root, file));
  if (merged) {
    block(`Blocked: ${rel} is already on main. Merged migrations are immutable — create a new one with /new-migration.`);
  }
}
process.exit(0);
