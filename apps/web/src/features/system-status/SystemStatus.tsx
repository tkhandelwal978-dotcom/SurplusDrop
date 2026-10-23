import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../../lib/api-client';
import { errorCopy, networkErrorCopy, offlineCopy, type ErrorCopy } from '../../lib/errors';
import { queryKeys } from '../../lib/query-keys';
import { useOnlineStatus } from '../../lib/use-online-status';
import { fetchReadiness } from './api';

const REFRESH_MS = 10_000;

function Notice({
  tone,
  title,
  body,
}: {
  tone: 'ok' | 'warn' | 'error';
  title: string;
  body: string;
}) {
  const toneClass = {
    ok: 'border-success text-success',
    // accent-500 is ~2.6:1 on white, below WCAG AA for text: use it for the border only.
    warn: 'border-accent-500 text-ink',
    error: 'border-danger text-danger',
  }[tone];
  return (
    <div className={`rounded-card border-l-4 bg-surface p-4 ${toneClass}`}>
      <p className="text-base font-bold">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  );
}

function copyFor(error: unknown): ErrorCopy {
  return error instanceof ApiError ? errorCopy[error.code] : networkErrorCopy;
}

/** Shows whether the API and its dependencies are up. First real screen: proves web → API → DB/Redis. */
export function SystemStatus() {
  const online = useOnlineStatus();
  const query = useQuery({
    queryKey: queryKeys.system.readiness,
    queryFn: ({ signal }) => fetchReadiness(signal),
    refetchInterval: REFRESH_MS,
  });

  return (
    <section aria-labelledby="system-status-title" className="flex flex-col gap-2">
      <h2 id="system-status-title" className="text-sm font-medium text-muted">
        System status
      </h2>
      <div role="status" aria-live="polite">
        {!online ? (
          <Notice tone="warn" title={offlineCopy.message} body={offlineCopy.action} />
        ) : query.isPending ? (
          <div className="h-18 rounded-card bg-brand-50 motion-safe:animate-pulse">
            <span className="sr-only">Checking the API…</span>
          </div>
        ) : query.isError ? (
          <Notice
            tone="error"
            title={copyFor(query.error).message}
            body={copyFor(query.error).action}
          />
        ) : query.data.status === 'ok' ? (
          <Notice tone="ok" title="API: ok" body="Server, database and cache are all reachable." />
        ) : (
          <Notice
            tone="warn"
            title="API: degraded"
            body={`Not reachable: ${Object.entries(query.data.checks)
              .filter(([, status]) => status === 'fail')
              .map(([name]) => name)
              .join(', ')}`}
          />
        )}
      </div>
    </section>
  );
}
