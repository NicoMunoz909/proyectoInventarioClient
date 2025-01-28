import { BrowserRouter, Route, Routes } from "react-router-dom";
import InventoryPage from './pages/InventoryPage'
import EntriesPage from "./pages/EntriesPage";
import ExitsPage from './pages/ExitsPage'
import ReportsPage from './pages/ReportsPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<InventoryPage />} />
        <Route path="/entradas" element={<EntriesPage />} />
        <Route path="/salidas" element={<ExitsPage />} />
        <Route path="/reportes" element={<ReportsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
