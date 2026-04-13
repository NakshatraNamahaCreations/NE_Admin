import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiUrl } from "../../../../api-services/apiContents";

const ViewInvoice = () => {
  const location = useLocation();
  const invoice = location.state?.data || null;
  console.log("invoice", invoice);
  const [profileData, setProfileData] = useState({});
  const [payoutData, setPayoutData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const profileRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_PROFILE}`
      );
      if (profileRes.status === 200) {
        const profile = profileRes.data.profile;
        setProfileData(profile);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      const payoutRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_PAYOUT_CONFIG}`
      );
      if (payoutRes.status === 200) {
        const payout = payoutRes.data.data;
        setPayoutData(payout);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  console.log("profileData", profileData);

  const downloadPDF = () => {
    const invoiceElement = document.getElementById("invoiceContent");

    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", [imgWidth, imgHeight]);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoice.vendor?.vendor_name}.pdf`);
    });
  };

  return (
    <>
      <div
        id="invoiceContent"
        style={{
          padding: 20,
          fontFamily: "Montserrat, sans-serif",
          fontSize: 14,
        }}
      >
        <div style={{ border: "1px solid black", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ flex: 1 }}>
              <h5>KADAGAM VENTURES PRIVATE LIMITED</h5>
              <div>{profileData.corporate_address}</div>
              <div>{profileData.contact_email}</div>
              <div>+91-{profileData.contact_phone}</div>
              <div>GSTIN: {payoutData?.company_gst}</div>
            </div>

            <div
              style={{
                flex: 0.4,
                border: "2px dashed #e91e63",
                color: "#e91e63",
                textAlign: "center",
                padding: "10px 0",
                alignSelf: "center",
              }}
            >
              <h2 style={{ margin: 0 }}>VENDOR</h2>
              <h2 style={{ margin: 0 }}>INVOICE</h2>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <div style={{ flex: 1 }}>
              <h6>
                <strong>Billed From:</strong>
              </h6>
              <div style={{ fontWeight: "600" }}>
                {invoice.vendor?.shop_name}
              </div>
              <div>{invoice.vendor?.vendor_name}</div>
              <div>
                {invoice.vendor?.address[0]?.houseFlatBlock},{" "}
                {invoice.vendor?.address[0]?.roadArea}{" "}
                {invoice.vendor?.address[0]?.cityDownVillage}
              </div>
              <div>
                {invoice.vendor?.address[0]?.distric} -{" "}
                {invoice.vendor?.address[0]?.pincode},{" "}
                {invoice.vendor?.address[0]?.state}
              </div>
              <div style={{ fontWeight: "600" }}>{invoice.vendor?.email}</div>
              <div style={{ fontWeight: "600" }}>
                +91-{invoice.vendor?.mobile_number}
              </div>
              <div>GSTIN: {invoice.vendor?.gst_number || "NA"}</div>
            </div>
            <div style={{ flex: "0.4 1 0%" }}>
              <p>
                <strong>Invoice No:</strong> {invoice.invoice_number}
              </p>
              <p>
                <strong>Event Name:</strong> {invoice.event?.event_name}
              </p>
              <p>
                <strong>Event Date:</strong>{" "}
                {moment(invoice.event?.event_start_date).format("ll")} -{" "}
                {moment(invoice.event?.event_end_date).format("ll")}
              </p>
              <p>
                <strong>Invoice Date:</strong> {invoice.generated_date}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ccc",
              }}
            >
              <thead style={{ backgroundColor: "#fce4ec" }}>
                <tr>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Quantity</th>
                  <th style={thStyle}>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((ele, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td style={tdStyle}>{ele.productName}</td>
                      <td style={tdStyle}>{ele.price}</td>
                      <td style={tdStyle}>{ele.qty}</td>
                      <td style={tdStyle}>{ele.total}</td>
                    </tr>
                    {ele.addons?.map((item, subIndex) => (
                      <tr key={`addon-${subIndex}`}>
                        <td style={tdStyle}>{item.service_name}</td>
                        <td style={tdStyle}>{item.price}</td>
                        <td style={tdStyle}>1</td>
                        <td style={tdStyle}>{item.price}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", marginTop: 30 }}>
            <div style={{ flex: 0.7, marginTop: "40px" }}>
              <p>
                <strong>{invoice.amount_in_words} </strong>
              </p>
            </div>
            <div style={{ flex: 0.5 }}>
              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td>
                      <strong>Sub Total</strong>
                    </td>
                    <td style={{ textAlign: "left" }}>{invoice.subtotal}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Commission (20%)</strong>
                    </td>
                    <td style={{ textAlign: "left" }}>
                      - {invoice.commission_applied}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Tax (18%)</strong>
                    </td>
                    <td style={{ textAlign: "left" }}>
                      - {invoice.tax_applied}
                    </td>
                  </tr>
                  <tr style={{ fontSize: "17px" }}>
                    <td>
                      <strong>Amount To be Paid</strong>
                    </td>
                    <td style={{ textAlign: "left" }}>
                      <strong>{invoice.amount_to_paid}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button
          onClick={downloadPDF}
          style={{
            padding: "10px 20px",
            backgroundColor: "#e91e63",
            border: "none",
            borderRadius: 6,
            color: "#fff",
            fontWeight: 600,
            //   cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          Download Invoice
        </button>
      </div>
    </>
  );
};

// Styling for table
const thStyle = {
  padding: 10,
  border: "1px solid #ccc",
  textAlign: "center",
  fontWeight: "bold",
};

const tdStyle = {
  padding: 10,
  border: "1px solid #ccc",
  textAlign: "center",
};

export default ViewInvoice;
