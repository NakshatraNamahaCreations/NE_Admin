import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { MdDelete } from "react-icons/md";
import { apiUrl } from "../../../api-services/apiContents";
import axios from "axios";
import { postData } from "../../../api-services/apiHelper";
import Loader from "../../loader/Loader";
import * as XLSX from "xlsx";
import { MdBlock } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

function State() {
  const [stateName, setStateName] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [searchState, setSearchState] = useState("");
  const [stateList, setStateList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_STATE}`);
      if (res.status === 200) {
        console.log("state list", res.data);
        setStateList(res.data.data.reverse());
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

  const addState = async () => {
    if (!stateName || !stateCode) {
      alert("State Name and State Code should not be empty");
    } else {
      try {
        const data = {
          state_name: stateName,
          state_code: stateCode,
        };
        const res = await postData(`${apiUrl.ADD_STATE}`, data);
        if (res) {
          alert("State Added");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const deleteState = async (id) => {
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_STATE}${id}`,
      );
      if (res.status === 200) {
        alert("State Deleted");
        fetchList();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const activeStatus = async (id) => {
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.ACTIVE_STATUS}${id}`,
      );
      if (res.status === 200) {
        fetchList();
        alert(res.data.message || "State status updated!");
      }
    } catch (error) {
      console.error("Error updating state status:", error);
    }
  };

  const inActiveStatus = async (id) => {
    try {
      const res = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.INACTIVE_STATUS}${id}`,
      );
      if (res.status === 200) {
        fetchList();
        alert(res.data.message || "State status updated!");
      }
    } catch (error) {
      console.error("Error updating state status:", error);
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
    if (file === "") {
      alert("Please select a file");
    } else {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          console.log("Raw Excel Data:", jsonData);
          // Ensure we map the Excel column "Service Name" to the backend expected "service_name"
          const jsonData1 = jsonData.map((item) => ({
            service_name: item["Service_Name"],
          }));

          console.log("Mapped Data:", jsonData1); // Check if data is properly mapped

          try {
            axios.post(
              `${apiUrl.BASEURL}${apiUrl.ADD_SERVICE_VIA_EXCEL}`,
              jsonData1,
            );
            alert("State Added!!!");
            window.location.reload();
          } catch (error) {
            console.error("Error sending data to backend:", error);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert("Please upload a file first.");
      }
    }
  };

  const columns = [
    {
      name: "Sl.No",
      selector: (row, index) => index + 1,
    },

    {
      name: "State Name",
      selector: (row) => row.state_name,
      sortable: true,
    },
    {
      name: "State Code",
      selector: (row) => row.state_code,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <div style={{ display: "flex" }}>
            {/* <div
              style={{
                backgroundColor: "#ffa534",
                padding: "7px 4px",
                cursor: "pointer",
              }}
              // onClick={() => editTeam(row._id)}
              title="Edit"
            >
              <MdEdit size={16} color="white" />
            </div> */}
            <div
              style={{
                backgroundColor: row.isStateActive ? "#35cd3a" : "#2f4e9e",
                padding: "7px 4px",
                cursor: "pointer",
              }}
              title={row.isStateActive ? "Active" : "Inactive"}
            >
              {row.isStateActive ? (
                <FaCheckCircle
                  onClick={() => inActiveStatus(row._id)}
                  size={16}
                  color="white"
                />
              ) : (
                <MdBlock
                  size={16}
                  onClick={() => activeStatus(row._id)}
                  color="white"
                />
              )}
            </div>
            <div
              style={{
                backgroundColor: "#E91E63",
                padding: "7px 4px",
                cursor: "pointer",
              }}
              onClick={() => deleteState(row._id)}
              title="Delete"
            >
              <MdDelete size={16} color="white" />
            </div>
          </div>
        </>
      ),
      // sortable: true,
    },
  ];
  const downloadDataset = () => {
    const dataToDownload = stateList.map((item) => ({
      service_name: item.service_name, // Include only the service_name field
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Service List");
    XLSX.writeFile(workbook, "service-list.xlsx");
  };

  const [debouncedSearchState, setDebouncedSearchState] = useState(searchState);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchState(searchState), 300);
    return () => clearTimeout(timeout);
  }, [searchState]);

  const filteredServiceListData = stateList.filter(
    (service) =>
      service.state_name
        .toLowerCase()
        .includes(debouncedSearchState.toLowerCase()) ||
      service.state_code
        .toLowerCase()
        .includes(debouncedSearchState.toLowerCase()),
  );

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
                  State Name <span style={{ color: "red" }}>*</span>
                </h6>

                <input
                  type="text"
                  //   value={stateName}
                  placeholder="e.g. Karnataka"
                  onChange={(e) => setStateName(e.target.value)}
                  style={{ fontSize: "14px", padding: "4px 7px" }}
                />
              </div>
              <div>
                <h6 className="mt-3" style={styles.header}>
                  State Code <span style={{ color: "red" }}>*</span>
                </h6>

                <input
                  type="text"
                  //   value={stateCode}
                  placeholder="e.g. KA"
                  onChange={(e) => setStateCode(e.target.value)}
                  style={{ fontSize: "14px", padding: "4px 7px" }}
                />
              </div>
              <div className="mt-3 mb-2">
                <button onClick={addState} style={styles.buttonForEveything}>
                  Add State
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
                    <h3 style={styles.itemsHead}>State List</h3>
                  </div>
                  <div style={{ justifyContent: "flex-end" }}>
                    {/* <b style={{ fontSize: "12px" }}>Search: </b> */}
                    <input
                      className="ms-1"
                      placeholder="Search state or code"
                      style={{
                        border: "1px solid #ebedf2",
                        padding: "2px 5px",
                        borderRadius: "5px",
                      }}
                      onChange={(e) => setSearchState(e.target.value)}
                    />{" "}
                    {/* <FaDownload
                      onClick={downloadDataset}
                      className="ms-2 me-2"
                      style={{ cursor: "pointer" }}
                      size={16}
                      color="#2F4E9E"
                    /> */}
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

export default State;
