import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import styles from './exitsPage.module.css';
import inventoryService from '../../services/inventoryService';
import MainLayout from '../../layouts/MainLayout';
import FormFields from '../../components/FormFields';
import Input from '../../components/Input';
import EnterButton from '../../components/EnterButton';
import InventoryList from '../../components/InventoryList';
import FinishButton from '../../components/FinishButton';
import Remission from '../Remission';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAlert } from '../../contexts/AlertContext'

const ExitsPage = () => {
  const [activeTab, setActiveTab] = useState("DATOS")
  const [inputs, setInputs] = useState({
    cliente: "",
    factura: "",
    ordenDeCompra: "",
    direccion: "",
    vendedor: "",
    responsableCliente: "",
    nota: "",
    serialNumber: "",
    partNumber: "",
  })
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [renderPickingList, setRenderPickingList] = useState(false)
  const [fetchedItems, setFetchedItems] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const tabs = [
    {
      key: "DATOS",
      title: "Datos Entrada",
    },
    {
      key: "SERIAL",
      title: "Serial",
    },
    {
      key: "PART_NUMBER",
      title: "Part Number"
    }
  ]
  const { showAlert } = useAlert();
  
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setInputs({...inputs, partNumber: "", serialNumber: ""})
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  }
  
  const handleSerialEntry = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await inventoryService.getAll({serialNumber: inputs.serialNumber, soloStock: true}, ["id","partNumber", "descripcion", "serialNumber", "almacen", "sector", "ordenDeCompra", "facturaCompra", "fechaEntrada"], {serialNumber: "exact"});
    if (response.status === 'OK' && !selectedIds.includes(response.data[0].id)) {
      setSelectedIds([...selectedIds, response.data[0].id])
      setItems([...items,response.data[0]])
    } else if (response.status === 'NO MATCH') {
      showAlert(response.message, 'error')
    } else if(selectedIds.includes(response.data[0].id)) {
      showAlert("Ese producto ya fue seleccionado", 'error')
    } else (
      showAlert(response.message, 'error')
    )
    setInputs({...inputs, serialNumber: ""})
    e.target["input-serial"].value = "";
    setIsLoading(false)
  }
  
  const handlePartNumberEntry = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await inventoryService.getAll({partNumber: e.target["input-part-number"].value, soloStock: true}, ["id","partNumber", "descripcion", "serialNumber", "almacen", "sector", "ordenDeCompra", "facturaCompra", "fechaEntrada"]);
    if (response.status === 'OK') {
      const filteredData = response.data.filter( (item) => !selectedIds.includes(item.id)) //Filter out items that have already been picked
      setFetchedItems(filteredData);
      setRenderPickingList(true);
    } else {
      showAlert(response.message, 'error')
    }
    e.target["input-part-number"].value = "";
    setIsLoading(false);
  }
  
  const handleItemDelete = (index) => {
    setSelectedIds(selectedIds.filter( (id) => id != items[index].id ))
    setItems(items.filter( (item, i) => i != index))
  }
  
  const handleItemsPick = (pickedItems, pickedIds) => {
    setRenderPickingList(false);
    setFetchedItems([]);
    setItems([...items,...pickedItems]);
    setSelectedIds([...selectedIds, ...pickedIds])
  }
  
  const handleCancel = () => {
    setRenderPickingList(false);
    setFetchedItems([]);
  }
  
  const handleSubmit = async () => {
    setIsLoading(true);
    const response = await inventoryService.registerExit(selectedIds, inputs.cliente, inputs.factura);
    if(response.status === 'OK') {
      showAlert("Salida registrada", 'success');
      printRemission();
      setInputs({
        cliente: "",
        factura: "",
        ordenDeCompra: "",
        direccion: "",
        vendedor: "",
        responsableCliente: "",
        nota: "",
        serialNumber: "",
        partNumber: "",
      })
      setSelectedIds([]);
      setItems([]);
      setIsLoading(false);
    } else {
      showAlert(response.message + response.data, 'error');
      setIsLoading(false);
    }
  }
  
  const printRemission = () => {
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
      root.render(<Remission inputs={inputs} items={items} />);
    }
    
    const renderInputs = () => {
      switch(activeTab) {
        case "DATOS": 
        return (
          <form>
          <div className={styles.row}>
          <Input label="cliente" name="cliente" id="input-cliente" type="text" defaultValue={inputs.cliente} onChange={(e) => handleInputChange(e)}/>
          <Input label="factura" name="factura" id="input-factura" type="text" defaultValue={inputs.factura} onChange={(e) => handleInputChange(e)}/>
          <Input label="orden de compra" name="ordenDeCompra" id="input-orden" type="text" defaultValue={inputs.ordenDeCompra} onChange={(e) => handleInputChange(e)}/>
          </div>
          <div className={styles.row}>
          <Input label="dirección" name="direccion" id="input-direccion" type="text" defaultValue={inputs.direccion} onChange={(e) => handleInputChange(e)}/>
          <Input label="vendedor" name="vendedor" id="input-vendedor" type="text" defaultValue={inputs.vendedor} onChange={(e) => handleInputChange(e)}/>
          <Input label="responsable cliente" name="responsableCliente" id="input-responsable" type="text" defaultValue={inputs.responsableCliente} onChange={(e) => handleInputChange(e)}/>
          <Input label="nota" name="nota" id="input-nota" type="text" defaultValue={inputs.nota} onChange={(e) => handleInputChange(e)}/>
          </div>
          </form>
        );
        case "SERIAL":
        return (
          <form onSubmit={handleSerialEntry}>
          <div className={styles.row}>
          <Input label="serial number" name="serialNumber" id="input-serial" type="text" required={true} onChange={(e) => handleInputChange(e)}/>
          <EnterButton isDisabled={isLoading}/>
          </div>
          </form>
        );
        case "PART_NUMBER":
        return (
          <form onSubmit={handlePartNumberEntry}>
          <div className={styles.row}>
          <Input label="part number" name="partNumber" id="input-part-number" type="text" required={true} onChange={(e) => handleInputChange(e)}/>
          <EnterButton isDisabled={isLoading}/>
          </div>
          </form>
        )
      }
    }
    
    return (
      <MainLayout>
      <div className={styles.container}>
      {renderPickingList && 
        <div className={styles.modal}>
        <InventoryList 
        style={{maxHeight: "450px"}}
        attributes={["#", "Part Number", "Descripción","Serial Number", "Almacén", "Sector", "Orden de Compra","Factura de Compra", "Fecha de Entrada"]} 
        mode="PICKING" 
        items={fetchedItems} 
        selectedIds={selectedIds} 
        onSelect={(pickedItems, pickedIds) => handleItemsPick(pickedItems, pickedIds)} 
        onCancel={handleCancel}/>
        </div>
      }
      <FormFields tabs={tabs} renderInputs={renderInputs} activeTab={activeTab} handleChange={(tab) => handleTabChange(tab)} />
      <InventoryList 
      attributes={["#", "Part Number", "Descripción", "Serial Number", "Almacén", "Sector", "Orden de Compra","Factura de Compra", "Fecha de Entrada"]} 
      mode="SHOW" 
      items={items} 
      onDelete={(index) => handleItemDelete(index)}/>
      {isLoading ? <LoadingSpinner /> :<FinishButton disabled={isLoading} onFinish={() => handleSubmit()}/>}
      </div>
      </MainLayout>
    )
  }
  
  
  export default ExitsPage