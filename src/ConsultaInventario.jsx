import { useState, useEffect } from "react";
import styles from "./consultaInventario.module.css";

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

  const [soloStock, setSoloStock] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:4000/inventario?${queryParams}&soloStock=${soloStock}`);
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
  }, [soloStock]); // Fetch data whenever filters change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleCheckboxChange = (e) => {
    setSoloStock(e.target.checked);
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
        <label>
          <input type="checkbox" checked={soloStock} onChange={handleCheckboxChange} />
          Solo mostrar articulos en stock
        </label>
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
