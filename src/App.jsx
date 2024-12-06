import { NavLink, Outlet } from "react-router-dom";
import styles from "./App.module.css";

const App = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <NavLink className={styles.link} to="/entrada">
          Entrada Inventario
        </NavLink>
        <NavLink className={styles.link} to="/salida">
          Salida Inventario
        </NavLink>
        <NavLink className={styles.link} to="/consulta">
          Consulta Inventario
        </NavLink>
        <NavLink className={styles.link} to="/reporte">
          Reporte Inventario
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default App;
