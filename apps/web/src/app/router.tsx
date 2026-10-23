import { createBrowserRouter } from 'react-router';
import { HomePage } from '../pages/buyer/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RootLayout } from './RootLayout';
import { RouteError } from './RouteError';

// Route groups follow apps/web/CLAUDE.md: pages/buyer, pages/seller (/seller), pages/admin (/admin).
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
