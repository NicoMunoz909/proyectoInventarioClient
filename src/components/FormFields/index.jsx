import styles from './formFields.module.css'
import FormTab from '../FormTab'

const FormFields = ( { children, style, tabs, renderInputs, activeTab, handleChange} ) => {

  return (
    <div className={styles.container}>
        <div className={styles.tabs}>
          {tabs.map( (tab) => {
            return (<FormTab key={tab.key} title={tab.title} isActive={activeTab === tab.key} onClick={() => handleChange(tab.key)} />)
          } )}
          {/* <FormTab title="Datos Entrada" isActive={activeTab === "DATOS"} onClick={() => handleTabChange("DATOS")}/>
          <FormTab title="Serial" isActive={activeTab === "SERIAL"} onClick={() => handleTabChange("SERIAL")}/>
          <FormTab title="Part Number" isActive={activeTab === "PART_NUMBER"} onClick={() => handleTabChange("PART_NUMBER")}/> */}
        </div>
        <div style={style} className={styles.inputs} key={activeTab}>
          {renderInputs()}
          {children}
        </div>
    </div>
  )
}

export default FormFields