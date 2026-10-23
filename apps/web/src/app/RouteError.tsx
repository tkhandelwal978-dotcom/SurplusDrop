import { errorCopy } from '../lib/errors';

/** Shown when a route crashes while rendering, instead of a blank white page. */
export function RouteError() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8" role="alert">
      <h1 className="text-2xl font-bold">{errorCopy.INTERNAL.message}</h1>
      <p className="text-muted">{errorCopy.INTERNAL.action}</p>
      <a href="/" className="font-medium text-brand-700 underline underline-offset-4">
        Reload home
      </a>
    </main>
  );
}
