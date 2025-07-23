import { useState, useEffect } from "react";
import styles from "./inventoryPage.module.css";
import inventoryService from "../../services/inventoryService";
import InventoryList from "../../components/InventoryList";
import Input from "../../components/Input";
import FormFields from "../../components/FormFields";
import MainLayout from "../../layouts/MainLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAlert } from "../../contexts/AlertContext";

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState("PRODUCTO");
  const [filters, setFilters] = useState({
    ordenDeCompra: "",
    partNumber: "",
    proveedor: "",
    descripcion: "",
    serialNumber: "",
    facturaCompra: "",
    almacen: "",
    sector: "",
    facturaVenta: "",
    destino: "",
  });
  const [checkboxes, setCheckboxes] = useState({
    soloStock: true,
  });
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tabs = [
    {
      key: "PRODUCTO",
      title: "Producto",
    },
    {
      key: "ENTRADA",
      title: "Datos Entrada",
    },
    {
      key: "SALIDA",
      title: "Datos Salida",
    },
  ];
  const { showAlert } = useAlert();

  // Fetch data from the backend
  const fetchData = async () => {
    setIsLoading(true);
    const response = await inventoryService.getAll(
      { ...filters, ...checkboxes },
      [
        "partNumber",
        "descripcion",
        "serialNumber",
        "proveedor",
        "ordenDeCompra",
        "facturaCompra",
        "fechaEntrada",
        "almacen",
        "sector",
        "facturaVenta",
        "destino",
        "fechaSalida",
      ]
    );
    if (response.status === "OK") {
      setItems(response.data);
      setIsLoading(false);
    } else if (response.status === "NO MATCH") {
      setItems([]);
      showAlert(response.message, "error");
      setIsLoading(false);
    } else {
      showAlert(response.message, "error");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFiltersChange = (e) => {
    if (e.target.name === "fechaEntrada" || e.target.name === "fechaSalida") {
      const date = {
        name: e.target.name,
        value: new Date(
          e.target.value.split("-")[0],
          e.target.value.split("-")[1] - 1,
          e.target.value.split("-")[2]
        ).toLocaleDateString(),
      };
      const { name, value } = date;
      setFilters({ ...filters, [name]: value });
    } else {
      const { name, value } = e.target;
      setFilters({ ...filters, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: checked,
    }));
  };

  const renderInputs = () => {
    switch (activeTab) {
      case "PRODUCTO":
        return (
          <div className={styles.row}>
            <Input
              label="Serial Number"
              name="serialNumber"
              id="input-serialNumber"
              type="text"
              defaultValue={filters.serialNumber}
              onChange={(e) => handleFiltersChange(e)}
            />
            <Input
              label="Part Number"
              name="partNumber"
              id="input-partNumber"
              type="text"
              defaultValue={filters.partNumber}
              onChange={(e) => handleFiltersChange(e)}
            />
            <Input
              label="Descripción"
              name="descripcion"
              id="input-descripcion"
              type="text"
              defaultValue={filters.descripcion}
              onChange={(e) => handleFiltersChange(e)}
            />
            <Input
              inputStyle={{ width: "120px" }}
              label="almacén"
              name="almacen"
              id="input-almacen"
              type="text"
              defaultValue={filters.almacen}
              onChange={(e) => handleFiltersChange(e)}
            />
            <Input
              inputStyle={{ width: "30px" }}
              label="sector"
              name="sector"
              id="input-sector"
              type="text"
              defaultValue={filters.sector}
              onChange={(e) => handleFiltersChange(e)}
            />
          </div>
        );
      case "ENTRADA":
        return (
          <div className={styles.row}>
            <Input
              label="Proveedor"
              name="proveedor"
              id="input-proveedor"
              type="text"
              defaultValue={filters.proveedor}
              onChange={(e) => handleFiltersChange(e)}
            />
            <Input
              label="Orden de Compra"
              name="ordenDeCompra"
              id="input-ordenDeCompra"
              type="text"
              defaultValue={filters.ordenDeCompra}
              onChange={(e) => handleFiltersChange(e)}
            />
            <Input
              label="Factura de Compra"
              name="facturaCompra"
              id="input-facturaCompra"
              type="text"
              defaultValue={filters.facturaCompra}
              onChange={(e) => handleFiltersChange(e)}
            />
          </div>
        );
      case "SALIDA":
        return (
          <div className={styles.row}>
            <Input
              label="Cliente"
              name="destino"
              id="input-destino"
              type="text"
              defaultValue={filters.cliente}
              onChange={(e) => handleFiltersChange(e)}
            />
            <Input
              label="Factura de Venta"
              name="facturaVenta"
              id="input-facturaVenta"
              type="text"
              defaultValue={filters.facturaVenta}
              onChange={(e) => handleFiltersChange(e)}
            />
          </div>
        );
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <FormFields
          style={{ height: "130px" }}
          tabs={tabs}
          renderInputs={renderInputs}
          activeTab={activeTab}
          handleChange={(tab) => handleTabChange(tab)}
        >
          <div className={styles.checkboxes}>
            <label htmlFor="soloStock">
              <input
                type="checkbox"
                name="soloStock"
                defaultChecked
                onChange={handleCheckboxChange}
              />
              Solo mostrar articulos en stock
            </label>
            <button type="submit" disabled={isLoading} onClick={handleSubmit}>
              FILTRAR
            </button>
          </div>
        </FormFields>
        {isLoading ? (
          <LoadingSpinner style={{ paddingTop: "200px" }} />
        ) : (
          <>
            <InventoryList
              style={{
                maxHeight: "350px",
                fontSize: "12px",
              }}
              attributes={[
                "#",
                "Part Number",
                "Descripción",
                "Serial Number",
                "Proveedor",
                "Orden de Compra",
                "Factura de Compra",
                "Fecha de Entrada",
                "Almacén",
                "Sector",
                "Factura de Venta",
                "Cliente",
                "Fecha de Salida",
              ]}
              items={items}
            />
            <h3>CANTIDAD: {items.length}</h3>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default InventoryPage;
