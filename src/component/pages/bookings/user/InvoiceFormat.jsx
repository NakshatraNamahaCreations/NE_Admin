import React from "react";
// import { Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
// import { invoiceData } from "../../../../global-data/booking";

function InvoiceFormat() {
  let location = useLocation();
  let invoice = location.state?.invoice || null;
  let user = location.state?.userData || null;
  console.log("invoice=====", invoice);
  console.log("user=====", user);

  return (
    <>
      <div className="mb-2">
        <button
          style={{
            color: "white",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "14px",
            cursor: "pointer",
            backgroundColor: "#2F4E9E",
            padding: "0px 5px",
            borderRadius: "3px",
            // border: "1px solid #8080802b",
            // borderColor: "gray",
          }}
          onClick={() => window.print()}
        >
          <i className="fa-solid fa-print"></i> Print
        </button>
      </div>

      <div
        id="invoiceContent"
        style={{
          backgroundColor: "white",
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          border: "1px solid rgb(202, 202, 202)",
          padding: 10,
        }}
      >
        <div className="row">
          <div className="col-md-6">
            <div
              style={{
                color: "black",
                textDecoration: "none",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Nithya Events
            </div>
          </div>
          <div className="col-md-6" style={{ alignItems: "flex-end" }}>
            <div className="text-end">34 & 35, Venkatappa Road,</div>
            <div className="text-end">Taskar Town, Off. Queen Road,</div>
            <div className="text-end">Bangalore -560 051,</div>
            <div className="text-end">support@nithyaevent.com</div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="text-start">
              <b>To:</b>{" "}
            </div>
            <div className="text-start">{invoice.event_location}</div>
            <div className="text-start mt-3">
              GST:{" "}
              {user.company_profile?.length > 0
                ? user.company_profile[0]?.gst_number
                : "N/A"}
            </div>
            <div className="text-start mt-3">
              Kind Att
              {invoice.receiver_name}
            </div>
            <div className="text-start mt-3">
              Mobile: +91 {invoice.receiver_mobilenumber}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  tableRow: {
    borderBottom: "1px solid #f4f4f4",
  },
  tableData: {
    borderLeft: "1px solid #f4f4f4",
    padding: "8px",
    fontSize: "14px",
  },
  tableHeader: {
    width: "150px",
    color: "#333",
    fontWeight: "600",
    fontSize: "14px",
    paddingTop: "8px",
    // backgroundColor: "#2F4E9E",
  },
  invoiceTotal: {
    color: "#333",
    fontWeight: "600",
    fontSize: "16px",
    padding: "2px",
  },
  invoiceTextTable: {
    padding: "10px",
    fontSize: "14px",
  },
  invoiceAddress: {
    fontSize: "14px",
  },
  invoiceText: {
    fontSize: "16px",
    padding: "2px",
  },
};

export default InvoiceFormat;
