import React, { useEffect, useState } from "react";
import Loader from "../../../loader/Loader";
import axios from "axios";
import { apiUrl } from "../../../../api-services/apiContents";
import DataTable from "react-data-table-component";
import { Badge, Button } from "react-bootstrap";
import { TbFileTypeXls } from "react-icons/tb";
import { FaFilter } from "react-icons/fa";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

function VendorInvoice() {
  const Navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [allInvoice, setAllInvoice] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [createdDate, setCreatedDate] = useState("");
  const [searchByName, setSearchByName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_ALL_INVOICE}`
        );
        console.log("API URL", `${apiUrl.BASEURL}${apiUrl.GET_ALL_INVOICE}`);
        if (res.status === 200) {
          setAllInvoice(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const filterProcessedRows = (rows) => {
    return rows.filter((row) => {
      const matchesSearches =
        searchByName &&
        (row.vendor?.vendor_name
          ?.toLowerCase()
          .includes(searchByName.toLowerCase()) ||
          row.event?.event_name
            ?.toLowerCase()
            .includes(searchByName.toLowerCase()) ||
          row.invoice_number
            ?.toLowerCase()
            .includes(searchByName.toLowerCase()));

      const matchesCreatedDate = createdDate
        ? moment(row.generated_date).format("ll") ===
          moment(createdDate).format("ll")
        : true;

      return (!searchByName || matchesSearches) && matchesCreatedDate;
    });
  };

  const filteredRows = filterProcessedRows(allInvoice);

  const goInvoice = (row) => {
    Navigate("/view-invoice", {
      state: {
        data: row,
      },
    });
  };

  // console.log("createdDate", createdDate);
  // console.log("allInvoice", allInvoice);
  console.log("filteredRows", filteredRows);

  const downloadReport = () => {
    const dataToDownload = filteredRows.map((item) => ({
      Invoice_Date: item.generated_date,
      Invoice_Number: item.invoice_number,
      Event_Name: item.event?.event_name,
      Vendor: item.vendor?.vendor_name,
      Payout_Amount: item.amount_to_paid,
      status: item.invoice_status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "invoice");
    XLSX.writeFile(workbook, "Vendor-Invoice.xlsx");
  };

  const columns = [
    {
      name: "Created Date",
      selector: (row) => row.generated_date,
    },
    {
      name: "Invoice Number",
      selector: (row) => (
        <div>
          <div>{row.invoice_number}</div>
        </div>
      ),
    },
    {
      name: "Event",
      selector: (row) => (
        <div>
          {/* <div>Ord.Id: #{row.event._id?.slice(-6)?.toUpperCase()}</div> */}
          <div>{row.event?.event_name}</div>
        </div>
      ),
    },
    {
      name: "Vendor",
      selector: (row) => row.vendor?.vendor_name,
    },

    {
      name: "Payout Amount",
      selector: (row) => row.amount_to_paid,
    },
    {
      name: "Status",
      selector: (row) => (
        <Badge bg="success">
          <div className="pb-1">{row.invoice_status}</div>
        </Badge>
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <div
          className="my-2"
          style={{
            cursor: "pointer",
            backgroundColor: "#2f4e9e",
            padding: "7px 13px",
            color: "white",
          }}
          title="Invoice"
          onClick={() => goInvoice(row)}
        >
          View
          {/* <FaRegFileAlt size={16} color="#ffffff" /> */}
        </div>
      ),
    },
  ];

  return (
    <>
      {isLoading && <Loader />}
      <div style={{ backgroundColor: "white", borderRadius: "15px" }}>
        <div
          className="headerTitle-0-1-70 row p-3"
          style={{ borderBottom: "1px solid #f4f9fd" }}
        >
          <div className="col-md-8">Vendor Invoice</div>
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
            <div class="col-md-4 mb-2">
              <div>
                <label>Search</label>
                <div class="select2-input">
                  <input
                    type="search"
                    placeholder="Search by Event name/Vendor/Invoice Num"
                    onChange={(e) => setSearchByName(e.target.value)}
                    value={searchByName}
                    style={{
                      border: "1px solid #ebedf2",
                      borderRadius: "4px",
                      padding: "5px",
                      width: "317px",
                    }}
                  />{" "}
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-2">
              <div>
                <label>Created Date</label>
                <div>
                  <input
                    type="date"
                    name="createdDate"
                    value={createdDate}
                    onChange={(e) => setCreatedDate(e.target.value)}
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
            {/* <div class="col-md-4 mb-2">
              <div>
                <label>Order To Date</label>
                <div>
                  <input
                    type="date"
                    name="orderToDate"
                    // value={orderToDate}
                    // onChange={(e) => setOrderToDate(e.target.value)}
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
                    // value={payoutStatus}
                    // onChange={(e) => setPayoutStatus(e.target.value)}
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
            </div> */}
            <div class="col-md-4 mb-2">
              <div className="mt-4">
                <label />
                <button
                  style={{ marginTop: "3px" }}
                  className="btn btn-primary"
                  // onClick={resetFilters}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
        <div>
          <DataTable
            // className={styles.dQcPXM}
            columns={columns}
            data={filteredRows}
            pagination
          />
        </div>
      </div>
    </>
  );
}

export default VendorInvoice;
