import { useState } from 'react';
import styles from './entriesPage.module.css';
import inventoryService from '../../services/inventoryService';
import MainLayout from '../../layouts/MainLayout';
import Input from '../../components/Input';
import EnterButton from '../../components/EnterButton';
import InventoryList from '../../components/InventoryList';
import FinishButton from '../../components/FinishButton';
import FormFields from '../../components/FormFields';

const EntriesPage = () => {
  const [activeTab, setActiveTab] = useState("DATOS")
  const [inputs, setInputs] = useState({
    proveedor: "",
    ordenDeCompra: "",
    factura: "",
    CFDI: "",
    almacen: "",
    sector: "",
    partNumber: "",
    descripcion: "",
    serialNumber: "",
  })
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
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

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setInputs({...inputs, partNumber: "", descripcion: "", serialNumber: ""})
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  }

  const handleSerialEntry = (e) => {
    e.preventDefault();
    setItems([...items, {...inputs}])
    setInputs({...inputs, serialNumber: ""})
    e.target["input-serial"].value = "";
  }

  const handlePartNumberEntry = (e) => {
    e.preventDefault();
    const entries = new Array(parseInt(e.target["input-cantidad"].value)).fill({...inputs, serialNumber: "S/N"})
    setItems([...items, ...entries])
    e.target["input-part-number"].value = "";
    e.target["input-descripcion"].value = "";
    e.target["input-cantidad"].value = 1;
  }

  const handleItemDelete = (index) => {
    setItems(items.filter( (item, i) => i != index))
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    const response = await inventoryService.createEntry(items);
    if(response.status === 'OK') {
      alert(response.message);
      setInputs({
        proveedor: "",
        ordenDeCompra: "",
        factura: "",
        CFDI: "",
        almacen: "",
        sector: "",
        partNumber: "",
        descripcion: "",
        serialNumber: "",
      });
      setItems([]);
      setIsLoading(false);
    } else {
      alert(response.message + ": \n" + response.data.join("\n"));
      setIsLoading(false);
    }
  }

  const renderInputs = () => {
    switch(activeTab) {
      case "DATOS": 
        return (
          <form>
            <div className={styles.row}>
              <Input label="proveedor" name="proveedor" id="input-proveedor" type="text" defaultValue={inputs.proveedor} onChange={(e) => handleInputChange(e)}/>
              <Input label="orden de compra" name="ordenDeCompra" id="input-orden" type="text" defaultValue={inputs.ordenDeCompra} onChange={(e) => handleInputChange(e)}/>
              <Input label="factura" name="factura" id="input-factura" type="text" defaultValue={inputs.factura} onChange={(e) => handleInputChange(e)}/>
              <Input label="CFDI" name="CFDI" id="input-cfdi" type="text" defaultValue={inputs.CFDI} onChange={(e) => handleInputChange(e)}/>
            </div>
            <div className={styles.row}>
              <Input label="almacén" name="almacen" id="input-almacen" type="text" defaultValue={inputs.almacen} onChange={(e) => handleInputChange(e)}/>
              <Input label="sector" name="sector" id="input-sector" type="text" defaultValue={inputs.sector} onChange={(e) => handleInputChange(e)}/>
            </div>
          </form>
        );
      case "SERIAL":
        return (
          <form onSubmit={handleSerialEntry}>
            <div className={styles.row}>
              <Input label="part number" name="partNumber" id="input-part-number" type="text" required={true} onChange={(e) => handleInputChange(e)}/>
              <Input label="descripción" name="descripcion" id="input-descripcion" type="text" required={true} onChange={(e) => handleInputChange(e)}/>
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
              <Input label="descripción" name="descripcion" id="input-descripcion" type="text" required={true} onChange={(e) => handleInputChange(e)}/>
              <Input label="serial number" name="serialNumber" id="input-serial" type="text" defaultValue="S/N" placeholder="S/N" disabled={true} onChange={(e) => handleInputChange(e)}/>
              <Input inputStyle={{width: "30px"}} labelStyle={{width: "fit-content"}} label="cantidad" name="cantidad" id="input-cantidad" type="number" defaultValue={1} />
              <EnterButton isDisabled={isLoading}/>
            </div>
          </form>
        )
    }
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        <FormFields tabs={tabs} renderInputs={renderInputs} activeTab={activeTab} handleChange={(tab) => handleTabChange(tab)} />
        {/* <div className={styles.tabs}>
          <FormTab title="Datos Entrada" isActive={activeTab === "DATOS"} onClick={() => handleTabChange("DATOS")}/>
          <FormTab title="Serial" isActive={activeTab === "SERIAL"} onClick={() => handleTabChange("SERIAL")}/>
          <FormTab title="Part Number" isActive={activeTab === "PART_NUMBER"} onClick={() => handleTabChange("PART_NUMBER")}/>
        </div>
        <div className={styles.inputs} key={activeTab}>
          {renderInputs()}
        </div> */}
        <InventoryList attributes={["#", "Proveedor", "Orden de Compra", "Factura", "CFDI", "Almacén", "Sector", "Part Number", "Descripción", "Serial Number"]} items={items} mode="SHOW" onDelete={(index) => handleItemDelete(index)}/>
        <FinishButton disabled={isLoading} onFinish={() => handleSubmit()}/>
      </div>
    </MainLayout>
  )
}

export default EntriesPage