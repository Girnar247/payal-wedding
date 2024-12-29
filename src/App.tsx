import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

// Lazy load route components
const Index = lazy(() => import("./pages/Index"));
const Tasks = lazy(() => import("./pages/Tasks"));
const MayraEvent = lazy(() => import("./pages/MayraEvent"));
const WeddingSummary = lazy(() => import("./pages/WeddingSummary"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/mayra" element={<MayraEvent />} />
          <Route path="/wedding-summary" element={<WeddingSummary />} />
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
}

export default App;