import { SystemStatus } from '../../features/system-status/SystemStatus';

export function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-brand-700">SurplusDrop</h1>
        <p className="text-base text-muted">
          Live price-dropping deals on surplus food near you. Coming soon.
        </p>
      </div>
      <SystemStatus />
    </div>
  );
}
