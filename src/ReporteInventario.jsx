import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { config } from "./Constants";

function ReporteInventario() {
  const [report, setReport] = useState([]);
  const URL = config.url;

  const fetchReport = async (e) => {
    const response = await fetch(`${URL}reporte?q=${e.target.value}`);
    const data = await response.json();
    setReport(data);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    autoTable(doc, { html: "#tablaReporte" });
    doc.save("reporteInventario.pdf");
  };

  return (
    <div>
      <h1>Seleccionar Reporte</h1>
      <select name="reporte" id="reporte" defaultValue="placeholder" onChange={fetchReport}>
        <option value="placeholder" disabled>
          Seleccionar
        </option>
        <option value="partNumber">Cantidad x Part Number</option>
      </select>
      <h2>Reporte</h2>
      {report.length ? (
        <table border="1" id="tablaReporte">
          <thead>
            <tr>
              {Object.keys(report[0]).map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {report.map((item, index) => (
              <tr key={index}>
                <td>{item.partNumber}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        ""
      )}
      <button onClick={generatePDF}>Descargar PDF</button>
    </div>
  );
}

export default ReporteInventario;
