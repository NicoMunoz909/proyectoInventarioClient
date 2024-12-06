import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.css";
import FormularioEntrada from "./FormularioEntrada";
import FormularioSalida from "./FormularioSalida";
import ConsultaInventario from "./ConsultaInventario";
import ReporteInventario from "./ReporteInventario";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="entrada" element={<FormularioEntrada />}></Route>
          <Route path="salida" element={<FormularioSalida />}></Route>
          <Route path="consulta" element={<ConsultaInventario />}></Route>
          <Route path="reporte" element={<ReporteInventario />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
