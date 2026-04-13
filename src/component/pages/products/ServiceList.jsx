import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../../api-services/apiContents";
import { FaCheck } from "react-icons/fa6";
import { MdDelete, MdMotionPhotosOff } from "react-icons/md";
import { FaEye, FaFilter } from "react-icons/fa";
import { Badge } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Loader from "../../loader/Loader";
import { FaDownload } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

function ServiceList() {
  const Navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [serviceListData, setServiceListData] = useState([]);
  const [allServiceList, setAllServiceList] = useState([]);
  const [search, setSearch] = useState("");
  const [statusType, setStatusType] = useState("");
  const [serviceType, setServiceType] = useState("Select");

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_ALL_SERVICE}`);
      if (res.status === 200) {
        // console.log("res", res);
        // list of service which added by admin
        setServiceListData(res.data.data);
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const serviceRes = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_VENDOR_SERVICE}`,
        );
        if (serviceRes.status === 200) {
          // console.log("all", serviceRes.data);
          // SERVICE LIST ADDED BY VENDOR
          setAllServiceList(serviceRes.data);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const searchResults =
    allServiceList.length > 0
      ? allServiceList
          .filter((prod) => {
            if (search) {
              const lowerSearch = search.toLowerCase();
              return (
                prod.service_name.toLowerCase().includes(lowerSearch) ||
                prod.vendor_name.toLowerCase().includes(lowerSearch) ||
                prod.shop_name.toLowerCase().includes(lowerSearch)
              );
            }
            return true;
          })
          .filter((item) => {
            if (statusType === "") return true;
            return item.approval_status === statusType;
          })
          .filter((ele) => {
            if (serviceType === "Select") return true;
            return ele.service_category === serviceType;
          })
      : [];

  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_VENDOR_SERVICE}${id}`,
      );
      if (res.status === 200) {
        alert("Service Deleted");
        // fetchList();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const downloadReport = () => {
    const dataToDownload = searchResults.map((item) => ({
      Service_Name: item.service_name,
      Vendor: item.vendor_name,
      Image: item.additional_images[0],
      status: item.approval_status,
      Action: item.isActive ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "vendor");
    XLSX.writeFile(workbook, "Service-list.xlsx");
  };

  const navigateToDetailedPage = (row) => {
    Navigate("/product/service-details", {
      state: {
        service: row,
      },
    });
  };

  const columns = [
    {
      name: "Service Name",
      selector: (row) => row.service_name,
    },
    {
      name: "Service Category",
      selector: (row) => row.service_category,
    },
    {
      name: "Image",
      selector: (row) => {
        const imageUrl =
          row.additional_images && row.additional_images.length > 0
            ? row.additional_images[0]
            : "placeholder.jpg";

        return (
          <div style={{ padding: "5px" }}>
            <img src={imageUrl} alt="Product" style={{ width: "45px" }} />
          </div>
        );
      },
      sortable: false,
    },
    {
      name: "Price",
      selector: (row) => "₹" + row.price,
    },
    {
      name: "Vendor",
      selector: (row) => row.vendor_name,
    },
    {
      name: "Shop Name",
      selector: (row) => row.shop_name,
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
              row.approval_status === "Under Review"
                ? "warning"
                : row.approval_status === "Approved"
                  ? "success"
                  : "danger"
            }
          >
            {row.approval_status}
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
            }}
            title="View"
            onClick={() => navigateToDetailedPage(row)}
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
            onClick={() => deleteItem(row._id)}
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

  return (
    <div style={{ backgroundColor: "white" }}>
      {isLoading && <Loader />}
      <div className="row mt-2 mb-1 pt-3 ps-2">
        <div className="col-md-7">
          <input
            type="search"
            value={search}
            placeholder="Search product/vendor/shop"
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
        <div className="col-md-5 d-flex" style={{ justifyContent: "flex-end" }}>
          <select
            style={{
              border: "1px solid #ebedf2",
              padding: "2px 5px",
              borderRadius: "5px",
            }}
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="Select">Select</option>
            {serviceListData.map((ele, idx) => (
              <option key={idx} value={ele.service_name}>
                {ele.service_name}
              </option>
            ))}
          </select>
          <select
            style={{
              border: "1px solid #ebedf2",
              padding: "2px 5px",
              borderRadius: "5px",
              marginLeft: 10,
            }}
            value={statusType}
            onChange={(e) => setStatusType(e.target.value)}
          >
            <option value="">Filter</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Disapproved">Disapproved</option>
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
  );
}

export default ServiceList;
