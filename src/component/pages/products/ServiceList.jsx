import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
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
import { useConfirm } from "../../common/ConfirmProvider";

const normalize = (v) =>
  v === null || v === undefined ? "" : String(v).toLowerCase().trim();

function ServiceList() {
  const confirm = useConfirm();
  const Navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [serviceListData, setServiceListData] = useState([]);
  const [allServiceList, setAllServiceList] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusType, setStatusType] = useState("");
  const [serviceType, setServiceType] = useState("Select");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 180);
    return () => clearTimeout(id);
  }, [search]);

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

  const searchResults = useMemo(() => {
    if (!allServiceList.length) return [];
    const term = normalize(debouncedSearch);
    const serviceFilter = normalize(serviceType === "Select" ? "" : serviceType);
    const statusFilter = normalize(statusType);
    const terms = term.split(/\s+/).filter(Boolean);

    return allServiceList.filter((item) => {
      if (serviceFilter && normalize(item.service_category) !== serviceFilter)
        return false;
      if (statusFilter && normalize(item.approval_status) !== statusFilter)
        return false;
      if (!terms.length) return true;
      const haystack = [
        item.service_name,
        item.vendor_name,
        item.shop_name,
        item.service_category,
        item.approval_status,
      ]
        .map(normalize)
        .join(" ");
      return terms.every((t) => haystack.includes(t));
    });
  }, [allServiceList, debouncedSearch, statusType, serviceType]);

  const deleteItem = async (id) => {
    const ok = await confirm({
      title: "Delete Service",
      message: "Are you sure you want to delete this service? This action cannot be undone.",
      confirmText: "Yes, Delete",
      cancelText: "No",
      variant: "danger",
    });
    if (!ok) return;
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_VENDOR_SERVICE}${id}`,
      );
      if (res.status === 200) {
        alert("Service Deleted");
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
