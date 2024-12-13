import { useState, useEffect } from "react";
import { config } from "./Constants";

const Remision = ({ inputs, series }) => {
  const [serialData, setSerialData] = useState([]);
  const URL = config.url;

  const fetchSerialData = async () => {
    try {
      // Fetch data for all serial numbers
      const fetchedData = await Promise.all(
        series.map(async (serial) => {
          const response = await fetch(`${URL}inventario?serialNumber=${serial}`);
          const data = await response.json();
          return { ...data }; // Assume data has description and part number
        })
      );
      setSerialData(fetchedData);
    } catch (error) {
      console.error("Error fetching serial data:", error);
    }
  };

  useEffect(() => {
    fetchSerialData();
  }, []);

  return (
    <div style={styles.contenedor}>
      <img src="logo_id.jpg" alt="" width="300" height="180" />
      <div style={styles.separado}>
        <h1>RELACIÓN DE ENTREGA</h1>
        <h4>{new Date().toLocaleDateString()}</h4>
      </div>
      <h2>{inputs.cliente}</h2>
      <p>{inputs.direccion}</p>
      <table style={styles.table} border="1" cellPadding="3">
        <thead style={styles.encabezado}>
          <tr>
            <th>No.</th>
            <th>Part Number</th>
            <th>Description</th>
            <th>Serial Number</th>
            <th>Orden</th>
            <th>Factura</th>
          </tr>
        </thead>
        <tbody>
          {serialData.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item[0].partNumber}</td>
              <td>{item[0].descripcion}</td>
              <td>{item[0].serialNumber}</td>
              <td>{inputs.ordenDeCompra}</td>
              <td>{inputs.facturaVenta}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {inputs.nota ? <p>NOTA: {inputs.nota}</p> : ""}
      <div style={styles.separado}>
        <p style={styles.izquierda}>ID AUTOMATION</p>
        <p style={styles.izquierda}>{inputs.cliente}</p>
      </div>
      <div style={styles.separado}>
        <p style={styles.firmas}>{inputs.vendedor}</p>
        <p style={styles.firmas}>{inputs.responsableCliente}</p>
      </div>
    </div>
  );
};

const styles = {
  table: {
    width: "70%",
    borderCollapse: "collapse",
  },
  encabezado: {
    backgroundColor: "#C0E6F5",
  },
  izquierda: {
    textAling: "left",
  },
  contenedor: {
    fontFamily: "Helvetica",
  },
  separado: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  firmas: {
    borderTop: "2px solid black",
    paddingTop: "10px",
  },
};

export default Remision;
