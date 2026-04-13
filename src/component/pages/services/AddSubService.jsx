import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
// import { FaEye } from "react-icons/fa";
// import { RxSlash } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { apiUrl } from "../../../api-services/apiContents";
import axios from "axios";
import { postData } from "../../../api-services/apiHelper";
import Loader from "../../loader/Loader";
import * as XLSX from "xlsx";
import Switch from "react-switch";
import { Badge } from "react-bootstrap";
import { FaDownload } from "react-icons/fa6";

function AddSubService() {
  const [serviceName, setServiceName] = useState("");
  const [serviceSubCategory, setServiceSubCategory] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [serviceListData, setServiceListData] = useState([]);
  const [subServiceListData, setSubServiceListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [searchServive, setSearchServive] = useState("");
  const [statusType, setStatusType] = useState("");

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const serviceRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ACTIVE_SERVICE}`
      );
      if (serviceRes.status === 200) {
        setServiceListData(serviceRes.data.data);
      }
      const subServiceRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ALL_SUB_SERVICE}`
      );
      if (subServiceRes.status === 200) {
        setSubServiceListData(subServiceRes.data.data);
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

  const handleService = (e) => {
    let data = e.target.value;
    let serviceList = serviceListData.find((ele) => ele._id === data);
    setServiceName(serviceList.service_name);
    setServiceId(serviceList._id);
  };

  const addSubService = async () => {
    if (!serviceName || !serviceSubCategory) {
      alert("Please fill all fields");
    } else {
      try {
        const data = {
          service_name: serviceName,
          service_id: serviceId,
          sub_service_name: serviceSubCategory,
        };
        const res = await postData(`${apiUrl.ADD_SUB_SERVICE}`, data);
        if (res) {
          alert("Added");
          // window.location.reload(); //add later
          setServiceName("");
          setServiceId("");
          setServiceSubCategory("");
          fetchList();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const toggleServiceStatus = async (id, currentStatus) => {
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.UPDATE_SUB_SERVICE_STATUS}${id}`,
        {
          isActive: !currentStatus, // Toggle the current status
        }
      );
      if (res.status === 200) {
        fetchList(); // Refresh the service list
        alert(res.data.message || "Status updated!");
      }
    } catch (error) {
      console.error("Error updating the status:", error);
    }
  };

  const deleteService = async (id) => {
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_SUB_SERVICE}/${id}`
      );
      if (res.status === 200) {
        // alert("Service Deleted");
        fetchList();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const downloadExcel = () => {
  //   const worksheet = XLSX.utils.json_to_sheet([
  //     { Service_Name: "Service Name" },
  //   ]);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Service Name");
  //   XLSX.writeFile(workbook, "services-template.xlsx");
  // };

  // const uploadFile = (event) => {
  //   const uploadedFile = event.target.files[0];
  //   setFile(uploadedFile);
  // };

  // const addExcel = async () => {
  //   if (file === "") {
  //     alert("Please select a file");
  //   } else {
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         const data = new Uint8Array(e.target.result);
  //         const workbook = XLSX.read(data, { type: "array" });
  //         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //         const jsonData = XLSX.utils.sheet_to_json(worksheet);
  //         console.log("Raw Excel Data:", jsonData);
  //         // Ensure we map the Excel column "Service Name" to the backend expected "service_name"
  //         const jsonData1 = jsonData.map((item) => ({
  //           service_name: item["Service_Name"],
  //         }));

  //         console.log("Mapped Data:", jsonData1); // Check if data is properly mapped

  //         try {
  //           axios.post(
  //             `${apiUrl.BASEURL}${apiUrl.ADD_SERVICE_VIA_EXCEL}`,
  //             jsonData1
  //           );
  //           alert("Service Added!!!");
  //           window.location.reload();
  //         } catch (error) {
  //           console.error("Error sending data to backend:", error);
  //         }
  //       };
  //       reader.readAsArrayBuffer(file);
  //     } else {
  //       alert("Please upload a file first.");
  //     }
  //   }
  // };

  const columns = [
    // {
    //   name: "Sl.No",
    //   selector: (row, index) => index + 1,
    // },

    {
      name: "Service Name",
      selector: (row) => row.service_name,
      sortable: true,
    },
    {
      name: "Sub category",
      selector: (row) => row.sub_service_name,
      sortable: true,
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
        <>
          <div
            style={{
              display: "flex",
            }}
          >
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
        </>
      ),
      // sortable: true,
    },
  ];

  const filteredServiceListData = subServiceListData
    .filter((service) => {
      if (searchServive) {
        return service.sub_service_name
          .toLowerCase()
          .includes(searchServive.toLowerCase());
      }
      return true;
    })
    .filter((item) => {
      if (statusType === "") {
        return true;
      }
      return item.isActive === (statusType === "true");
    });

  const downloadDataset = () => {
    const dataToDownload = filteredServiceListData.map((item) => ({
      service_name: item.service_name,
      subcategory_name: item.sub_service_name,
      status: item.isActive ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subcategory-list");
    XLSX.writeFile(workbook, "subcategory-list.xlsx");
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

              // rgb(95 95 95)
              borderRadius: "5px",
            }}
          >
            <div className="p-2">
              <div>
                <h6 className="mt-3" style={styles.header}>
                  Select Service:
                </h6>

                <select
                  style={{ padding: "4px 7px", fontSize: "14px" }}
                  onChange={handleService}
                >
                  <option value="">---Select Service---</option>
                  {serviceListData.map((ele) => (
                    <option value={ele._id}>{ele.service_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <h6 className="mt-3" style={styles.header}>
                  Enter Subcategory
                </h6>

                <input
                  type="text"
                  value={serviceSubCategory}
                  placeholder="e.g. Catering Service"
                  onChange={(e) => setServiceSubCategory(e.target.value)}
                  style={{ fontSize: "14px", padding: "4px 7px" }}
                />
              </div>
              <div className="mt-3 mb-2">
                <button
                  onClick={addSubService}
                  style={styles.buttonForEveything}
                >
                  Add Service
                </button>
              </div>
              {/* <div
                style={{
                  borderBottom: "1px solid #f4f4f4",
                }}
              ></div>
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
              </div> */}
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
                    <h3 style={styles.itemsHead}>Subservice List</h3>
                  </div>
                  <div style={{ justifyContent: "flex-end" }}>
                    {/* <b style={{ fontSize: "12px" }}>Search: </b> */}
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
                    //   defaultSortFieldId={1}
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

export default AddSubService;
