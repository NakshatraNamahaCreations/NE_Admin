import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { get } from "../../../../api-services/apiHelper";
import Loader from "../../../loader/Loader";
import { apiUrl } from "../../../../api-services/apiContents";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Badge, Button, Modal } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { FaRegFileAlt } from "react-icons/fa";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { TbFileTypeXls } from "react-icons/tb";
import { FaFilter } from "react-icons/fa";
import * as XLSX from "xlsx";
import { get } from "../../../../api-services/apiHelper";
// import styles from "./payout.module.css";

function ServicePayouts() {
  const Navigate = useNavigate();
  const [userBookingData, setUserBookingData] = useState([]);
  const [payoutData, setPayoutData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderToDate, setOrderToDate] = useState("");
  const [payoutStatus, setPayoutStatus] = useState("");
  const [orderFromDate, setOrderFromDate] = useState("");
  const [searchVendor, setSearchVendor] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusType, setStatusType] = useState(null);
  const [viewPayouts, setViewPayouts] = useState([]);
  const [searchByName, setSearchByName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_ALL_ORDER}`);
        if (res.status === 200) {
          setUserBookingData(res.data);
        }
        const data = await get(apiUrl.GET_APPROVED_VENDOR);
        const filterOnlyServiceVendor = data?.filter(
          (item) =>
            item.profession !== "Vendor & Seller" && item.is_approved === true,
        );

        setVendors(filterOnlyServiceVendor);

        const payoutRes = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_ALL_PAYOUTS}`,
        );
        if (payoutRes.status === 200) {
          setPayoutData(payoutRes.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const showProcessedDetails = (row) => {
    setShowModal(true);
    setRowData(row);
  };
  // console.log("vrndr", vendors);

  const calculateTotalBySeller = (data) => {
    return data.map((event) => {
      const sellerMap = event?.service_data?.reduce((acc, seller) => {
        if (!acc[seller.id]) {
          acc[seller.id] = {
            event_name: event.event_name,
            // ...seller,
            event_id: event._id,
            order_id: event.order_id,
            ordered_date: event.ordered_date,
            seller_id: seller.sellerId,
            seller_name: seller.sellerName,
            commission_percentage: seller.commissionPercentage,
            commission_tax: seller.commissionTax,
            store: seller.store,
            payment_amount: 0,
          };
        }
        acc[seller.id].payment_amount += seller.totalPrice;
        return acc;
      }, {});
      const groupedSellers = Object.values(sellerMap);
      return {
        ...event,
        sellers: groupedSellers,
      };
    });
  };

  const paymentSellers = calculateTotalBySeller(userBookingData).flatMap(
    (ele) => ele.sellers,
  );
  console.log("userBookingData", userBookingData);
  console.log("paymentSellers", paymentSellers);
  // console.log("payoutData", payoutData);

  const payoutSellers = paymentSellers.map((seller) => {
    const matchedPayout = payoutData.find(
      (payout) =>
        payout.seller_id === seller.seller_id &&
        payout.event_id === seller.event_id,
    );
    // console.log("matchedPayout", matchedPayout);

    return {
      ...seller,
      updated_by: matchedPayout ? matchedPayout.updated_by : null,
      created_date: matchedPayout ? matchedPayout.created_date : null,
      payout_status: matchedPayout ? matchedPayout.payout_status : "Pending",
      payout_id: matchedPayout ? matchedPayout._id : null,
      processed_date: matchedPayout ? matchedPayout.processed_date : null,
      transaction_Id: matchedPayout ? matchedPayout.transaction_Id : null,
      remark: matchedPayout ? matchedPayout.remark : null,
      // payout_amount: matchedPayout ? matchedPayout.payout_amount : 0,
      // tax_amount: matchedPayout ? matchedPayout.tax_amount : 0,
      // commission_amount: matchedPayout ? matchedPayout.commission_amount : 0,
    };
  });
  // console.log("payoutSellers", payoutSellers);

  const processedRows = payoutSellers.map((row) => {
    const commissionPercentageValue = row.commission_percentage ?? 0;
    const commissionTaxValue = row.commission_tax ?? 0;

    const commissionPercentage =
      row.payment_amount * (commissionPercentageValue / 100);
    const commissionTax = commissionPercentage * (commissionTaxValue / 100);
    const totalDeduction =
      row.payment_amount - (commissionPercentage + commissionTax);

    return {
      ...row,
      commission_amount: parseFloat(commissionPercentage.toFixed(2)),
      tax_amount: parseFloat(commissionTax.toFixed(2)),
      payout_amount: parseFloat(totalDeduction.toFixed(2)),
    };
  });
  // console.log("processedRows", processedRows);

  // const handleFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [name]: value,
  //   }));
  // };

  // filter for Seller, Payout Status, Order From Date, Order To Date from processedRows?
  const filterProcessedRows = (rows) => {
    return rows.filter((row) => {
      const matchesSearches =
        (searchByName &&
          row.event_name?.toLowerCase().includes(searchByName.toLowerCase())) ||
        row.seller_name?.toLowerCase().includes(searchByName.toLowerCase());

      const matchesSeller = searchVendor
        ? row.seller_id === searchVendor
        : true;
      const matchesPayoutStatus = payoutStatus
        ? row.payout_status === payoutStatus
        : true;
      const matchesOrderFromDate = orderFromDate
        ? new Date(row.ordered_date) >= new Date(orderFromDate)
        : true;
      const matchesOrderToDate = orderToDate
        ? new Date(row.ordered_date) <= new Date(orderToDate)
        : true;

      return (
        matchesSearches &&
        matchesSeller &&
        matchesPayoutStatus &&
        matchesOrderFromDate &&
        matchesOrderToDate
      );
    });
  };

  const filteredRows = filterProcessedRows(processedRows);

  const resetFilters = () => {
    setSearchVendor("");
    setPayoutStatus("");
    setOrderFromDate("");
    setOrderToDate("");
  };

  // CALCULATION FOR COMMISSION---------------------
  // OLD ONE- WORKING
  // const commissionCalculation = (row) => {
  //   const commissionPercentage =
  //     row.payment_amount * (row.commission_percentage / 100);
  //   const commissionTax = commissionPercentage * (row.commission_tax / 100);
  //   const totalDeduction =
  //     row.payment_amount - (commissionPercentage + commissionTax);

  //   setDeductionAmount(totalDeduction);
  //   return {
  //     commissionAmount: `₹${commissionPercentage.toFixed(2)}`,
  //     commissionTax: `₹${commissionTax.toFixed(2)}`,
  //     totalDeduction: `₹${totalDeduction.toFixed(2)}`,
  //   };
  // };

  // console.log("deductionAmout", deductionAmout);

  //  PENDINGS
  const getPendings = processedRows?.filter(
    (item) => item.payout_status === "Pending",
  );
  const pendingAmount = getPendings.reduce(
    (acc, value) => acc + value.payout_amount,
    0,
  );
  // console.log("pendingAmount", pendingAmount);

  // INITIALIZED
  const getInitialized = processedRows?.filter(
    (item) => item.payout_status === "Initialized",
  );
  const processingAmount = getInitialized.reduce(
    (acc, value) => acc + value.payout_amount,
    0,
  );
  // console.log("processingAmount", processingAmount);
  // PROCESSES
  const getProcessed = processedRows?.filter(
    (item) => item.payout_status === "Processed",
  );
  const processedAmount = getProcessed.reduce(
    (acc, value) => acc + value.payout_amount,
    0,
  );

  const handleOpenModal = (value) => {
    setViewPayouts(
      value === "Processed"
        ? getProcessed
        : value === "Processing"
          ? getInitialized
          : value === "Pending"
            ? getPendings
            : null,
    );
    setStatusType(value);
    setIsModalOpen(true);
  };

  // console.log("pendingAmount", pendingAmount);
  const goInvoice = (row) => {
    Navigate("/payout-invoice", {
      state: {
        product: row,
      },
    });
  };
  const goDetails = (row) => {
    Navigate("/payouts-details", {
      state: {
        details: row,
      },
    });
  };

  const processPayout = [
    {
      header: "Payout ID",
      data: rowData?.payout_id.toUpperCase(),
    },
    {
      header: "Seller",
      data: rowData?.seller_name,
    },
    {
      header: "Store/Business Name",
      data: rowData?.seller_name,
    },
    {
      header: "Order ID",
      data: rowData?.order_id,
    },
    {
      header: "Event Name",
      data: rowData?.event_name,
    },
    {
      header: "Order Date",
      data: moment(rowData?.ordered_date).format("lll"),
    },
    {
      header: "Order Amount ₹",
      data: "₹" + rowData?.payment_amount.toFixed(2),
    },
    {
      header: "Commission %",
      data: (rowData?.commission_percentage ?? 0) + "%",
    },
    {
      header: "Commission ₹",
      data: "₹" + rowData?.commission_amount,
    },
    {
      header: "Commission Tax % ",
      data: (rowData?.commission_tax ?? 0) + "%",
    },
    {
      header: "Commission Tax ₹",
      data: "₹" + rowData?.tax_amount,
    },
    {
      header: "Payout Amount ₹",
      data: "₹" + rowData?.payout_amount,
    },
    {
      header: "Bank Name",
      data: rowData?.bank_name,
    },
    {
      header: "Account Number",
      data: rowData?.account_number,
    },
    {
      header: "IFSC",
      data: rowData?.ifsc_code,
    },
    {
      header: "Payout Status",
      data: rowData?.payout_status,
    },
    {
      header: "Initialized Date",
      data: rowData?.created_date,
    },
    {
      header: "Created By",
      data: rowData?.updated_by,
    },
    {
      header: "Process Remark",
      data: rowData?.remark,
    },
    {
      header: "Processed Date",
      data: moment(rowData?.processed_date).format("lll"),
    },
    {
      header: "Transaction ID",
      data: rowData?.transaction_Id,
    },
    // {
    //   header: "Seller",
    //   data: "",
    // },
    // {
    //   header: "Seller",
    //   data: "",
    // },
    // {
    //   header: "Seller",
    //   data: "",
    // },
    // {
    //   header: "Seller",
    //   data: "",
    // },
  ];

  const columns = [
    {
      name: "Order Date",
      selector: (row) => moment(row.ordered_date).format("lll"),
    },
    {
      name: "Event",
      selector: (row) => (
        <div>
          <div>#{row.order_id}</div>
          <div>{row.event_name}</div>
        </div>
      ),
    },
    {
      name: "Seller",
      selector: (row) => row.seller_name,
    },
    {
      name: "Order Amount",
      selector: (row) => `₹${row.payment_amount}`,
    },
    {
      name: "Commission/Com.Tax",
      selector: (row) => (
        <div>
          <div>
            <span style={{ color: "black" }}>
              {(row.commission_percentage ?? 0).toFixed(2)}%
            </span>
            <span style={{ color: "black" }}>
              {" "}
              | ₹{row.commission_amount}
              {/* {commissionCalculation(row).commissionAmount} */}
            </span>
          </div>
          <div>
            <span style={{ color: "black" }}>
              {(row.commission_tax ?? 0).toFixed(2)}%
            </span>
            <span style={{ color: "black" }}>
              {" "}
              | ₹{row.tax_amount}
              {/* {commissionCalculation(row).commissionTax} */}
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "Payout Amount",
      selector: (row) => "₹" + row.payout_amount,
      // commissionCalculation(row).totalDeduction,
    },
    {
      name: "Status",
      selector: (row) => (
        <Badge
          style={{ fontSize: "8px" }}
          bg={
            row.payout_status === "Pending"
              ? "warning"
              : row.payout_status === "Initialized"
                ? "primary"
                : row.payout_status === "Processed"
                  ? "success"
                  : null
          }
        >
          <div className="pb-1">{row.payout_status}</div>
          <div>{row.created_date}</div>
        </Badge>
      ),
    },
    {
      name: "View",
      selector: (row) => (
        <div style={{ flexDirection: "row" }}>
          <div
            className="mt-2"
            style={{
              backgroundColor: "#36a3f7",
              padding: "5px 10px",
              borderRadius: "50px",
              cursor: "pointer",
              height: "32px",
              width: "33px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            title="View"
            onClick={() =>
              row.payout_status === "Processed"
                ? showProcessedDetails(row)
                : goDetails(row)
            }
          >
            <FaEye color="white" size={16} />
          </div>
          {row.payout_status === "Processed" && (
            <div
              className="my-2"
              style={{
                cursor: "pointer",
                backgroundColor: "#2f4e9e",
                padding: "7px 13px",
              }}
              title="Invoice"
              onClick={() => goInvoice(row)}
            >
              <FaRegFileAlt size={16} color="#ffffff" />
            </div>
          )}
        </div>
      ),
    },
    // {
    //   name: "Invoice",
    //   selector: (row) => (

    //   ),
    // },
  ];

  // console.log("allProductData", allProductData);
  // console.log("userBookingData", userBookingData);

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  // const uniqueSeller = allProductData.filter(
  //   (value, index, self) =>
  //     index === self.findIndex((t) => t.store === value.store)
  // );

  const downloadReport = () => {
    const dataToDownload = filteredRows.map((item) => ({
      Order_Date: moment(item.ordered_date).format("lll"),
      Event_Name: item.event_name,
      Seller_Name: item.seller_name,
      Payment_Amount: "₹" + item.payment_amount,
      Commission_Percentage: (item.commission_percentage ?? 0).toFixed(2) + "%",
      Commission_Amount: "₹" + item.commission_amount,
      Commission_Tax: (item.commission_tax ?? 0) + "%",
      Tax_Amount: "₹" + item.tax_amount,
      Payout_Amount: "₹" + item.payout_amount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Service");
    XLSX.writeFile(workbook, "payout-reports-service.xlsx");
  };

  return (
    <>
      {isLoading && <Loader />}

      <div style={{ backgroundColor: "white", borderRadius: "15px" }}>
        <div
          className="headerTitle-0-1-70 row p-3"
          style={{ borderBottom: "1px solid #f4f9fd" }}
        >
          <div className="col-md-8">Service Payouts</div>
          <div className="col-md-4 row">
            <Button
              variant="outline-success"
              className="col-md-5"
              style={{ width: "125px" }}
              onClick={downloadReport}
            >
              <TbFileTypeXls size={18} /> Download
            </Button>
            <div className="col-md-1"></div>
            <Button
              onClick={handleShowFilter}
              variant="outline-primary"
              className="col-md-5"
              style={{ width: "125px" }}
            >
              <FaFilter size={18} /> Filter
            </Button>
          </div>
        </div>

        {showFilter && (
          <div
            className="row p-3"
            style={{ borderBottom: "1px solid #f4f9fd" }}
          >
            {/* <div class="col-md-4 mb-2">
              <div>
                <label>Seller</label>
                <div class="select2-input">
                  <select
                    name="seller"
                    value={searchVendor}
                    onChange={(e) => setSearchVendor(e.target.value)}
                    style={{
                      border: "1px solid #ebedf2",
                      borderRadius: "4px",
                      padding: "5px",
                    }}
                  >
                    <option value="">Select</option>
                    {vendors.map((item) => (
                      <option value={item._id}>{item.vendor_name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div> */}
            <div class="col-md-4 mb-2">
              <div>
                <label>Search</label>
                <div class="select2-input">
                  <input
                    type="search"
                    placeholder="Search by Event name/Seller"
                    onChange={(e) => setSearchByName(e.target.value)}
                    value={searchByName}
                    style={{
                      border: "1px solid #ebedf2",
                      borderRadius: "4px",
                      padding: "5px",
                      width: "317px",
                    }}
                  />
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-2">
              <div>
                <label>Order From Date</label>
                <div>
                  <input
                    type="date"
                    name="orderFromDate"
                    value={orderFromDate}
                    onChange={(e) => setOrderFromDate(e.target.value)}
                    style={{
                      border: "1px solid #ebedf2",
                      borderRadius: "4px",
                      padding: "5px",
                      width: "317px",
                    }}
                  />
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-2">
              <div>
                <label>Order To Date</label>
                <div>
                  <input
                    type="date"
                    name="orderToDate"
                    value={orderToDate}
                    onChange={(e) => setOrderToDate(e.target.value)}
                    style={{
                      border: "1px solid #ebedf2",
                      borderRadius: "4px",
                      padding: "5px",
                      width: "317px",
                    }}
                  />
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-2">
              <div className="mt-2">
                <label>Payout Status</label>
                <div>
                  <select
                    name="payoutStatus"
                    value={payoutStatus}
                    onChange={(e) => setPayoutStatus(e.target.value)}
                    style={{
                      border: "1px solid #ebedf2",
                      borderRadius: "4px",
                      padding: "5px",
                      width: "317px",
                    }}
                  >
                    <option value="" selected="selected">
                      Select
                    </option>
                    <option value="Pending" data-select2-id="26">
                      Pending
                    </option>
                    <option value="Initialized" data-select2-id="27">
                      Initialized
                    </option>
                    <option value="Processed" data-select2-id="28">
                      Processed
                    </option>
                    <option value="Failed" data-select2-id="29">
                      Failure
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-2">
              <div className="mt-2">
                <label></label>
                <button
                  style={{ marginTop: "25px" }}
                  className="btn btn-primary"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* <div style={{ textAlign: "right" }}>
        <input
          type="search"
          // value={serviceName}
          placeholder="🔍 Search..."
          // onChange={(e) => setServiceName(e.target.value)}
          style={{
            fontSize: "14px",
            padding: "7px",
            border: "1px solid #ebedf2",
            outline: 0,
            width: "25%",
            borderRadius: "7px",
          }}
        />
        <br /> <br />
      </div> */}
        <div style={{ borderBottom: "1px solid #f4f9fd" }}></div>
        <div className="row p-3">
          <div className="col-md-4">
            <div className="payouts-card payouts-border-success">
              <div className="payouts-card-body">
                <h3 className="payouts-card-title">Processed</h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ color: "#575962", fontSize: "1.75rem" }}>
                    ₹{processedAmount?.toFixed(2)}
                  </div>
                  <div
                    style={{
                      backgroundColor: "#36a3f7",
                      padding: "5px 10px",
                      borderRadius: "50px",
                      cursor: "pointer",
                      height: "32px",
                      width: "33px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => handleOpenModal("Processed")}
                  >
                    <FaEye color="white" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="payouts-card payouts-border-warning">
              <div className="payouts-card-body">
                <h3 className="payouts-card-title">Pending</h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ color: "#575962", fontSize: "1.75rem" }}>
                    ₹{pendingAmount?.toFixed(2)}
                  </div>
                  <div
                    style={{
                      backgroundColor: "#36a3f7",
                      padding: "5px 10px",
                      borderRadius: "50px",
                      cursor: "pointer",
                      height: "32px",
                      width: "33px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => handleOpenModal("Pending")}
                  >
                    <FaEye color="white" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="payouts-card payouts-border-primary">
              <div className="payouts-card-body">
                <h3 className="payouts-card-title">Processing</h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ color: "#575962", fontSize: "1.75rem" }}>
                    ₹{processingAmount?.toFixed(2)}
                  </div>
                  <div
                    style={{
                      backgroundColor: "#36a3f7",
                      padding: "5px 10px",
                      borderRadius: "50px",
                      cursor: "pointer",
                      height: "32px",
                      width: "33px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => handleOpenModal("Processing")}
                  >
                    <FaEye color="white" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderBottom: "1px solid #f4f9fd" }}></div>
        <DataTable
          // className={styles.dQcPXM}
          columns={columns}
          data={filteredRows}
          pagination
        />
      </div>
      <Modal size="lg" onHide={() => setShowModal(false)} show={showModal}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Process Payout
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table
            striped
            className="table"
            style={{
              border: "1px solid #f4f4f4",
            }}
          >
            {processPayout.map((ele) => (
              <tr style={inlineStyles.tableRow}>
                <th style={inlineStyles.tableHeader}>{ele.header} </th>
                <td style={inlineStyles.tableData}> {ele.data}</td>
              </tr>
            ))}
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      {/* payout data basedon status */}
      <Modal
        size="lg"
        centered
        onHide={() => setIsModalOpen(false)}
        show={isModalOpen}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {statusType}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table
            striped
            className="table"
            style={{
              border: "1px solid #f4f4f4",
            }}
          >
            {/* {statusType === "Pending" &&
             {statusType === "Processing" && */}

            <tbody>
              <tr>
                <th>Order Date </th>
                <th>Event Name </th>
                <th>Seller Name </th>
                <th>Payout Amount </th>
              </tr>
              {viewPayouts.map((ele) => (
                <tr>
                  <td> {moment(ele.ordered_date).format("lll")}</td>
                  <td>{ele.event_name}</td>
                  <td>{ele.seller_name}</td>
                  <td>₹{ele.payout_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    </>
  );
}
const inlineStyles = {
  tableRow: {
    borderBottom: "1px solid #f4f4f4",
  },
  tableData: {
    borderLeft: "1px solid #f4f4f4",
    padding: "8px",
    fontSize: "14px",
  },
  tableHeader: {
    width: "170px",
    color: "#333",
    fontWeight: "600",
    fontSize: "14px",
    padding: "8px",
  },
};

export default ServicePayouts;
