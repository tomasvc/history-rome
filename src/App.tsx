import { lazy, Suspense } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import CoursePage from './pages/Course';
import ModulePage from './pages/Module';
import LessonPage from './pages/Lesson';
import NotFound from './pages/NotFound';

const Timeline = lazy(() => import('./pages/Timeline'));
const Atlas = lazy(() => import('./pages/Atlas'));
const People = lazy(() => import('./pages/People'));
const Person = lazy(() => import('./pages/Person'));
const Sources = lazy(() => import('./pages/Sources'));
const SourcePage = lazy(() => import('./pages/Source'));
const Debates = lazy(() => import('./pages/Debates'));
const DebatePage = lazy(() => import('./pages/Debate'));
const Compare = lazy(() => import('./pages/Compare'));
const Scenarios = lazy(() => import('./pages/Scenarios'));
const ScenarioPage = lazy(() => import('./pages/Scenario'));
const Revise = lazy(() => import('./pages/Revise'));
const Study = lazy(() => import('./pages/Study'));
const Library = lazy(() => import('./pages/Library'));
const Glossary = lazy(() => import('./pages/Glossary'));

function Loading() {
  return (
    <div className="wrap page-loading ui" role="status">
      Opening the archive…
    </div>
  );
}
const s = (el: React.ReactNode) => <Suspense fallback={<Loading />}>{el}</Suspense>;

const router = createHashRouter([
  {
    element: <Layout />,
    errorElement: <NotFound error />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/course', element: <CoursePage /> },
      { path: '/course/:id', element: <ModulePage /> },
      { path: '/lesson/:id', element: <LessonPage /> },
      { path: '/timeline', element: s(<Timeline />) },
      { path: '/atlas', element: s(<Atlas />) },
      { path: '/people', element: s(<People />) },
      { path: '/people/:id', element: s(<Person />) },
      { path: '/sources', element: s(<Sources />) },
      { path: '/sources/:id', element: s(<SourcePage />) },
      { path: '/debates', element: s(<Debates />) },
      { path: '/debates/:id', element: s(<DebatePage />) },
      { path: '/compare', element: s(<Compare />) },
      { path: '/compare/:id', element: s(<Compare />) },
      { path: '/scenarios', element: s(<Scenarios />) },
      { path: '/scenarios/:id', element: s(<ScenarioPage />) },
      { path: '/revise', element: s(<Revise />) },
      { path: '/revise/:tab', element: s(<Revise />) },
      { path: '/revise/:tab/:id', element: s(<Revise />) },
      { path: '/study', element: s(<Study />) },
      { path: '/library', element: s(<Library />) },
      { path: '/glossary', element: s(<Glossary />) },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
