// Shared helper: read the hook JSON payload that Claude Code sends on stdin.
export async function readInput() {
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  try { return JSON.parse(data || '{}'); } catch { return {}; }
}
export function block(message) {
  // Exit code 2 blocks the action and shows stderr to Claude.
  process.stderr.write(message + '\n');
  process.exit(2);
}
