import styles from "./formTab.module.css"

const FormTab = ( {title, isActive, onClick} ) => {

  return (
    <div className={(isActive ? [styles.active, styles.container].join(' ') : styles.container)} onClick={onClick}>
        <p>{title}</p>
    </div>
  )
}

export default FormTab