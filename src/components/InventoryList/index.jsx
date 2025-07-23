import formatDate from "../../utils/formatDates";
import styles from "./inventoryList.module.css";
import { TiDelete } from "react-icons/ti";

const InventoryList = ({
  style = {},
  attributes,
  items = [],
  selectedIds = [],
  mode = undefined,
  onDelete = null,
  onSelect = null,
  onCancel = null,
}) => {
  const handleSelect = () => {
    const selectedRows = Array.from(document.getElementsByName("select-item"))
      .filter((node) => node.checked)
      .map((node) => parseInt(node.id.split("-")[2]));
    const pickedIds = selectedRows.map((index) => {
      return items[index].id;
    });
    const pickedItems = selectedRows.map((index) => {
      return items[index];
    });
    onSelect(pickedItems, pickedIds);
  };

  const renderButton = (index) => {
    switch (mode) {
      case "SHOW":
        return (
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(index)}
          >
            <TiDelete />
          </button>
        );
      case "PICKING":
        return (
          <>
            <label htmlFor={`select-item-${index}`}></label>
            <input
              className={styles.selectBox}
              name="select-item"
              id={`select-item-${index}`}
              type="checkbox"
              defaultChecked={selectedIds.includes(items[index].id)}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div style={style} className={styles.tableContainer}>
        <table className={styles.table} id="tabla-inventario">
          <thead>
            <tr>
              {attributes.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items
              .filter((item) => !selectedIds.includes(item.id))
              .map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {Object.entries(item).map(([key, value]) => {
                    if (key !== "id") {
                      if (key === "fechaEntrada" || key === "fechaSalida") {
                        return <td key={key}>{formatDate(value)}</td>;
                      } else {
                        return <td key={key}>{value}</td>;
                      }
                    }
                  })}
                  {mode && <td>{renderButton(index)}</td>}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {mode === "PICKING" && (
        <div className={styles.buttonsContainer}>
          <button onClick={handleSelect}>SELECCIONAR</button>
          <button onClick={onCancel}>CANCELAR</button>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
