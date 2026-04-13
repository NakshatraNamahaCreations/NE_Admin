import moment from "moment";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "../../../../api-services/apiContents";
import axios from "axios";
import Loader from "../../../loader/Loader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { IoMdArrowBack } from "react-icons/io";
// import { invoiceData } from "../../../../global-data/booking";

function Invoice() {
  let location = useLocation();
  const navigate = useNavigate();
  let invoice = location.state?.invoice || null;
  let user = location.state?.userData || null;
  const [profileData, setProfileData] = useState({});
  const [payoutData, setPayoutData] = useState({});
  const [allAddress, setAllAddress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log("invoice=====", invoice);
  // console.log("user=====", user);

  const bookingId = invoice._id?.slice(-4);
  const userId = user._id?.slice(-4);
  const invoiceNumber = String(userId + bookingId);
  // console.log("invoiceNumber", invoiceNumber);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const profileRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_PROFILE}`,
      );
      if (profileRes.status === 200) {
        const profile = profileRes.data.profile;
        setProfileData(profile);
      }
      const addressRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ADDRESS}`,
      );
      if (addressRes.status === 200) {
        setAllAddress(addressRes.data.data.reverse());
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanyDetails = async () => {
    try {
      const payoutRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_PAYOUT_CONFIG}`,
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
    fetchData();
  }, []);

  useEffect(() => {
    fetchCompanyDetails();
  }, []);
  console.log("payoutData", payoutData);

  const eventState = invoice?.event_location
    ?.split(",")
    .slice(-2, -1)[0]
    ?.trim();
  const branchAddress = allAddress?.find(
    (ele) => ele.state_name === eventState,
  );
  console.log("branchAddress", branchAddress);

  const invoiceInfo = [
    {
      id: 1,
      head: "Invoice #",
      // value: `INV`,
      value: invoice.order_id,
      // value: `INV${invoiceNumber.toUpperCase()}`,
    },
    {
      id: 2,
      head: "Ordered Date",
      value: moment(invoice.ordered_date).format("YYYY-MM-DD"),
    },
    {
      id: 3,
      head: "Venue Name",
      value: invoice.venue_name,
    },
    {
      id: 4,
      head: "Venue Location",
      value: invoice.event_location,
    },
    // {
    //   id: 5,
    //   head: "Venue Available Time",
    //   value: invoice.venue_open_time,
    // },
    {
      id: 6,
      head: "Event Date",
      value: `${invoice.event_date}`,
    },
    {
      id: 6,
      head: "Event Time",
      value: `${invoice.event_start_time} - ${invoice.event_end_time}`,
    },
    {
      id: 7,
      head: "No of Days",
      value: invoice.number_of_days,
    },
  ];

  const billingDetails = [
    {
      id: 1,
      title: "Base Amount",
      value: `₹${invoice.base_amount.toFixed(2)}`,
    },
    {
      id: 2,
      title: "TDS Charges (2%)",
      value: `₹${invoice.tds_deduction.toFixed(2)}`,
    },
    {
      id: 3,
      title: "Amount After TDS Deduction",
      value: `₹${invoice.amount_after_deduction.toFixed(2)}`,
    },

    {
      id: 4,
      title: "CGST 9%",
      value: `₹${(invoice.gst_applied_value / 2).toFixed(2)}`,
    },
    {
      id: 5,
      title: "SGST 9%",
      value: `₹${(invoice.gst_applied_value / 2).toFixed(2)}`,
    },
    {
      id: 6,
      title: "Grand Total",
      value: `₹${invoice.paid_amount.toFixed(2)}`,
    },
  ];

  {
    isLoading && <Loader />;
  }

  const downloadPDF = () => {
    const invoiceElement = document.getElementById("invoiceContent");

    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    });
  };

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
            padding: "3px 5px",
            borderRadius: "3px",
            border: 0,
          }}
          onClick={downloadPDF}
        >
          Download PDF
        </button>
      </div>

      <div
        id="invoiceContent"
        style={{
          backgroundColor: "white",
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          border: "1px solid rgb(202, 202, 202)",
          padding: "10px",
        }}
      >
        <div className="row" style={{ alignItems: "center" }}>
          <div className="col-md-6">
            <h4>KADAGAM VENTURES PRIVATE LIMITED </h4>
          </div>
          <div className="col-md-6">
            <div className="text-end">
              <b>Corporate Address</b>{" "}
            </div>
            <div className="text-end">{profileData.corporate_address}</div>
            <div className="text-end">{profileData.contact_email}</div>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-6 col-sm-4">
            <div className="text-start">
              <b>Branch Address</b>
            </div>
            <div className="text-start">{branchAddress?.address}</div>
            <div className="text-start">
              <b>To:</b>{" "}
            </div>
            <div className="text-start">{invoice.event_location}</div>
            <div className="text-start mt-3">
              GST:
              {user.company_profile?.length > 0
                ? user.company_profile[0]?.gst_number
                : "N/A"}
            </div>
            <div className="text-start ">
              Kind Atte {invoice.receiver_name}{" "}
            </div>
            <div className="text-start ">
              Mobile: +91 {invoice.receiver_mobilenumber}
            </div>
          </div>
          {/* <div className="col-md-4"></div> */}
          <div className="col-md-6 col-sm-8">
            <div className="text-end">
              <b>GSTIN: {payoutData?.company_gst}</b>{" "}
            </div>
            <div className="text-end">
              <b>SAC CODE: {payoutData?.company_saccode}</b>{" "}
            </div>
            <div style={{ border: "1px solid black" }}>
              {invoiceInfo.map((ele, index) => (
                <>
                  <div className="row p-1">
                    <div className=" col-md-6">
                      <b>{ele.head}</b>
                    </div>
                    <div className=" col-md-6">{ele.value}</div>
                  </div>
                  <div
                    style={{
                      borderBottom:
                        invoiceInfo.length - 1 === index
                          ? null
                          : "1px solid black",
                    }}
                  ></div>
                </>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Table style={{ border: "1px solid black" }}>
            <thead>
              <tr>
                <th style={{ backgroundColor: "#c9c9c9" }}>Product</th>
                {/* <th style={{ backgroundColor: "#c9c9c9" }}>Size</th> */}
                <th style={{ backgroundColor: "#c9c9c9" }}>Qty</th>
                <th style={{ backgroundColor: "#c9c9c9" }}>Price</th>
                <th style={{ backgroundColor: "#c9c9c9" }}>Days</th>
                <th style={{ backgroundColor: "#c9c9c9" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.product_data.length > 0 && (
                <tr>
                  <td style={{ backgroundColor: "yellow" }}></td>
                  <td style={{ backgroundColor: "yellow" }} colSpan={1}>
                    <b>Product</b>
                  </td>
                  <td style={{ backgroundColor: "yellow" }}></td>

                  <td style={{ backgroundColor: "yellow" }}></td>

                  <td style={{ backgroundColor: "yellow" }}></td>
                  {/* <td style={{ backgroundColor: "yellow" }}></td> */}
                </tr>
              )}
              {invoice.product_data.map((item) => (
                <tr>
                  <td style={{ width: "500px" }}>
                    {/* {item.productName.length > 20
                      ? item.productName.substring(0, 20) + "..."
                      : */}
                    {item.productName}{" "}
                  </td>
                  {/* <td style={{ width: "300px" }}>{item.productDimension}</td> */}
                  <td style={{ width: "100px" }}>{item.quantity}</td>
                  <td style={{ width: "200px" }}>₹{item.totalPrice}</td>
                  <td style={{ width: "50px" }}>{invoice.number_of_days}</td>
                  <td style={{ width: "200px" }}>
                    ₹{item.totalPrice * invoice.number_of_days}
                  </td>
                </tr>
              ))}
              {invoice.tech_data.length > 0 && (
                <tr>
                  <td style={{ backgroundColor: "yellow" }}></td>
                  <td style={{ backgroundColor: "yellow" }} colSpan={1}>
                    <b>Technician</b>
                  </td>
                  <td style={{ backgroundColor: "yellow" }}></td>

                  <td style={{ backgroundColor: "yellow" }}></td>

                  <td style={{ backgroundColor: "yellow" }}></td>
                  {/* <td style={{ backgroundColor: "yellow" }}></td> */}
                </tr>
              )}
              {invoice.tech_data.map((item) => (
                <tr>
                  <td style={{ width: "500px" }}>{item.service_name} </td>
                  {/* <td style={{ width: "300px" }}>-</td> */}
                  <td style={{ width: "100px" }}>-</td>
                  <td style={{ width: "200px" }}>₹{item.totalPrice}</td>
                  <td style={{ width: "50px" }}>{invoice.number_of_days}</td>
                  <td style={{ width: "200px" }}>
                    ₹{item.totalPrice * invoice.number_of_days}
                  </td>
                </tr>
              ))}
              {invoice.service_data.length > 0 && (
                <tr>
                  <td style={{ backgroundColor: "yellow" }}></td>
                  <td style={{ backgroundColor: "yellow" }} colSpan={1}>
                    <b>Service</b>
                  </td>
                  <td style={{ backgroundColor: "yellow" }}></td>
                  <td style={{ backgroundColor: "yellow" }}></td>

                  <td style={{ backgroundColor: "yellow" }}></td>
                  {/* <td style={{ backgroundColor: "yellow" }}></td> */}
                </tr>
              )}
              {invoice.service_data.map((item) => (
                <tr>
                  <td style={{ width: "500px" }}>
                    <div>{item.productName}</div>
                    {item.addons &&
                      item.addons.length > 0 &&
                      item.addons.map((addon, addonIndex) => (
                        <div
                          key={`addon-${addonIndex}`}
                          style={{
                            fontSize: 12,
                            color: "black",
                            marginTop: 3,
                          }}
                        >
                          {addon.service_name} - ₹{addon.price}
                        </div>
                      ))}
                  </td>
                  <td style={{ width: "300px" }}>{item.quantity} </td>
                  <td style={{ width: "100px" }}>₹{item.totalPrice}</td>
                  <td style={{ width: "50px" }}>{invoice.number_of_days}</td>
                  <td style={{ width: "200px" }}>
                    ₹{item.totalPrice * invoice.number_of_days}
                  </td>
                </tr>
              ))}
            </tbody>
            <tbody className="mt-3" style={{ border: "2px solid black" }}>
              {billingDetails.map((ele) => (
                <tr>
                  <td>
                    <b>{ele.title}</b>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  {/* <td></td> */}
                  <td>
                    {" "}
                    <b>{ele.value}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* <div className="mt-3">
            <div>
              <b>Terms & Conditions</b>{" "}
            </div>
          </div> */}
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

export default Invoice;
