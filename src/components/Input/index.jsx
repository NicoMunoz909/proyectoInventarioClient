import styles from './input.module.css'

const Input = ({ inputStyle, labelStyle, label, name, id, type, min, defaultValue, placeholder, disabled, required, onChange }) => {
  return (
    <div className={styles.container}>
      <label style={labelStyle} htmlFor={id}>{label}</label>
      <input style={inputStyle} type={type} name={name} id={id} defaultValue={defaultValue} min={min} placeholder={placeholder} disabled={disabled} required={required} onChange={onChange} />
    </div>
  )
}

export default Input