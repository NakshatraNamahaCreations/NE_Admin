import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../../loader/Loader";
import axios from "axios";
import { apiUrl } from "../../../../api-services/apiContents";
import moment from "moment";
// import "./payout.module.css";

function TechPayoutDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const payouts = location.state.details;

  const [isLoading, setIsLoading] = useState(false);
  const [sellerData, setSellerData] = useState([]);
  const [remark, setRemark] = useState("");
  const [processedDate, setProcessedDate] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [failureRemarks, setFailureRemarks] = useState("");

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const userRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_VENDOR_PROFILE}${payouts.seller_id}`,
      );
      if (userRes.status === 200) {
        setSellerData(userRes.data);
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

  console.log("payout details", payouts);
  console.log("sellerDataS", sellerData);

  // const commissionAmount = parseFloat((2000 * (10 / 100)).toFixed(2));
  // const commissionTax = parseFloat((commissionAmount * (18 / 100)).toFixed(2));
  // const payoutsAmount = parseFloat(
  //   (2000 - (commissionAmount + commissionTax)).toFixed(2)
  // );
  const commissionPercentageValue = payouts.commission_percentage ?? 0;
  const commissionTaxValue = payouts.commission_tax ?? 0;
  const commissionAmount = parseFloat(
    (payouts.payment_amount * (commissionPercentageValue / 100)).toFixed(2),
  );
  const commissionTax = parseFloat(
    (commissionAmount * (commissionTaxValue / 100)).toFixed(2),
  );
  const payoutsAmount = parseFloat(
    (payouts.payment_amount - (commissionAmount + commissionTax)).toFixed(2),
  );

  // console.log("commissionAmount", commissionAmount);
  // console.log("commissionTax", commissionTax);
  // console.log("payoutsAmount", payoutsAmount);

  const createPayout = async () => {
    try {
      if (!remark) {
        alert("Please enter a remark");
      } else {
        const response = await axios.post(
          // `http://localhost:9000/api${apiUrl.ADD_TECH_PAYOUTS}`,
          `${apiUrl.BASEURL}${apiUrl.ADD_TECH_PAYOUTS}`,
          {
            store: sellerData.shop_name,
            seller_id: sellerData._id,
            ordered_date: payouts.ordered_date,
            event_name: payouts.event_name,
            event_id: payouts.event_id,
            created_date: moment().format("lll"),
            updated_by: "Admin",
            commission_percentage: payouts.commission_percentage,
            commission_amount: commissionAmount,
            tax_percentage: payouts.commission_tax,
            tax_amount: commissionTax,
            payout_amount: payoutsAmount,
            seller_name: sellerData.vendor_name,
            remark: remark,
          },
        );
        if (response.status === 200) {
          console.log(response.data);
          alert("Payout Initialized!");
          navigate(-1);
          // window.location.assign("/payouts");
        }
      }
    } catch (error) {
      console.error("Failed to create payout:", error);
    }
  };

  const confirmPayoutProcessed = async () => {
    try {
      if (!remark || !processedDate) {
        alert("Please enter a Process Remarks and Processed Date");
      } else {
        const response = await axios.put(
          // `http://localhost:9000/api${apiUrl.CONFIRM_TECH_PAYOUT}${payouts.payout_id}`,
          `${apiUrl.BASEURL}${apiUrl.CONFIRM_TECH_PAYOUT}${payouts.payout_id}`,
          {
            created_date: moment().format("lll"),
            updated_by: "Admin",
            processed_date: processedDate,
            remark: remark,
            transaction_Id: transactionId,
          },
        );
        if (response.status === 200) {
          console.log(response.data);
          alert("Payout Processed Successfully!");
          navigate(-1);
          // setTimeout(() => {
          //   navigate("/payouts");
          //   // window.location.assign("/payouts");
          // }, 1000);
          // window.location.assign("/payouts");
        }
      }
    } catch (error) {
      console.error("Failed to create payout:", error);
    }
  };

  // chage rhe url to failuter later
  const updateFailureStatus = async () => {
    try {
      if (!failureRemarks) {
        alert("Please enter a failure Remarks");
      } else {
        const response = await axios.put(
          `${apiUrl.BASEURL}${apiUrl.CONFIRM_PAYOUT}${payouts.payout_id}`,
          {
            created_date: moment().format("lll"),
            updated_by: "Admin",
            payout_status: "Failure",
            failureRemarks: failureRemarks,
          },
        );
        if (response.status === 200) {
          console.log(response.data);
          alert("Payout Processed Failed!");
          navigate(-1);
          // window.location.assign("/payouts");
        }
      }
    } catch (error) {
      console.error("Failed to create payout:", error);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "10px 20px",
        }}
      >
        <div className="headerTitle-0-1-70 mb-3">Payout Details</div>
        <table
          className="table"
          style={{
            // backgroundColor: "white",
            border: "1px solid #f4f4f4",
            // borderTopLeftRadius: "5px",
            // borderTopRightRadius: "5px",
          }}
        >
          {payouts.payout_status === "Initialized" && (
            <tr style={styles.tableRow}>
              <th style={styles.tableHeader}>Payout ID </th>
              <td style={styles.tableData}>
                {payouts.payout_id.toUpperCase()}
              </td>
            </tr>
          )}
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Seller </th>
            <td style={styles.tableData}>
              {payouts.seller_name}, +91-{sellerData.mobile_number}{" "}
            </td>
          </tr>

          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Store/Business Name </th>
            <td style={styles.tableData}>{payouts.store}</td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Order ID </th>
            <td style={styles.tableData}>{payouts.order_id}</td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Event Name </th>
            <td style={styles.tableData}>{payouts.event_name}</td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Order Date </th>
            <td style={styles.tableData}>
              {moment(payouts.ordered_date).format("lll")}
            </td>
          </tr>
          {/* <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Ticket ID </th>
            <td style={styles.tableData}>dashed</td>
          </tr> */}
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Order Amount ₹ </th>
            <td style={styles.tableData}>
              ₹{payouts.payment_amount.toFixed(2)}
            </td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Commission % </th>
            <td style={styles.tableData}>
              {(payouts.commission_percentage ?? 0)?.toFixed(2)} %
            </td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Commission ₹ </th>
            <td style={styles.tableData}>₹{commissionAmount}</td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Commission Tax % </th>
            <td style={styles.tableData}>
              {(payouts.commission_tax ?? 0)?.toFixed(2)} %
            </td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Commission Tax ₹ </th>
            <td style={styles.tableData}>₹{commissionTax}</td>
          </tr>
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>Payout Amount ₹</th>
            <td style={styles.tableData}>₹{payoutsAmount}</td>
          </tr>
          {payouts.payout_status === "Initialized" && (
            <>
              <tr style={styles.tableRow}>
                <th style={styles.tableHeader}>Bank Name</th>
                <td style={styles.tableData}>{sellerData.bank_name}</td>
              </tr>
              <tr style={styles.tableRow}>
                <th style={styles.tableHeader}>Account Number</th>
                <td style={styles.tableData}>{sellerData.account_number}</td>
              </tr>
              <tr style={styles.tableRow}>
                <th style={styles.tableHeader}>IFSC</th>
                <td style={styles.tableData}>{sellerData.ifsc_code}</td>
              </tr>
              <tr style={styles.tableRow}>
                <th style={styles.tableHeader}>Payout Status</th>
                <td style={styles.tableData}>{payouts.payout_status}</td>
              </tr>
              <tr style={styles.tableRow}>
                <th style={styles.tableHeader}>Initialized Date</th>
                <td style={styles.tableData}>{payouts.created_date}</td>
              </tr>
              <tr style={styles.tableRow}>
                <th style={styles.tableHeader}>Created By</th>
                <td style={styles.tableData}>{payouts.updated_by}</td>
              </tr>
            </>
          )}
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>
              {payouts.payout_status === "Initialized"
                ? "Process Remark"
                : "Remark"}
              <span style={{ color: "Red" }}>*</span>
            </th>
            <td style={styles.tableData}>
              <textarea
                onChange={(e) => setRemark(e.target.value)}
                style={{
                  width: "300px",
                  height: "96px",
                  borderRadius: "5px",
                  border: "1px solid #ebedf2",
                }}
              />
            </td>
          </tr>
          {payouts.payout_status === "Initialized" && (
            <>
              <tr style={styles.tableRow}>
                <th style={styles.tableHeader}>
                  Processed Date <span style={{ color: "Red" }}>*</span>
                </th>
                <td style={styles.tableData}>
                  <input
                    style={{
                      borderRadius: "5px",
                      border: "1px solid #ebedf2",
                    }}
                    type="date"
                    onChange={(e) => setProcessedDate(e.target.value)}
                  />
                </td>
              </tr>
              <tr style={styles.tableRow}>
                <th style={styles.tableHeader}>Transaction ID (Optional)</th>
                <td style={styles.tableData}>
                  <input
                    style={{
                      width: "300px",
                      borderRadius: "5px",
                      border: "1px solid #ebedf2",
                    }}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </td>
              </tr>
            </>
          )}
          <tr style={styles.tableRow}>
            <th style={styles.tableHeader}>
              <div
                style={{
                  textAlign: "center",
                  borderRadius: "3px",
                  backgroundColor: "#177dff",
                  border: 0,
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={
                  payouts.payout_status === "Initialized"
                    ? confirmPayoutProcessed
                    : createPayout
                }
              >
                {payouts.payout_status === "Initialized"
                  ? "Confirm Payout Processed"
                  : "Submit"}
              </div>{" "}
            </th>{" "}
            <th>
              <div
                onClick={() => window.location.assign("/payouts")}
                style={{
                  textAlign: "center",
                  borderRadius: "3px",
                  backgroundColor: "#f3545d",
                  border: 0,
                  color: "white",
                  cursor: "pointer",
                  width: "150px",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Back
              </div>
            </th>
          </tr>
        </table>
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
};

export default TechPayoutDetails;
