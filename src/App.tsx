import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Eagerly load the Index component for faster initial render
import Index from './pages/Index';

// Lazy load other routes
const WeddingSummary = lazy(() => import('./pages/WeddingSummary'));
const Tasks = lazy(() => import('./pages/Tasks'));
const MayraEvent = lazy(() => import('./pages/MayraEvent'));

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
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>}>
              <WeddingSummary />
            </Suspense>
          }
        />
        <Route
          path="/tasks"
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>}>
              <Tasks />
            </Suspense>
          }
        />
        <Route
          path="/mayra"
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>}>
              <MayraEvent />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;