import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import InventoryPage from './pages/InventoryPage'
import EntriesPage from "./pages/EntriesPage";
import ExitsPage from './pages/ExitsPage'
import ReportsPage from './pages/ReportsPage'
import LoginPage from "./pages/LoginPage";
import { useEffect, useState } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import { AlertProvider } from "./contexts/AlertContext";

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has a valid token in localStorage
    const token = localStorage.getItem("AppInventarioToken");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingSpinner style={{paddingTop: "20%"}}/>; // Placeholder while checking authentication
  }

  return (
    <AlertProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/inventario" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated}/>}>
            <Route path="/inventario" element={<InventoryPage />} />
            <Route path="/entradas" element={<EntriesPage />} />
            <Route path="/salidas" element={<ExitsPage />} />
            <Route path="/reportes" element={<ReportsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AlertProvider>
  );
};

export default App;
