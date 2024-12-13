import { useState } from "react";
import { config } from "./Constants";

const FormularioEntrada = () => {
  const [inputs, setInputs] = useState({
    ordenDeCompra: "",
    partNumber: "",
    proveedor: "",
    descripcion: "",
    facturaCompra: "",
    cfdi: "",
    almacen: "",
    sector: "",
  });
  const [checkboxes, setCheckboxes] = useState({
    isBackup: false,
    isDemo: false
  })
  const URL = config.url;
  const [series, setSeries] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: checked,
    }));
  }

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

  // Handle removal of a serial number
  const handleRemoveSeries = (serialNumberToRemove, index) => {
    setSeries(series.filter((serialNumber, i) => i !== index));
  };

  const finalizarEntrada = () => {
    const entradas = series.map((serialNumber) => ({
      ...inputs,
      ...checkboxes,
      serialNumber,
    }));
    console.log(entradas)
    fetch(`${URL}entradas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entradas),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw error;
          });
        }
        return response.text();
      })
      .then((data) => {
        alert(data);
        setInputs({
          ordenDeCompra: "",
          partNumber: "",
          proveedor: "",
          descripcion: "",
          facturaCompra: "",
          cfdi: "",
          almacen: "",
          sector: "",
        });
        setSeries([]);
      })
      .catch((error) => {
        alert("Error: " + error.message + "\n" + error.duplicates.join("\n"));
      });
  };

  return (
    <div style={styles.container}>
      <form id="entrada" onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.innerContainer}>
          {Object.keys(inputs).map((key) => (
            <div key={key} style={styles.formGroup}>
              <label htmlFor={key} style={styles.label}>
                {key.replace(/([A-Z])/g, " $1").trim()}
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
          <div style={styles.formGroup}>
              <label htmlFor="backup">
                Back up
              </label>
              <input
                type="checkbox"
                id="isBackup"
                name="isBackup"
                onChange={handleCheckbox}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="demo">
                Demo
              </label>
              <input
                type="checkbox"
                id="isDemo"
                name="isDemo"
                onChange={handleCheckbox}
              />
            </div>
        </div>
        <div>
          <div style={styles.formGroup}>
            <div>
              <label htmlFor="serie" style={styles.label}>
                Nro de Serie
              </label>
              <input type="text" id="serie" name="serie" style={styles.input} />
              <label htmlFor="cantidad" style={styles.label}>
                Cantidad
              </label>
              <input type="number" id="cantidad" name="cantidad" defaultValue={1} style={styles.input2} />
            </div>
            <input type="submit" id="ingresar" name="ingresar" value="Ingresar" />
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
      <button onClick={finalizarEntrada}>Finalizar</button>
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

export default FormularioEntrada;
