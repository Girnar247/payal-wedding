import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "./components/ui/toaster";
import "./App.css";
import { Skeleton } from "./components/ui/skeleton";

// Lazy load route components with prefetch
const Index = lazy(() => {
  // Prefetch other routes after main route loads
  const routes = [
    import("./pages/Tasks"),
    import("./pages/MayraEvent"),
  ];
  Promise.all(routes);
  
  return import("./pages/Index").then(module => {
    return module;
  });
});

// Separate chunks for other routes
const Tasks = lazy(() => import("./pages/Tasks"));
const MayraEvent = lazy(() => import("./pages/MayraEvent"));

// Optimized loading component with minimal UI
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
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
}

export default App;