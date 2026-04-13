import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "../../../../styles/booking-history.css";
import { FaEye, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { get } from "../../../../api-services/apiHelper";
import { apiUrl } from "../../../../api-services/apiContents";
import Loader from "../../../loader/Loader";
import GlobalContext from "../../../../hooks/GlobalProvider";
import { FaCheck } from "react-icons/fa6";
import { MdDelete, MdMotionPhotosOff } from "react-icons/md";
import { Badge, Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import { TbFileTypeXls } from "react-icons/tb";
import axios from "axios";
import { FaDownload } from "react-icons/fa6";

function VendorList() {
  const Navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  // const [vendorsLength, setVendorsLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { setGlobalData } = useContext(GlobalContext);
  const [statusType, setStatusType] = useState("");

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const data = await get(apiUrl.GET_ALL_VENDOR);
      setVendors(data.reverse());
      setGlobalData((prevData) => ({
        ...prevData,
        vendorsLength: data.length, // Set vendorsLength in globalData
      }));
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [setGlobalData]);

  console.log("vendors", vendors);

  const viewVendorDetails = (row) => {
    Navigate("/vendor/vendor-profile", {
      state: {
        vendor: row,
      },
    });
  };

  const deleteVendor = async (id) => {
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_VENDOR}${id}`,
      );
      if (res.status === 200) {
        alert("Vendor Deleted");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const searchResults = vendors
    .filter((vdr) => {
      if (search) {
        return (
          vdr.vendor_name.toLowerCase().includes(search.toLowerCase()) ||
          vdr.mobile_number.toLowerCase().includes(search.toLowerCase()) ||
          vdr.profession.toLowerCase().includes(search.toLowerCase())
        );
      }
      return true;
    })
    .filter((item) => {
      if (statusType === "") {
        return true;
      }
      return item.review_status === statusType;
    });
  // .filter((item) => {
  //   if (statusType === "") {
  //     return true;
  //   }
  //   return item.is_approved === (statusType === "true");
  // });

  console.log("searchResults", searchResults);

  const columns = [
    // {
    //   name: "Vendor Id",
    //   selector: (row, index) => row._id?.substring(row._id),
    //   sortable: true,
    // },
    {
      name: "Vendor Name",
      selector: (row) => (
        <>
          <div
            style={
              {
                //   color: "black",
                //   fontWeight: "700",
                //   paddingBottom: "6px",
                //   cursor: "pointer",
              }
            }
            // onClick={() => handleOpeningCanvas(row)}
          >
            {row.vendor_name}
          </div>
        </>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },

    {
      name: "Mobile",
      selector: (row) => "+91" + "-" + row.mobile_number,
    },
    {
      name: "Professional",
      selector: (row) => row.profession,
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          {/* // <div
        //   style={{
        //     backgroundColor: "#35cd3a",
        //     borderRadius: "5px",
        //     padding: "3px 7px",
        //     color: "white",
        //     borderRadius: "15px",
        //     // color: row.is_approved === true ? "green" : "red",
        //   }}
        // > */}
          <Badge
            bg={
              row.review_status === "Disapproved"
                ? "danger"
                : row.review_status === "Approved"
                  ? "success"
                  : "warning"
            }
          >
            {row.review_status}
          </Badge>
        </>
        // </div>
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <div style={{ display: "flex" }}>
          <div
            style={{
              cursor: "pointer",
              backgroundColor: "#2f4e9e",
              padding: "7px 13px",
              // borderRadius: "3px",
              // borderLeftBottomRadius: "3px",
              // borderLeftTopRadius: "3px",
            }}
            title="View"
            onClick={() => viewVendorDetails(row)}
          >
            <FaEye size={16} color="#ffffff" />
          </div>
          <div
            style={{
              cursor: "pointer",
              backgroundColor: "#e91e63",
              padding: "7px 13px",
              // borderLeftBottomRadius: "3px",
              // borderLeftTopRadius: "3px",
            }}
            title="Delete"
            onClick={() => deleteVendor(row._id)}
          >
            <MdDelete size={16} color="white" />
          </div>

          {/* <div
            style={{
              cursor: "pointer",
              backgroundColor: row.isActive ? "#198754" : "#ffc107",
              padding: "7px 13px",
            }}
            title={row.isActive ? "Active" : "Inactive"}
          >
            {row.isActive ? (
              <FaCheck size={16} color="white" />
            ) : (
              <MdMotionPhotosOff size={16} color="white" />
            )}
          </div> */}
        </div>
      ),
    },
  ];

  const downloadReport = () => {
    const dataToDownload = searchResults.map((item) => ({
      vendor_name: item.vendor_name,
      email: item.email,
      mobile: item.mobile_number,
      status: item.is_approved ? "Approved" : "Disapproved",
      Action: item.isActive ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "vendor");
    XLSX.writeFile(workbook, "vendors-list.xlsx");
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      {isLoading && <Loader />}
      {!isLoading && (
        <div>
          <div className="row mt-2 mb-1 pt-3 ps-2">
            <div className="col-md-8">
              <input
                type="search"
                value={search}
                placeholder="Search..."
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  fontSize: "14px",
                  padding: "7px",
                  border: "1px solid #ebedf2",
                  outline: 0,
                  width: "35%",
                  borderRadius: "7px",
                }}
              />
            </div>
            <div
              className="col-md-4 d-flex"
              style={{ justifyContent: "flex-end" }}
            >
              <select
                style={{
                  border: "1px solid #ebedf2",
                  padding: "2px 5px",
                  borderRadius: "5px",
                }}
                value={statusType}
                onChange={(e) => setStatusType(e.target.value)}
              >
                <option value="">Filter</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Disapproved">Disapproved</option>
                {/* <option value="">Filter</option>
                <option value="true">Approve</option>
                <option value="false">Disapprove</option> */}
              </select>
              <FaDownload
                onClick={downloadReport}
                className="ms-3 me-5"
                style={{ cursor: "pointer", marginTop: "10px" }}
                size={16}
                color="#2F4E9E"
              />
            </div>
          </div>

          <DataTable columns={columns} data={searchResults} pagination />
        </div>
      )}
    </div>
  );
}

export default VendorList;
