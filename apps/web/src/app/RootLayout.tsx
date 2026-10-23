import { Outlet } from 'react-router';

export function RootLayout() {
  return (
    <div className="min-h-dvh bg-canvas">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
