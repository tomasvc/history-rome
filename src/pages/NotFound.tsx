import { Link, useRouteError } from 'react-router-dom';

export default function NotFound({ error }: { error?: boolean }) {
  const err = useRouteError() as Error | undefined;
  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="kicker">{error ? 'Something went wrong' : 'Not found'}</p>
        <h1>{error ? 'This page could not be displayed' : 'There is no record of this page'}</h1>
        <p className="lede">
          {error
            ? 'An error stopped this page from rendering. Your notes and progress are safe in this browser.'
            : 'The address may be mistyped, or the item may have been renamed. Search the archive or return to the course.'}
        </p>
      </header>
      {error && err?.message && <pre className="ui small">{err.message}</pre>}
      <div className="row">
        <Link className="btn primary" to="/course">
          Go to the course
        </Link>
        <Link className="btn" to="/">
          Home
        </Link>
      </div>
    </div>
  );
}
