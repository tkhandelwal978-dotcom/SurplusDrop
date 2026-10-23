import { Link } from 'react-router';
import { errorCopy } from '../lib/errors';

export function NotFoundPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{errorCopy.NOT_FOUND.message}</h1>
      <p className="text-muted">This page doesn’t exist.</p>
      <Link to="/" className="font-medium text-brand-700 underline underline-offset-4">
        Go to home
      </Link>
    </div>
  );
}
