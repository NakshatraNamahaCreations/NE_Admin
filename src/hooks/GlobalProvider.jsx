import React, { useState } from "react";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState(null);

  return (
    <GlobalContext.Provider value={{ globalData, setGlobalData }}>
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalContext;
