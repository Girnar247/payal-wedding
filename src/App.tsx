import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "./components/ui/toaster";
import "./App.css";
import { Skeleton } from "./components/ui/skeleton";

// Lazy load route components
const Index = lazy(() => import("./pages/Index"));
const Tasks = lazy(() => import("./pages/Tasks"));
const MayraEvent = lazy(() => import("./pages/MayraEvent"));
const WeddingSummary = lazy(() => import("./pages/WeddingSummary"));

// Loading component
const LoadingFallback = () => (
  <div className="p-8 max-w-7xl mx-auto">
    <div className="space-y-8">
      <Skeleton className="h-12 w-3/4" />
      <div className="grid gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
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