// AdminDataContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      setAdminData(JSON.parse(user));
    }
  }, []);

  return (
    <AdminDataContext.Provider value={{ adminData, setAdminData }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminDataContext = () => useContext(AdminDataContext);
