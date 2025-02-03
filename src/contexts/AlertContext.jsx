import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = "info") => {
    const id = Date.now(); // Unique ID for each alert
    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== id));
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}>
        {alerts.map((alert) => (
          <Alert key={alert.id} message={alert.message} type={alert.type} />
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext);
};

const Alert = ({ message, type }) => {
  return (
    <div style={{
      padding: "10px 20px",
      backgroundColor: type === "error" ? "red" : "green",
      color: "white",
      borderRadius: "5px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    }}>
      {message}
    </div>
  );
};

