import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { MdDelete } from "react-icons/md";
import { apiUrl } from "../../../api-services/apiContents";
import axios from "axios";
import Loader from "../../loader/Loader";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa6";
import Switch from "react-switch";
import { Badge } from "react-bootstrap";
import { useConfirm } from "../../common/ConfirmProvider";

function AddService() {
  const confirm = useConfirm();
  const [serviceName, setServiceName] = useState("");
  const [searchServive, setSearchServive] = useState("");
  const [serviceListData, setServiceListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [statusType, setStatusType] = useState("");
  const [serviceImage, setServiceImage] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setServiceImage(selected);
    }
  };

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_ALL_SERVICE}`);
      if (res.status === 200) {
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

  const addService = async () => {
    if (!serviceName || !serviceImage) {
      alert("Service Name and Service Image should not be empty");
      return;
    }
    const formData = new FormData();
    formData.append("service_image", serviceImage);
    formData.append("service_name", serviceName);

    try {
      const res = await axios.post(
        `${apiUrl.BASEURL}${apiUrl.ADD_SERVICE}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      if (res.status === 200 || res.status === 201) {
        alert("Service Added Successfully");
        setServiceName("");
        setServiceImage(null);
        fetchList();
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        error?.response?.data?.message || "Failed to add service. Try again.",
      );
    }
  };

  const deleteService = async (id) => {
    const ok = await confirm({
      title: "Delete Service",
      message:
        "Are you sure you want to delete this service? This action cannot be undone.",
      confirmText: "Yes, Delete",
      cancelText: "No",
      variant: "danger",
    });
    if (!ok) return;
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_SERVICE}/${id}`,
      );
      if (res.status === 200) {
        fetchList();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleServiceStatus = async (id, currentStatus) => {
    const next = !currentStatus;
    const ok = await confirm({
      title: `${next ? "Activate" : "Deactivate"} Service`,
      message: `Are you sure you want to change the status to ${
        next ? "Active" : "Inactive"
      }?`,
      confirmText: "Yes",
      cancelText: "No",
      variant: next ? "success" : "warning",
    });
    if (!ok) return;
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.UPDATE_SERVICE_STATUS}${id}`,
        {
          isActive: next,
        },
      );
      if (res.status === 200) {
        fetchList();
        alert(res.data.message || "Service status updated!");
      }
    } catch (error) {
      console.error("Error updating service status:", error);
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      { Service_Name: "Service Name" },
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Service Name");
    XLSX.writeFile(workbook, "services-template.xlsx");
  };

  const uploadFile = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const addExcel = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const jsonData1 = jsonData
        .map((item) => ({ service_name: item["Service_Name"] }))
        .filter((item) => item.service_name);

      try {
        await axios.post(
          `${apiUrl.BASEURL}${apiUrl.ADD_SERVICE_VIA_EXCEL}`,
          jsonData1,
        );
        alert("Services Added!");
        setFile(null);
        fetchList();
      } catch (error) {
        console.error("Error sending data to backend:", error);
        alert(
          error?.response?.data?.message ||
            "Failed to import services via excel.",
        );
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const columns = [
    {
      name: "Service Name",
      selector: (row) => row.service_name,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => (
        <div style={{ padding: "5px" }}>
          <img
            src={row.service_image}
            alt={row.service_name}
            style={{ width: "80px", height: "80px", borderRadius: "10px" }}
          />
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => (
        <Badge className="ms-2" bg={row.isActive ? "success" : "danger"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <div style={{ display: "flex" }}>
          <Switch
            onChange={() => toggleServiceStatus(row._id, row.isActive)}
            checked={row.isActive}
            onColor="#080"
            offHandleColor="#ddd"
            onHandleColor="#ddd"
            offColor="#888"
            handleDiameter={15}
            uncheckedIcon={false}
            checkedIcon={false}
            height={15}
            width={25}
          />{" "}
          /{" "}
          <div
            style={{ cursor: "pointer" }}
            title="Delete"
            onClick={() => deleteService(row._id)}
          >
            <MdDelete size={20} color="#E91E63" />
          </div>
        </div>
      ),
    },
  ];

  const filteredServiceListData = serviceListData
    .filter((service) => {
      if (searchServive) {
        return service.service_name
          .toLowerCase()
          .includes(searchServive.toLowerCase());
      }
      return true;
    })
    .filter((item) => {
      if (statusType === "") return true;
      return item.isActive === (statusType === "true");
    });

  const downloadDataset = () => {
    const dataToDownload = filteredServiceListData.map((item) => ({
      service_name: item.service_name,
      service_image: item.service_image,
      status: item.isActive ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Service List");
    XLSX.writeFile(workbook, "service-list.xlsx");
  };

  return (
    <div>
      {isLoading && <Loader />}

      <div className="row mt-2">
        <div className="col-md-6">
          <div
            className="border-top-for-all-border"
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          >
            <div className="p-2">
              <div>
                <h6 className="mt-3" style={styles.header}>
                  Service Name:
                </h6>
                <input
                  type="text"
                  value={serviceName}
                  placeholder="e.g. Catering Service"
                  onChange={(e) => setServiceName(e.target.value)}
                  style={{ fontSize: "14px", padding: "4px 7px" }}
                />
              </div>
              <div>
                <h6 className="mt-3" style={styles.header}>
                  Service Image:
                </h6>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ fontSize: "14px", padding: "4px 7px" }}
                />
              </div>
              <div className="mt-3 mb-2">
                <button onClick={addService} style={styles.buttonForEveything}>
                  Add Service
                </button>
              </div>
              <div style={{ borderBottom: "1px solid #f4f4f4" }}></div>
              <p className="mt-1" style={{ fontSize: "12px", color: "blue" }}>
                <b>*Add multiple services through excel</b>
              </p>
              <div className="mb-2 d-flex">
                <button
                  className="me-2"
                  onClick={downloadExcel}
                  style={styles.buttonForEveything}
                >
                  Download excel
                </button>
                <input
                  type="file"
                  placeholder="Upload file"
                  onChange={uploadFile}
                />
                <button onClick={addExcel} style={styles.buttonForEveything}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
        {!isLoading && (
          <div className="col-md-6">
            <div
              className="border-top-for-all-border"
              style={{
                backgroundColor: "white",
                borderRadius: "5px",
              }}
            >
              <div className="p-2">
                <div
                  className="p-3"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <div>
                    <h3 style={styles.itemsHead}>Service List</h3>
                  </div>
                  <div style={{ justifyContent: "flex-end" }}>
                    <input
                      className="ms-1"
                      placeholder="Search service"
                      style={{
                        border: "1px solid #ebedf2",
                        padding: "2px 5px",
                        borderRadius: "5px",
                      }}
                      onChange={(e) => setSearchServive(e.target.value)}
                    />{" "}
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
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>{" "}
                    <FaDownload
                      onClick={downloadDataset}
                      className="ms-2 me-2"
                      style={{ cursor: "pointer" }}
                      size={16}
                      color="#2F4E9E"
                    />
                  </div>
                </div>
                <div>
                  <DataTable
                    columns={columns}
                    data={filteredServiceListData}
                    pagination
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  itemsHead: {
    color: "#333",
    fontWeight: "500",
    fontSize: "17px",
  },
  header: {
    color: "#333",
    fontSize: "14px",
  },
  selector: {
    color: "#555",
    width: "100%",
    padding: "6px 12px",
    border: "1px solid #ccc",
  },
  buttonForEveything: {
    backgroundColor: "#609ecc",
    border: "#7ac536",
    color: "white",
    borderRadius: "3px",
    fontSize: "14px",
    padding: "5px 10px",
  },
};

export default AddService;
