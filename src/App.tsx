import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDatabase } from "./context/DatabaseContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function App() {
  const { initialized, initializeDatabase } = useDatabase();

  useEffect(() => {
    if (!initialized) {
      initializeDatabase();
    }
  }, [initialized, initializeDatabase]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Initializing Database...
          </h2>
          <p className="text-gray-500 mt-2">
            Setting up your patient records system
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
