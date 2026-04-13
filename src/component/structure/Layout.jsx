import React from "react";
import SideNav from "./SideNav";

function Layout({ children }) {
  return (
    <div style={{ backgroundColor: "#f4f9fd", height: "200vh" }}>
      <div className="row me-0" style={{ padding: "24px" }}>
        <div className="col-md-2">
          <SideNav />
        </div>
        <div className="col-md-10">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
