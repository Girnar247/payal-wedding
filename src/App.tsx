import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import MayraEvent from "./pages/MayraEvent";
import WeddingSummary from "./pages/WeddingSummary";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/mayra" element={<MayraEvent />} />
        <Route path="/wedding-summary" element={<WeddingSummary />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;