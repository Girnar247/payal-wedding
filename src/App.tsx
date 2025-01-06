import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import './App.css';

// Eagerly load the WeddingSummary component for faster initial render
import WeddingSummary from './pages/WeddingSummary';

// Lazy load other routes with loading states
const Index = lazy(() => import('./pages/Index'));
const MayraEvent = lazy(() => import('./pages/MayraEvent'));

// Optimized loading component for better UX during lazy loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="loading-spinner"></div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Make WeddingSummary the default landing page */}
        <Route path="/" element={<WeddingSummary />} />
        
        {/* Other routes are lazy loaded */}
        <Route
          path="/guests"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Index />
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
      <Toaster />
    </BrowserRouter>
  );
};

export default App;