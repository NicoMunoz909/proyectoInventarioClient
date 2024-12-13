import { useState, useEffect } from "react";
import styles from "./consultaInventario.module.css";
import { config } from "./Constants";

const ConsultaInventario = () => {
  const [filters, setFilters] = useState({
    ordenDeCompra: "",
    partNumber: "",
    proveedor: "",
    descripcion: "",
    serialNumber: "",
    facturaCompra: "",
    cfdi: "",
    almacen: "",
    sector: "",
    facturaVenta: "",
    destino: "",
    fechaEntrada: "",
    fechaSalida: "",
  });
  const URL = config.url;
  const [checkboxes, setCheckboxes] = useState({
    soloStock: true,
    soloBackups: false,
    soloDemos: false,
  })
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${URL}inventario?${queryParams}&soloStock=${checkboxes.soloStock}&isBackup=${checkboxes.soloBackups}&isDemo=${checkboxes.soloDemos}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data whenever filters change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleCheckboxChange = (e) => {
    const {name, checked} = e.target
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: checked,
    }));
    console.log(checkboxes)
  };

  return (
    <div className={styles.container}>
      <form className={styles.filtros} onSubmit={handleSubmit}>
        {Object.keys(filters).map((key) => (
          <div key={key} className={styles.filtro}>
            <label htmlFor={key}>{key}:</label>
            <input id={key} name={key} type="text" value={filters[key]} onChange={handleChange} />
          </div>
        ))}
        <div className={styles.checkboxes}>
          <label htmlFor="soloStock">
            <input type="checkbox" name="soloStock" defaultChecked onChange={handleCheckboxChange} />
            Solo mostrar articulos en stock
          </label>
          <label htmlFor="soloBackups">
            <input type="checkbox" name="soloBackups" onChange={handleCheckboxChange} />
            Solo mostrar backups
          </label>
          <label htmlFor="soloDemos">
            <input type="checkbox" name="soloDemos" onChange={handleCheckboxChange} />
            Solo mostrar demos
          </label>
        </div>
        <input type="submit" value="Filtar"></input>
      </form>

      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}

      <div className={styles.contenedorTabla}>
        {!loading && !error && (
          <table className={styles.tabla} border="1" cellPadding="3">
            <thead>
              <tr>
                {Object.keys(filters).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((item, index) => (
                  <tr key={index}>
                    {Object.keys(filters).map((key) => (
                      <td key={key}>{item[key]}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Object.keys(filters).length}>No hay artículos para mostrar</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <h3>CANTIDAD: {data.length}</h3>
    </div>
  );
};

export default ConsultaInventario;
