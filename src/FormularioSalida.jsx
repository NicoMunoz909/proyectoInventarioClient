import { useState } from "react";
import { createRoot } from "react-dom/client";
import Remision from "./Remision";

const FormularioSalida = () => {
  // State to manage input values
  const [inputs, setInputs] = useState({
    destino: "",
    facturaVenta: "",
    direccion: "",
    ordenDeCompra: "",
    nota: "",
    responsable: "",
  });

  const [series, setSeries] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  // Handle removal of a serial number
  const handleRemoveSeries = (serialNumberToRemove, index) => {
    setSeries(series.filter((serialNumber, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const serieValue = e.target.serie.value.trim();
    const cantidad = parseInt(e.target.cantidad.value);
    const newSeries = Array(cantidad).fill(serieValue);
    if (serieValue && !series.includes(serieValue)) {
      setSeries([...series, ...newSeries]);
      e.target.serie.value = "";
      e.target.cantidad.value = 1;
    } else {
      alert("Please enter a valid and unique serial number.");
    }
  };

  const imprimirRemision = () => {
    // Open a new window
    const printWindow = window.open("", "Print", "width=600,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Remisión</title>
        </head>
        <body>
        <div id="print-root"></div>
        </body>
      </html>
    `);

    const printRoot = printWindow.document.getElementById("print-root");
    const root = createRoot(printRoot);
    root.render(<Remision inputs={inputs} series={series} />);
  };

  const finalizarSalida = () => {
    const salida = { ...inputs, series };
    fetch(`${URL}salidas`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(salida),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          alert(data.msg);
          imprimirRemision();
          setInputs({
            destino: "",
            facturaVenta: "",
            direccion: "",
            ordenDeCompra: "",
            nota: "",
            responsable: "",
          });
          setSeries([]);
        } else {
          throw data;
        }
      })
      .catch((error) => {
        alert("ERROR: " + error.error + ": " + error.notFoundSerialNumbers);
      });
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form} id="salida">
        <div style={styles.innerContainer}>
          {Object.keys(inputs).map((key, index) => (
            <div key={index} style={styles.formGroup}>
              <label htmlFor={key} style={styles.label}>
                {key}
              </label>
              <input
                type="text"
                id={key}
                name={key}
                value={inputs[key]}
                required
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          ))}
        </div>
        <div>
          <div style={styles.formGroup}>
            <label htmlFor="serie" style={styles.label}>
              Nro de Serie
            </label>
            <input type="text" id="serie" name="serie" style={styles.input} />
            <input type="submit" id="ingresar" name="ingresar" value="Ingresar" />
            <label htmlFor="cantidad" style={styles.label}>
              Cantidad
            </label>
            <input type="number" id="cantidad" name="cantidad" defaultValue={1} style={styles.input2} />
          </div>
          <h4>SERIES</h4>
          <div style={styles.seriesReport}>
            <ul>
              {series.map((serialNumber, index) => (
                <li key={index} style={styles.serialListItem}>
                  {serialNumber}
                  <span onClick={() => handleRemoveSeries(serialNumber, index)} style={styles.deleteButton}>
                    ❌
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </form>
      <button onClick={finalizarSalida}>Finalizar</button>
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: "20px",
  },
  innerContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
  form: {
    display: "flex",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  formGroup: {
    marginBottom: "15px",
  },
  seriesReport: {
    width: "100%",
    height: "200px",
    border: "1px solid black",
    overflowY: "scroll",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "black",
  },
  input: {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  input2: {
    width: "50px",
    padding: "8px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  submitButton: {
    width: "auto",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    padding: "10px 20px",
  },
  texto: {
    margin: "2px",
  },
  serialListItem: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  deleteButton: { marginLeft: "10px", cursor: "pointer", color: "red" },
};

export default FormularioSalida;
