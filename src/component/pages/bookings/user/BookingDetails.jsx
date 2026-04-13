import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LiaRupeeSignSolid } from "react-icons/lia";
import axios from "axios";
import { apiUrl } from "../../../../api-services/apiContents";
import Loader from "../../../loader/Loader";
import { IoMdArrowBack } from "react-icons/io";

function BookingDetails() {
  const Navigate = useNavigate();
  let location = useLocation();
  let bookingData = location.state?.row || null;
  console.log("bookingData", bookingData);
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigateToInvoice = () => {
    Navigate("/booking/invoice", {
      state: {
        invoice: bookingData,
        userData: userData,
      },
    });
  };

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const userRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_PARTICULAR_USER}${bookingData.user_id}`,
      );
      if (userRes.status === 200) {
        // console.log("userRes", userRes);
        setUserData(userRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  console.log("userRes", userData);

  //  const combinedProductAndTech = userData.filter

  return (
    <div className="mt-2">
      {isLoading && <Loader />}
      <div className="px-3" style={{ backgroundColor: "white" }}>
        <div
          className="py-2"
          style={{
            cursor: "pointer",
          }}
          onClick={() => Navigate(-1)}
        >
          <IoMdArrowBack size={15} color="black" />
        </div>
        <table
          className="table border-top-for-all-border"
          style={{
            backgroundColor: "white",
            border: "1px solid #f4f4f4",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
          }}
        >
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Order ID</th>
            <td style={styles.tableData}>{bookingData.order_id}</td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>User Name</th>
            <td style={styles.tableData}>{userData.username} </td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Mobile</th>
            <td style={styles.tableData}>{userData.mobilenumber} </td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Email</th>
            <td style={styles.tableData}>{userData.email} </td>
          </tr>

          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Event Name</th>
            <td style={styles.tableData}>{bookingData.event_name} </td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Number of Days</th>
            <td style={styles.tableData}>{bookingData.number_of_days}</td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Event Date</th>
            <td style={styles.tableData}>
              {bookingData.event_start_date} to {bookingData.event_end_date}
            </td>
          </tr>

          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Event Time</th>
            <td style={styles.tableData}>
              {bookingData.event_start_time} to {bookingData.event_end_time}
            </td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Setup Date</th>
            <td style={styles.tableData}>
              {bookingData.setup_start_date} to {bookingData.setup_end_date}
            </td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Setup Time</th>
            <td style={styles.tableData}>
              {bookingData.setup_start_time} to{" "}
              {bookingData.setup_end_time}{" "}
            </td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Rehearsal Date</th>
            <td style={styles.tableData}>{bookingData.rehearsal_date}</td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Rehearsal Time</th>
            <td style={styles.tableData}>
              {bookingData.rehearsal_start_time} to{" "}
              {bookingData.rehearsal_end_time}
            </td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Venue Name</th>
            <td style={styles.tableData}>{bookingData.venue_name}</td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Address</th>
            <td style={styles.tableData}>{bookingData.event_location}</td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Order Status</th>
            <td style={styles.tableData}>{bookingData.order_status} </td>
          </tr>
          {bookingData.order_status === "Order Rescheduled" ||
          bookingData.order_status === "Order Cancelled" ? (
            <tr style={styles.tableRow}>
              <th style={styles.tableHeader}>Reason</th>
              <td style={styles.tableData}>
                {bookingData.order_status === "Order Rescheduled"
                  ? bookingData.reschedule_remark
                  : bookingData.order_status === "Order Cancelled"
                    ? bookingData.cancel_reason
                    : ""}
              </td>
            </tr>
          ) : null}

          {bookingData.product_data.length > 0 && (
            <tr style={styles.tableRow}>
              <th style={styles.tableHeader}>Products</th>
              <td style={styles.tableData}>
                <div className="row">
                  {bookingData.product_data.map((ele, index) => (
                    <div className="col-md-3 mb-2">
                      <div
                        className="card"
                        style={{
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                          border: 0,
                        }}
                      >
                        <div className="p-2">
                          <div>
                            <label
                              style={{
                                backgroundColor: "#f39c12",
                                color: "white",
                                padding: "0.2em 0.3em",
                                borderRadius: "5px",
                              }}
                            >
                              #{index + 1}
                            </label>
                          </div>
                          <div>
                            <span style={styles.itemsHead}> Item Name : </span>{" "}
                            {ele.productName.length > 30
                              ? ele.productName.substring(0, 30) + "..."
                              : ele.productName}
                          </div>
                          <div>
                            <span style={styles.itemsHead}> Vendor : </span>{" "}
                            {ele.store}
                          </div>
                          <div>
                            <span style={styles.itemsHead}> Quantity : </span>
                            {ele.quantity}
                          </div>
                          <div>
                            <span style={styles.itemsHead}> Price : </span>{" "}
                            {ele.productPrice?.toFixed(2)}/day
                          </div>
                          <div
                            style={{ borderBottom: "1px dashed #186f65" }}
                          ></div>
                          <div>
                            <span style={styles.itemsHead}>
                              {" "}
                              Subtotal(
                              <LiaRupeeSignSolid />) :
                            </span>{" "}
                            {ele.totalPrice?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          )}
          {bookingData.service_data.length > 0 && (
            <tr style={styles.tableRow}>
              <th style={styles.tableHeader}>Service</th>
              <td style={styles.tableData}>
                <div className="row">
                  {bookingData.service_data.map((ele, index) => (
                    <div className="col-md-3 mb-2">
                      <div
                        className="card"
                        style={{
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                          border: 0,
                        }}
                      >
                        <div className="p-2">
                          <div>
                            <label
                              style={{
                                backgroundColor: "#f39c12",
                                color: "white",
                                padding: "0.2em 0.3em",
                                borderRadius: "5px",
                              }}
                            >
                              #{index + 1}
                            </label>
                          </div>
                          <div>
                            <span style={styles.itemsHead}>
                              {" "}
                              Service Name :{" "}
                            </span>{" "}
                            {ele.productName}
                          </div>
                          <div>
                            <span style={styles.itemsHead}> Vendor : </span>{" "}
                            {ele.sellerName}
                          </div>
                          <div>
                            <span style={styles.itemsHead}> Price : </span>{" "}
                            {ele.productPrice?.toFixed(2)}/day
                          </div>
                          <div style={{ borderBottom: "1px dashed #186f65" }} />
                          {ele.addons?.length > 0 ? (
                            <>
                              <div>
                                <span
                                  style={{
                                    color: "#186f65",
                                    fontWeight: "600",
                                    fontSize: "11px",
                                  }}
                                >
                                  ● Addons
                                </span>
                                {ele.addons?.map((add) => (
                                  <div>
                                    <span style={styles.itemsHead}>
                                      {add.service_name} :
                                    </span>{" "}
                                    {add.price?.toFixed(2)}/day
                                  </div>
                                ))}
                              </div>
                              <div
                                style={{ borderBottom: "1px dashed #186f65" }}
                              />
                            </>
                          ) : null}
                          <div>
                            <span style={styles.itemsHead}>
                              {" "}
                              Subtotal(
                              <LiaRupeeSignSolid />) :
                            </span>{" "}
                            {ele.totalPrice?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          )}
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>CGST(₹)</th>
            <td style={styles.tableData}>
              {(bookingData.gst_applied_value / 2)?.toFixed(2)}
            </td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>SGST(₹)</th>
            <td style={styles.tableData}>
              {(bookingData.gst_applied_value / 2)?.toFixed(2)}
            </td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Total(₹)</th>
            <td style={styles.tableData}>
              {bookingData.paid_amount?.toFixed(2)}
            </td>
          </tr>
        </table>
        <div
          className="mb-2"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <button
            style={styles.buttonForEveything}
            onClick={() => navigateToInvoice()}
          >
            {/* <i className="fa fa-download"></i> */}
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
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
    padding: "8px",
  },
  itemsHead: {
    color: "#333",
    fontWeight: "600",
    fontSize: "14px",
  },
  buttonForEveything: {
    backgroundColor: "#609ecc",
    border: "#7ac539",
    color: "white",
    borderRadius: "3px",
    fontSize: "14px",
    padding: "5px 10px",
    marginBottom: "13px",
  },
};
export default BookingDetails;
