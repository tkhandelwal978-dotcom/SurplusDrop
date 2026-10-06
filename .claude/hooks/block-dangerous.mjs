// PreToolUse (Bash): block destructive or risky shell commands.
import { readInput, block } from './_read-input.mjs';

const input = await readInput();
const cmd = input?.tool_input?.command ?? '';
if (!cmd) process.exit(0);

const rules = [
  [/\brm\s+-[a-z]*r[a-z]*\s+(\/|~|\*|\$HOME|\.\/?\s*$|\.\.)/i, 'recursive delete of a root, home, parent or wildcard path'],
  [/\bgit\s+push\b.*(--force|--force-with-lease|\s-f\b)/, 'force push'],
  [/\bgit\s+push\b.*\s(main|master)\b/, 'direct push to main'],
  [/\bgit\s+(reset\s+--hard|clean\s+-[a-z]*f)/, 'destructive git reset/clean'],
  [/\b(drop\s+(table|database|schema)|truncate\s+table)\b/i, 'destructive SQL'],
  [/\b(curl|wget)\b[^|]*\|\s*(sudo\s+)?(ba|z)?sh\b/, 'piping a download into a shell'],
  [/(^|[\s;&|])(npm|yarn)\s+(i|install|add)\b/, 'npm/yarn install (this repo uses pnpm)'],
  [/\b(cat|less|more|type|Get-Content)\b[^|;&]*\.env(\s|$|[;&|])/, 'printing .env secrets'],
];
for (const [re, why] of rules) {
  if (re.test(cmd)) block(`Blocked command (${why}). Ask the engineer to run it manually if it is really needed.`);
}
process.exit(0);
