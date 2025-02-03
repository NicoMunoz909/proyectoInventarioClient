import { NavLink } from "react-router-dom"
import styles from "./sidebar.module.css"

const Sidebar = () => {
  return (
    <div className={styles.container}>
      <NavLink to="/inventario" end className={({isActive}) => (isActive ? [styles.active, styles.link].join(' '): styles.link)}>Inventario</NavLink>  
      <NavLink to="/entradas" className={({isActive}) => (isActive ? [styles.active, styles.link].join(' ') : styles.link)}>Entradas</NavLink>
      <NavLink to="/salidas" className={({isActive}) => (isActive ? [styles.active, styles.link].join(' ') : styles.link)}>Salidas</NavLink>      
      <NavLink to="/reportes" className={({isActive}) => (isActive ? [styles.active, styles.link, styles.last].join(' ') : [styles.link, styles.last].join(' '))}>Reportes</NavLink>    
    </div>
  )
}

export default Sidebar