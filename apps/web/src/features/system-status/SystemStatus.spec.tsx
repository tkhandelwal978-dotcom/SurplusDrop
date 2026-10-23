import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SystemStatus } from './SystemStatus';

function renderStatus() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <SystemStatus />
    </QueryClientProvider>,
  );
}

function respondWith(status: number, body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve(new Response(JSON.stringify(body), { status }))),
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('<SystemStatus />', () => {
  it('shows a loading placeholder first', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    );
    renderStatus();
    expect(screen.getByText('Checking the API…')).toBeDefined();
  });

  it('shows ok when every check passes', async () => {
    respondWith(200, { status: 'ok', checks: { db: 'ok', redis: 'ok' } });
    renderStatus();
    expect(await screen.findByText('API: ok')).toBeDefined();
  });

  it('names the failing dependency when the API is degraded', async () => {
    respondWith(503, { status: 'fail', checks: { db: 'ok', redis: 'fail' } });
    renderStatus();
    expect(await screen.findByText('API: degraded')).toBeDefined();
    expect(screen.getByText('Not reachable: redis')).toBeDefined();
  });

  it('shows the network error copy when the API cannot be reached', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))),
    );
    renderStatus();
    expect(await screen.findByText('Can’t reach SurplusDrop right now.')).toBeDefined();
  });

  it('shows the offline state when the browser has no connection', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    );
    renderStatus();
    expect(screen.getByText('You’re offline.')).toBeDefined();
  });
});
