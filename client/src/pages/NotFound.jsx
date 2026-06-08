import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
    <div className="max-w-md text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-ink">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you are looking for is not available.</p>
      <Link
        className="focus-ring mt-6 inline-flex rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white"
        to="/dashboard"
      >
        Back to dashboard
      </Link>
    </div>
  </main>
);

export default NotFound;

