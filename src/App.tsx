import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Eagerly load the Index component for faster initial render
import Index from './pages/Index';

// Lazy load other routes with loading states
const WeddingSummary = lazy(() => import('./pages/WeddingSummary'));
const Tasks = lazy(() => import('./pages/Tasks'));
const MayraEvent = lazy(() => import('./pages/MayraEvent'));

// Loading component for better UX during lazy loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Index route is not lazy loaded for faster initial render */}
        <Route path="/" element={<Index />} />
        
        {/* Other routes are lazy loaded */}
        <Route
          path="/wedding-summary"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <WeddingSummary />
            </Suspense>
          }
        />
        <Route
          path="/tasks"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Tasks />
            </Suspense>
          }
        />
        <Route
          path="/mayra"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <MayraEvent />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;