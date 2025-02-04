import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styles from './reportsPage.module.css';
import MainLayout from '../../layouts/MainLayout';
import InventoryList from '../../components/InventoryList';
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAlert } from '../../contexts/AlertContext'

const ReportsPage = () => {
  const [report, setReport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlert();

  const fetchReport = async (e) => {
    const inventario = document.getElementsByName("inventario");
    const selectedInventario = Array.from(inventario).find((radio) => radio.checked)?.value;
    setIsLoading(true);
    try {
      const response = await fetch(`https://id-automation-inventario.onrender.com/reporte?q=${e.target.value}&reportType=${selectedInventario}`);
      const data = await response.json();
      setReport(data);
    } catch (error) {
      showAlert(error, 'error')
    }
    setIsLoading(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    autoTable(doc, { html: "#tabla-inventario" });
    doc.save("reporteInventario.pdf");
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1>REPORTES</h1>
        <fieldset>
          <legend>Seleccionar inventario</legend>
          <div>
            <input type="radio" name="inventario" id="venta" value="venta" defaultChecked/>
            <label htmlFor="venta">Venta</label>
            <input type="radio" name="inventario" id="backup" value="backups"/>
            <label htmlFor="backup">Backup</label>
            <input type="radio" name="inventario" id="demo" value="demos"/>
            <label htmlFor="demo">Demo</label>
          </div>
        </fieldset>
        <select name="reporte" id="reporte" defaultValue="placeholder" onChange={fetchReport}>
          <option value="placeholder" disabled>
            Seleccionar
          </option>
          <option value="partNumber">Cantidad x Part Number</option>
        </select>
        <h2>Reporte</h2>
          {isLoading ? <LoadingSpinner /> : report.length > 0 && <InventoryList 
            attributes={["#","Part Number", "Cantidad"]}
            items={report}
          />}
        <button onClick={generatePDF}>Descargar PDF</button>
      </div>
    </MainLayout>
  )
}

export default ReportsPage