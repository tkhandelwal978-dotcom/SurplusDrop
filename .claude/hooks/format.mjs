// PostToolUse (Edit|Write|MultiEdit): format and lint-fix the file Claude just changed. Never blocks.
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { readInput } from './_read-input.mjs';

const input = await readInput();
const file = input?.tool_input?.file_path;
if (!file || !existsSync(file)) process.exit(0);

const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const shell = process.platform === 'win32';
if (/\.(ts|tsx|js|jsx|json|md|css|ya?ml)$/.test(file)) {
  spawnSync('pnpm', ['exec', 'prettier', '--write', file], { cwd, stdio: 'ignore', shell });
}
if (/\.(ts|tsx)$/.test(file)) {
  spawnSync('pnpm', ['exec', 'eslint', '--fix', file], { cwd, stdio: 'ignore', shell });
}
process.exit(0);
